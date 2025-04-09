const express = require("express");
const InternshipModel = require("../models/internships"); // Adjust based on your model path
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const router = express.Router();

// Search API - Filter internships by title or description

router.get("/", async (req, res) => {
  try
  {
      const internships = await InternshipModel.find();
      res.status(200).json(internships);
  }
  catch(err)
  {
      console.log(err);
      res.status(500).json({message: "Server Error"});
  }
});

router.get("/internship/:id", async (req, res) => {
  try {
      const internship = await InternshipModel.findById(req.params.id);
      if (!internship) {
          return res.status(404).json({ message: "Internship not found" });
      }
      res.json(internship);
  } catch (err) {
      res.status(500).json({ message: "Server error" });
  }
});

router.get("/search", auth, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Use a case-insensitive regex search
    const results = await InternshipModel.find({
      $or: [
        { company: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.json(results);
  } catch (error) {
    console.error("Error searching internships:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;