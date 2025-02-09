const express = require('express');
const { User}  = require('../models/User');
const Item = require('../models/Item');
const userMiddleware = require("../middleware/userMiddleware");
const router = express.Router();

// Rent an item by id (route: /api/items/rent/:id)
// USER CAN RENT BY ID
router.put('/rent/:id', userMiddleware, async (req, res) => {
    const { username } = req.headers;

    try {
        const user = await User.findOne({ username }); // Add await
        if (!user) return res.status(404).json({ message: "User not found" });

        const item = await Item.findByIdAndUpdate(req.params.id,{ rented_by: user._id, status: 'available' }, { new: true } );
        if (!item) return res.status(404).json({ message: "Item not found" });

        res.status(200).json({ message: `Item rented successfully ${item._id}`, data: item });
    } catch (err) {
        res.status(500).json({ message: `Error renting the item`, err });
    }
});

// Get all the rented items rented by user id (route: /api/items/rented)
// YOU RENTED THESE ITEMS
router.get('/rented',userMiddleware, async (req, res) => {
    const { username } = req.headers;
    try {
        const user = await User.findOne({ username});
        if (!user) return res.status(404).json({ message: "User not found" });
        const items = await Item.find({ status : 'rented', rented_by: user._id, rent_end: { $gte: new Date() }, rent_start: { $lte: new Date}});
        res.status(200).json({ message: `All items rented by ${username}`, data: items });
    } catch (err) {
        res.status(500).json({ message: `error fetching items rented by ${username}`, err });
    }
});

// finish a renting by id (route: /api/items/finish/:id)
router.put('/finish/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, { rent_start: undefined, rent_end: undefined, rented_by: undefined, status: 'available'}, { new: true });
        res.status(200).json({ message: `Item returned successfully ${item._id}`, data: item });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// Get all past rented items by user id  (route: /api/items/rent/past)
// YOU RENTED THESE ITEMS
router.get('/rent/past',userMiddleware, async (req, res) => {
    const { username } = req.headers;
    try {
        const user = await User.findOne({ username});
        if (!user) return res.status(404).json({ message: "User not found" });
        const items = await Item.find({ status : 'rented', rented_by: user._id, rent_end: { $lt: new Date() } });
        res.status(200).json({ message: `All items rented by ${username} in past`, data: items });
    } catch (err) {
        res.status(500).json({ message: `error fetching all the item rented by ${username}`, err });
    }
});

// Get Current rented items by user id  (route: /api/items/rent/current)
// YOU ARE RENTING THESE ITEMS
router.get('/rent/current',userMiddleware, async (req, res) => {
    const { username } = req.headers;
    try {
        const user = await User.findOne({ username});
        if (!user) return res.status(404).json({ message: "User not found" });
        const items = await Item.find({ status : 'rented', rented_by: user._id, rent_end: { $gte: new Date() }, rent_start: { $lte: new Date() } });
        res.status(200).json({ message: `All items rented by ${username} currently`, data: items });
    } catch (err) {
        res.status(500).json({ message: `error fetching all the item rented by ${username}`, err });
    }
});

router.get('/rent/future',userMiddleware, async (req, res) => {
    const { username } = req.headers;
    try {
        const user = await User.findOne({ username});
        if (!user) return res.status(404).json({ message: "User not found" });
        const items = await Item.find({ status : 'rented', rented_by: user._id, rent_start: { $gt: new Date() } });
        res.status(200).json({ message: `All items rented by ${username} in future`, data: items });
    } catch (err) {
        res.status(500).json({ message: `error fetching all the item rented by ${username}`, err });
    }
});

module.exports = router;