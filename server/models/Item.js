const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: {type: String, required: true },
    rent_start: { type: Date, required: true},
    rent_end: { type: Date, required: true},
    rented_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default:"null" },
    status: { type: String, enum: ['available', 'rented'], default: 'available' },
    date_added: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Item', itemSchema);