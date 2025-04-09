const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Internship = new Schema({
    company: {type: String, required: true},
    description: {type: String},
    stipend: {type: Number},
    deadline: {type: Date},
    image: {type: String},
    location: {type: String},
    eligibility: {type: String},
    duration: {type: String},
});

const InternshipModel = mongoose.model("internships", Internship);
module.exports = InternshipModel;