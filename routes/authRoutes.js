const express = require("express");
const router = express.Router();
const { register, loginUser, logoutUser } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Register function
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // const hashedPassword = await bcrypt.hash(password, 10); // Uncomment if using bcrypt for password hashing

    const newUser = new User({
      username,
      email,
      password, //: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login function
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // const isPasswordMatch = await bcrypt.compare(password, user.password); // Uncomment if using bcrypt

    if (user.password !== password) { // For now, checking plain text password
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
router.post("/register", register);

// Login route
router.post("/login", loginUser);

// Logout route
router.post("/logout", logoutUser);
module.exports = router;

