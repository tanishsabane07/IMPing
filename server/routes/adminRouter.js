const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const InternshipModel = require("../models/internships");

router.post("/add-internship", auth, upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const internshipData = {
      company: req.body.company,
      description: req.body.description,
      location: req.body.location,
      eligibility: req.body.eligibility,
      duration: req.body.duration,
      stipend: req.body.stipend,
      deadline: req.body.deadline,
      image: imagePath, // Save image path
    };

    await InternshipModel.create(internshipData);
    res.status(201).json({ message: "Internship added successfully!" });
  } catch (error) {
    console.error("Error adding internship:", error);
    res.status(500).json({ message: "Error adding internship", error });
  }
});


router.put("/update-internship/:id", auth, upload.single("image"), async (req, res) => {
  const { id } = req.params;
  try {
    let updatedData = req.body;
    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`; // Update image if new one is uploaded
    }

    const internship = await InternshipModel.findByIdAndUpdate(id, updatedData, { new: true });
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.status(200).json({ message: "Internship updated successfully!", internship });
  } catch (error) {
    console.error("Error updating internship:", error);
    res.status(500).json({ message: "Error updating internship", error });
  }
});


router.delete("/delete-internship/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
      await InternshipModel.findByIdAndDelete(id);
      res.status(200).json({ message: "Internship deleted successfully!" });
    } catch (error) {
      console.error("Error deleting internship:", error);
      res.status(500).json({ message: "Error deleting internship", error });
    }
});


module.exports = router;