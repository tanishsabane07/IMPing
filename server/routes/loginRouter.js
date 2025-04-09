const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/users");
const router = express.Router();

router.post("/signup", async (req, res) => {
    console.log("Received Signup Request:", req.body);
    const { regId, password, password2 } = req.body;
    let role = "student";
    let dept = "";

    if(!regId || !password || !password2)
    {
        return res.status(400).json({message: "Please enter all fields"});
    }
    if(password !== password2)
    {
        return res.status(400).json({message: "Passwords do not match"});
    }

    if(regId.startsWith("A"))
    {
        role = "admin";
        dept = "TnP";
    }
    else if(regId.startsWith("C"))
    {
        dept = "CE";
    }
    else if(regId.startsWith("I"))
    {
        dept = "IT";
    }
    else if(regId.startsWith("E"))
    {
        dept = "EnTC";
    }
    else
    {
        return res.status(400).json({ message: "Invalid Registration ID format" });
    }

    
    try
    {
        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.create({
            regId: regId,
            password: hashedPassword,
            role: role,
            dept: dept
        });
        res.status(201).json({ message: "User registered successfully" });
    }
    catch(err)
    {
        res.status(500).json({error: "Server Error"});
        console.log("Error registering user:", err);
    }
});

router.post("/login", async (req, res) => {    //login route
    console.log("Recieved login request!", req.body);
    const regId = req.body.regId;
    const password = req.body.password;
    let role = "student";

    if(!regId || !password)
    {
        return res.status(400).json({message: "Please enter all fields"});
    }

    try
    {
        if(regId.startsWith("A"))
        {
            role = "admin";
        }


        const new_user = await UserModel.findOne({
            regId: regId,
            role: role
        });

        if(!new_user)
        {
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const isMatch = await bcrypt.compare(password, new_user.password);
        if(!isMatch)
        {
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const token = jwt.sign({ id: new_user.id, role: role}, process.env.JWT_SECRET, { expiresIn: 3600 });
        res.json({ token: token });
        
    }
    catch(err)
    {
        res.status(500).json({message: "Server Error", err});
    }
});

module.exports = router;