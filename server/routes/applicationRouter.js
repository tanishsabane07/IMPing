const mongoose = require("mongoose");
const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const ApplicationModel = require("../models/applications");
const UserModel = require("../models/users");
const { uploadResume } = require("../config/cloudinary");

// GET /applied/:id
router.get("/applied/:id", auth, async (req, res) => {
  try {
    const { id } = req.params; // internship ID
    const studentId = req.user; // set by auth middleware

    const application = await ApplicationModel.findOne({
      studentId: studentId,
      internshipId: id,
    });

    if(!application)
    {
        return res.status(200).json({ applied: false }); 
    }

    return res.status(200).json({
        applied: true,
        status: application.status, // "Pending", "Selected", etc.
    });

  } catch (err) {
    console.error("Error checking application status:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/apply/:id", auth, uploadResume.single("resume"), async (req, res) => {
    try {
      const { id } = req.params;
      const studentId = req.user;
  
      const applicationData = {
        studentId: studentId,
        internshipId: id,
        name: req.body.fullName,
        email: req.body.email,
        mobile: req.body.mobile,
        cgpa: req.body.cgpa,
        resume: req.file?.path || "", // <== this is where resume gets saved
      };
  
      const newApplication = new ApplicationModel(applicationData);
      await newApplication.save();
  
      res.status(201).json({ message: "Application submitted successfully" });
      const student = await UserModel.findById(req.user);
        if (student) {
            student.internships.push(id);
            await student.save();
            console.log(student.internships);
        }
    } catch (err) {
      console.error("Error submitting application:", err);
      res.status(500).json({ message: "Server Error" });
    }
});

router.get("/internship/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Validate the ID format first
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid internship ID format" });
    }

    // 2. Add pagination/sorting if needed (for many applications)
    const applications = await ApplicationModel.find({ internshipId: id })
      .populate({
        path: "studentId",
        select: "name email mobile resume" // Only select necessary fields
      })
      .sort({ createdAt: -1 }); // Newest first

    // 3. Check if applications array is empty (not applications itself)
    if (applications.length === 0) {
      return res.status(404).json({ message: "No applications found for this internship" });
    }

    res.status(200).json(applications);
    
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ message: "Server error while fetching applications" });
  }
});

module.exports = router;
