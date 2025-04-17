const mongoose = require('mongoose');
const internshipModel = require('./internships');

const { ObjectId } = mongoose.Schema.Types;

const Application = new mongoose.Schema({
  internshipId: {
    type: ObjectId,
    ref: "internships",
    required: true,
  },
  studentId: {
    type: ObjectId,
    ref: "users",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Invalid mobile number'],
  },
  cgpa: {
    type: Number,
    required: true,
    min: [0, 'CGPA cannot be less than 0'],
    max: [10, 'CGPA cannot be more than 10'],
  },
  resume: {
    type: String,
    required: true,
  },
//   tenthMarks: {
//     type: String,
//     trim: true,
//   },
//   twelfthMarks: {
//     type: String,
//     trim: true,
//   },
//   skills: {
//     type: [String],
//     default: [],
//   },
//   atsScore: {
//     type: Number,
//     min: 0,
//     max: 100,
//   },
  status: {
    type: String,
    enum: ['Pending', 'Selected', 'Rejected'],
    default: 'Pending',
  },
//   appliedAt: {
//     type: Date,
//     default: Date.now,
//   },
// }, {
//   indexes: [
//     { key: { studentId: 1, internshipId: 1 }, unique: true },
//   ],
});

const ApplicationModel = mongoose.model("applications", Application);
module.exports = ApplicationModel;