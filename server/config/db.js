const mongoose = require("mongoose");
require("dotenv").config();

const db = process.env.MONGO_URI;

const connectDB = async () => {
    mongoose.connect(db)
    .then(() => {console.log("MongoDB Connected!")})
    .catch(err => {console.log("MongoDB Error: ", err)});
};

module.exports = connectDB;