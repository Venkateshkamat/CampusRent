const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
// const lendRoutes = require('./routes/lendRoutes');
// const rentRoutes = require('./routes/rentRoutes');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.json());

mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error: ', err));

app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
// app.use('/api/items', lendRoutes);
// app.use('/api/items', rentRoutes);

app.use((err,req,res,next)=>{
    if(err){
        res.status(500).send("Caught by global catch")
        next()
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});