const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    regId: {type: String, unique: true, required: true},
    name: {type: String},
    dept: {type: String},
    email: {type: String, unique: true},
    password: {type: String, required: true}, 
    role: { type: String, enum: ['student', 'admin'], required: true },
    isInterning: {type: Boolean, default: false},
    internships: [{type: ObjectId, ref: "internships"}],
});

const UserModel = mongoose.model("users", User);

module.exports = UserModel;