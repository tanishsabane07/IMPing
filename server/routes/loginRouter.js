const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/users");

const router = express.Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Determines role and department from the registration ID prefix
function resolveRoleAndDept(regId) {
  if (regId.startsWith("A"))   return { role: "admin",   dept: "TnP"  };
  if (regId.startsWith("C2K")) return { role: "student", dept: "CE"   };
  if (regId.startsWith("I2K")) return { role: "student", dept: "IT"   };
  if (regId.startsWith("E2K")) return { role: "student", dept: "EnTC" };
  return null; // Invalid prefix
}

// Signs and returns a JWT token for the given user
function signToken(userId, role) {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: 3600 } // 1 hour
  );
}

// ─── POST /register/signup ───────────────────────────────────────────────────

router.post("/signup", async (req, res) => {

  const { regId, name, email, password, password2 } = req.body;

  // 1. Validate all required fields are present
  if (!regId || !name || !email || !password || !password2) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  // 2. Confirm both passwords match
  if (password !== password2) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // 3. Determine role and department from the registration ID prefix
  const resolved = resolveRoleAndDept(regId);
  if (!resolved) {
    return res.status(400).json({ message: "Invalid Registration ID format" });
  }
  const { role, dept } = resolved;

  try {
    // 4. Check for an existing user with the same regId or email
    const existingUser = await UserModel.findOne({
      $or: [{ regId }, { email }],
    });

    if (existingUser) {
      const field = existingUser.regId === regId ? "Registration ID" : "Email";
      return res.status(400).json({ message: `${field} is already registered` });
    }

    // 5. Hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      regId,
      name,
      email,
      password: hashedPassword,
      role,
      dept,
    });

    // 6. Return a token so the user is logged in immediately after signup
    const token = signToken(newUser.id, role);
    return res.status(201).json({ message: "User registered successfully", token: token });

  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ error: "Server Error" });
  }
});

// ─── POST /register/login ────────────────────────────────────────────────────

router.post("/login", async (req, res) => {
  console.log("Received login request:", req.body);

  const { regId, password } = req.body;

  // 1. Validate required fields
  if (!regId || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  // 2. Determine the role from the registration ID prefix
  const role = regId.startsWith("A") ? "admin" : "student";

  try {
    // 3. Find the user by regId and role
    const user = await UserModel.findOne({ regId, role });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // 4. Verify the password against the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // 5. Return a signed JWT token
    const token = signToken(user.id, role);
    return res.json({ token });

  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;