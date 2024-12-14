const User = require('../models/User');

// Display user's profile page
const getProfile = (req, res) => {
  const userId = req.session.userId; // Assuming you're using sessions for user authentication
  User.findById(userId)
    .then(user => {
      res.render('profile', { user });
    })
    .catch(err => res.status(500).send('Error fetching user data'));
};

// Update user's profile
const updateProfile = (req, res) => {
  const { name, email, bio, phone, address } = req.body;
  const userId = req.session.userId; // Assuming you're using sessions for user authentication

  User.findByIdAndUpdate(userId, { name, email, bio, phone, address }, { new: true })
    .then(updatedUser => {
      // Handle file upload if present
      if (req.files && req.files.profilePicture) {
        // Handle saving the profile picture
      }

      res.redirect('/profile'); // Redirect to the profile page after updating
    })
    .catch(err => res.status(500).send('Error updating profile'));
};

module.exports = { getProfile, updateProfile };

const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Update route to include file upload
router.post("/update", upload.single("profilePicture"), (req, res) => {
  const userId = req.cookies.userId;
  const { name, email, bio, phone, address } = req.body;
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : undefined;

  const updateData = { name, email, bio, phone, address };
  if (profilePicture) updateData.profilePicture = profilePicture;

  User.findByIdAndUpdate(userId, updateData, { new: true })
    .then(updatedUser => {
      console.log("User profile updated:", updatedUser);
      res.redirect("/profile");
    })
    .catch(err => {
      console.error("Error updating user profile:", err);
      res.status(500).send("Server error");
    });
});
