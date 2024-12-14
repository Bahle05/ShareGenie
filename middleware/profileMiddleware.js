const isAuthenticated = (req, res, next) => {
    if (!req.cookies.userId) {
      return res.redirect("/auth/login"); // Redirect to login if not authenticated
    }
    next();
  };

  app.use(cookieParser()); // Middleware for parsing cookies
app.use("/profile", profileRoutes); // Register profile routes after middleware

  
  // Use this middleware in your profile routes
  router.get("/", isAuthenticated, getProfile);
  router.post("/update", isAuthenticated, updateProfile);

  module.exports = router;

// In the profileController.js file