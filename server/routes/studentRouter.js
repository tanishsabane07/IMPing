const express = require("express");
const UserModel = require("../models/users");
const auth = require("../middlewares/auth");
const ApplicationModel = require("../models/applications");
const router = express.Router();

// This route is now handled by applicationRouter.js, so we can remove it
// router.post("/apply/:id_int", auth, (req, res) => {
//     // This route was incomplete and causing path-to-regexp errors
// });

router.patch("/profile", auth, async (req, res) => {   //profile route
    try
    {
        console.log(req.user.id);
        const user = await UserModel.findById(req.user.id);
        if(!user)
        {
            return res.status(404).json({message: "User not found"});
        }
        res.json(user);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message: "Server Error"});
    }
});

router.get("/my-applications", auth, async (req, res) => {
    try {
        const applications = await ApplicationModel.find({ studentId: req.user }).populate("internshipId");
        res.status(200).json(applications);
        console.log(applications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;