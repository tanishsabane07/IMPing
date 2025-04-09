const express = require('express');
const UserModel = require('../models/users');
const auth = require('../middlewares/auth');
const router = express.Router();

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// // Update profile (name & email)
// router.put('/settings', auth, async (req, res) => {
//   try {
//     const { name, email } = req.body;

//     const updatedUser = await UserModel.findOneAndUpdate(
//       { _id: req.user.id, ...(email && { email: { $ne: email } }) }, // Prevents updating if email exists
//       { name, email },
//       { new: true, runValidators: true }
//     ).select('-password');

//     if (!updatedUser) return res.status(400).json({ message: 'Email already in use' });

//     res.json(updatedUser);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

module.exports = router;