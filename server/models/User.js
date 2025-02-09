const mongoose = require('mongoose');

const secret = 'your_jwt_secret_key';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    wishlist: [{ type: String, default: "" }],
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        },
        formattedAddress: { type: String }
    },
    date_joined: { type: Date, default: Date.now }
});


const User = mongoose.model('User', userSchema);

module.exports = {
    User,
    secret
}
