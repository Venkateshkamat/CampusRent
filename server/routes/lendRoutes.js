const express = require('express');
const { User }  = require('../models/User');
const Item = require('../models/Item');
const userMiddleware = require("../middleware/userMiddleware");
const router = express.Router();

// Create a new item to LEND (route: /api/items)
router.post('/',userMiddleware, async (req, res) => {
    const { username } = req.headers;
    const { name, description, price, stock, category, rent_start, rent_end } = req.body;
    if (!name || !description || !price || !stock || !category || !rent_start || !rent_end) return res.status(400).json({ message: "All fields are required" });
    if (rent_start > rent_end) return res.status(400).json({ message: "rent_start must be less than rent_end" });
    if (stock <= 0) return res.status(400).json({ message: "stock must be greater than 0" });
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });
        const item = new Item({ name, description, price, stock, category, owner: user._id, rent_start, rent_end });
        await item.save();
        res.status(200).json({ message: `Item created successfully ${item._id}`, data: item });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// Get all items by owner id (route: /api/items/owned)
// ALL ITEMS OWNED BY ME
router.get('/owned',userMiddleware, async (req, res) => {
    const { username } = req.headers;
    try {
        const user = await User.findOne({ username});
        if (!user) return res.status(404).json({ message: "User not found" });
        const items = await Item.find({ owner: user._id });
        res.status(200).json({ message: `All items owned by ${username}`, data: items });
    } catch (err) {
        res.status(500).json({ message: `error fetching all the item owned by ${username}`, err });
    }
});

// Get past lended items by owner id  (route: /api/items/lend/past)
// YOU LENDED THESE ITEMS
router.get('/lend/past',userMiddleware, async (req, res) => {
    const { username } = req.headers;
    try {
        const user = await User.findOne({ username});
        if (!user) return res.status(404).json({ message: "User not found" });
        const items = await Item.find({ status : 'rented', owner: user._id, rent_end: { $lt: new Date() } });
        res.status(200).json({ message: `All items lended by ${username} in past`, data: items });
    } catch (err) {
        res.status(500).json({ message: `error fetching all the item lended by ${username}`, err });
    }
});

// Get Current lended items by owner id  (route: /api/items/lend/current)
// YOU ARE LENDING THESE ITEMS
router.get('/lend/current',userMiddleware, async (req, res) => {
    const { username } = req.headers;
    try {
        const user = await User.findOne({ username});
        if (!user) return res.status(404).json({ message: "User not found" });
        const items = await Item.find({ status : 'rented', owner: user._id, rent_end: { $gte: new Date() }, rent_start: { $lte: new Date() } });
        res.status(200).json({ message: `All items lended by ${username} currently`, data: items });
    } catch (err) {
        res.status(500).json({ message: `error fetching all the item lended by ${username}`, err });
    }
});

// Get all the future lended items by owner id (route: /api/items/lend/future)
// YOU WILL LEND THESE ITEMS
router.get('/lend/future',userMiddleware, async (req, res) => {
    const { username } = req.headers;
    try {
        const user = await User.findOne({ username});
        if (!user) return res.status(404).json({ message: "User not found" });
        const items = await Item.find({ status : 'rented', owner: user._id, rent_start: { $gt: new Date() } });
        res.status(200).json({ message: `All items lended by ${username} in future`, data: items });
    } catch (err) {
        res.status(500).json({ message: `error fetching all the item lended by ${username}`, err });
    }
});

module.exports = router;