const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/items");
const multer = require('multer');
const path = require('path');
dotenv.config(); // Load environment variables

const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(express.static("public")); // Serve static files from 'public' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", "./views"); // Specify the views directory

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/auth/login");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.redirect("/auth/login");
    req.user = decoded; // Store user data in request object
    next();
  });
};

// Routes
app.use("/auth", authRoutes); // Authentication routes
app.use("/items", itemRoutes); // Items routes

// Home route to render the home page
app.get("/", (req, res) => {
  res.render("home"); // This renders the 'home.ejs' file
});

// Route to render the login page
app.get("/auth/login", (req, res) => {
  res.render("login"); // Renders the login.ejs page
});

// Route to render the sign-up page
app.get("/auth/register", (req, res) => {
  res.render("signUp"); // Renders the signUp.ejs page
});

// Protected route for the dashboard
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.user }); // Pass user data to dashboard
});

// Logout route
app.get("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the authentication token
  res.redirect("/auth/login"); // Redirect the user to the login page
});

// Route: POST /donate (example donation route)
app.post("/donate", (req, res) => {
  const { item, location, contact } = req.body;
  console.log(`Donation Received: ${item}, ${location}, ${contact}`);
  res.send("Thank you for your donation!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Mock user data
const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  location: "New York",
  ethnicity: "Caucasian",
  bio: "Lover of technology and music.",
  profilePic: null,
};

// Route: GET /profile
app.get('/profile', (req, res) => {
  res.render('profile', { user });
});

// Route: POST /profile (to update profile picture)
app.post('/profile', upload.single('profilePic'), (req, res) => {
  if (req.file) {
    user.profilePic = `/uploads/${req.file.filename}`;
  }
  res.redirect('/profile');
});

// Route: GET /profile/edit
app.get('/profile/edit', (req, res) => {
  res.render('editProfile', { user });
});

// Route: POST /profile/edit
app.post('/profile/edit', (req, res) => {
  const { name, location, ethnicity, bio } = req.body;

  // Update the user object with new data
  user.name = name || user.name;
  user.location = location || user.location;
  user.ethnicity = ethnicity || user.ethnicity;
  user.bio = bio || user.bio;

  res.redirect('/profile'); // Redirect back to the profile page
});

// Route: GET /about
app.get('/about-us', (req, res) => {
  const teamMembers = [
    { name: "Bahle Ludidi", role: "Full-stack developer", bio: "Visionary leader and tech enthusiast.", },
    { name: "Abangcwele Njibane", role: "Designer", bio: "Creative mind behind our user interfaces.", },
  ];

  const contactDetails = {
    address: "123 Tech Street, Silicon Valley, CA",
    phone: "+1 234 567 8900",
    email: "info@sharegenie.com",
  };

  res.render("about", { teamMembers, contactDetails });
});

// Start server
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
