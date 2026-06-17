export function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  next();
}
