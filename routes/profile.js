const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profileController");
const router = express.Router();

// Route to render the profile page
router.get("/", getProfile);

// Route to handle profile updates
router.post("/update", updateProfile);

module.exports = router;
