// controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Login function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
