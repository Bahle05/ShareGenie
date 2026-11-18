const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register function
exports.register = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({ name, username, email, password });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set token in cookie
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    // Redirect to dashboard
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login function
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set token in cookie
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    // Redirect to dashboard
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

// Logout function
exports.logoutUser = (req, res) => {
  try {
    // Clear the authentication cookie
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.redirect("/auth/login");
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};
