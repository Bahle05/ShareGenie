const jwt = require('jsonwebtoken');

function isAuthenticated(req, res, next) {
  const token = req.cookies.token; // Assuming token is stored in cookies
  if (!token) {
    return res.redirect('/auth/login'); // Redirect to login if not authenticated
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user details to request object
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }
}

module.exports = isAuthenticated;
