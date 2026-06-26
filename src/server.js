import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectToDatabase } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || "dev_secret_change_me",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    dbName: process.env.DB_NAME || "where2bite"
  }),
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use((err, req, res, next) => {
  console.error("Server Error Caught:", err);
  res.status(500).json({ message: "Internal Server Error" });
});
app.get("/", (_req, res) => {
  res.redirect("/pages/login.html");
});

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

await connectToDatabase();

app.listen(port, () => {
  console.log(`Where2Bite server running at http://localhost:${port}`);
});
