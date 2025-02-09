const express = require('express');
const Item = require('../models/Item');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userMiddleware = require("../middleware/userMiddleware");
const { secret, User } = require("../models/User")
const axios = require('axios');
require('dotenv').config();


const map_key =  process.env.APP_ENGINE_KEY;

let accessed = false;

router.post('/register', async (req, res) => {
    const userdata = req.body;
    if (!userdata.name || !userdata.email || !userdata.username || !userdata.password) {
        return res.status(400).json({
            msg: "Please give all the required fields",
            data: null
        })
    }
    const exists = await User.findOne({ username: userdata.username })

    if (!exists) {
        const hashedpassword = await bcrypt.hash(userdata.password, 10)
        userdata.password = hashedpassword;
        const user = new User(userdata)
        const data = await user.save();
        res.status(200).json({
            msg: "User created successfully",
            data: data
        })
    }
    else {
        res.status(400).json({
            msg: "User already exists",
            data: null
        })
    }

});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            msg: 'Both username and password are required',
            data: null
        });
    }
    const user = await User.findOne({ username: username });
    if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (isValidPassword) {
            const token = jwt.sign({ username }, secret);
            res.status(200).json({
                msg: "User logged in",
                data: token
            })
        }
        else {
            return res.status(401).json({
                msg: "Incorrect Password",
                data: null
            })
        }
    }
    else {
        res.status(404).json({
            msg: "Incorrect credentials",
            data: null
        })
    }
});

// GET USER PROFILE BY _id
router.get("/profile/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id); // Find user by ID
      if (!user) {
        return res.status(404).json({
          msg: "User not found",
          data: null,
        });
      }
      return res.status(200).json({
        msg: "User Details",
        data: user,
      });
    } catch (err) {
      console.error("Error fetching user details:", err);
      return res.status(500).json({
        msg: "Server error in /profile/:id",
        data: err,
      });
    }
  });

router.get("/profile", userMiddleware, async (req, res) => {
    const username = req.headers.username;
    try {
        const user = await User.findOne({ username: username });
        return res.status(200).json({
            msg: "User Details",
            data: user
        })
    }
    catch (err) {
        return res.status(500).json({
            msg: "Server error in /profile",
            data: err
        })
    }
})

router.put('/profile', userMiddleware, async (req, res) => {
    const username = req.headers.username;
    const userdata = req.body;

    try {
        const user = await User.findOne({ username: username });
        if (!userdata) {
            return res.status(400).json({
                msg: "Provide data to update",
                data: null
            })
        }
        if (userdata.username || userdata.password) {
            return res.status(400).json({
                msg: "Username and password cannot be updated",
                data: null
            });
        }

        await user.updateOne(userdata);
        return res.status(200).json({
            msg: "User has been updated",
            data: userdata
        })

    }
    catch (err) {
        return res.status(500).json({
            msg: "Server error in /profile",
            data: err
        })
    }
});

router.delete('/profile', userMiddleware, async (req, res) => {
    const username = req.headers.username;

    try {
        const user = await User.findOne({ username: username })
        await user.deleteOne({ username: username })
        return res.status(200).json({
            msg: "User Deleted",
            data: null
        })
    }
    catch (err) {
        return res.status(500).json({
            msg: "Error deleting user in /profile",
            data: err
        })
    }
})

router.get('/wishlist', userMiddleware, async (req, res) => {
    const username = req.headers.username;

    try {
        const user = await User.findOne({ username });

        const wishlist_items = await Item.find({ _id: { $in: user.wishlist } })

        return res.status(200).json({
            msg: "Wishlist details",
            data: wishlist_items
        })

    }
    catch (err) {
        return res.status(500).json({
            msg: "Server error in /wishilst",
            data: null
        })
    }
})

router.put('/wishlist', userMiddleware, async (req, res) => {

    const username = req.headers.username;
    const wishlist = req.body.wishlist;
    try {

        await User.findOneAndUpdate({ username }, { wishlist }
        )
        return res.status(201).json({
            msg: "Wishlist updated",
            data: null
        })
    }
    catch (err) {
        return res.status(500).json({
            msg: "Server error in /wishilst",
            data: null
        })
    }


})

router.post('/wishlist', userMiddleware, async (req, res) => {

    const username = req.headers.username;
    const wishlist = req.body.wishlist;
    try {

        if (!wishlist) {
            return res.status(400).json({
                msg: "Please provide details inside the wishlist",
                data: null
            })
        }
        await User.findOneAndUpdate({ username }, { $addToSet: { wishlist } })
        return res.status(201).json({
            msg: "Wishlist updated",
            data: null
        })
    }
    catch (err) {
        return res.status(500).json({
            msg: "Server error in /wishilst",
            data: null
        })
    }


})

router.post('/location', userMiddleware, async (req, res) => {
    //remmove for deployment
    if (accessed) {
        return res.status(403).json({
            msg: "Restart the server to use the api again",
            data: null
        })
    }

    const username = req.headers.username;
    const address = req.body.address;
    try {
        if (!address) {
            return res.status(400).json({
                msg: "Please provide an address",
                data: null
            })
        }
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${map_key}`)

        if (response.data.status !== 'OK') {
            return res.status(400).json({
                msg: "Failed to fetch Geo location",
                data: null
            })
        }

        const location = response.data.results[0].geometry.location;
        const formattedAddress = response.data.results[0].formatted_address;
        await User.findOneAndUpdate({ username }, {
            location: {
                type: 'Point',
                coordinates: [location.lng, location.lat],
                formattedAddress
            }
        })
        accessed = true;    //remove for deployment
        return res.status(200).json({
            msg: "Geo Location added",
            data: null
        })

    }
    catch (err) {
        return res.status(500).json({
            msg: "Server error in /location",
            ddata: err
        })
    }

})

router.get('/location', async (req, res) => {

    const username = req.body.username;
    if (!username) {
        return res.status(400).json({
            msg: "Please give the username to fetch location",
            data: null
        })
    }

    try {
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({
                msg: "User not found",
                data: null
            })
        }

        const lng = user.location.coordinates[0];
        const lat = user.location.coordinates[1];
        const address = user.location.formattedAddress;
        return res.status(200).json({
            msg: "Location details",
            data: {
                lng, lat, address
            }
        })
    }
    catch (err) {
        return res.status(500).json({
            msg: "Server error in /location",
            data: err
        })
    }

})

module.exports = router;