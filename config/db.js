const mongoose = require('mongoose');
require('dotenv').config();

const connectionURL = process.env.MONGO_URL;

const db = () => {
    mongoose
        .connect(connectionURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports = db;
