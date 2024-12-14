const express = require("express");
const Item = require("../models/Item");
const { authenticateToken } = require("../middleware/auth");
const isAuthenticated = require('../middleware/authMiddleware');

const router = express.Router();

// Add an item
router.post("/add", authenticateToken, async (req, res) => {
  const { name, description, condition } = req.body;

  try {
    const newItem = new Item({ name, description, condition, donor: req.user.id });
    await newItem.save();
    res.status(201).json({ message: "Item added successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().populate("donor", "username email");
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Restrict access to authenticated users only
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
});

// Public routes for items
router.get('/', (req, res) => {
  res.render('items');
});

module.exports = router;
