import express from "express";
import bcrypt from "bcrypt";
import { getDatabase } from "../config/db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (password.length < 4) {
    return res.status(400).json({ message: "Password must be at least 4 characters." });
  }

  const db = getDatabase();
  const existingUser = await db.collection("users").findOne({ username });

  if (existingUser) {
    return res.status(409).json({ message: "Username already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await db.collection("users").insertOne({
    username,
    passwordHash,
    createdAt: new Date()
  });

  req.session.user = {
    id: result.insertedId.toString(),
    username
  };

  return res.status(201).json({ message: "Account created successfully.", user: req.session.user });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const db = getDatabase();
  const user = await db.collection("users").findOne({ username });

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  req.session.user = {
    id: user._id.toString(),
    username: user.username
  };

  return res.json({ message: "Logged in successfully.", user: req.session.user });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    return res.json({ message: "Logged out successfully." });
  });
});

router.get("/me", (req, res) => {
  return res.json({ user: req.session.user || null });
});

export default router;
