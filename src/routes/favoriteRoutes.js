import express from "express";
import { getDatabase } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import { toObjectId } from "../utils/objectId.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const db = getDatabase();

  const favorites = await db.collection("favorites")
    .find({ userId: req.session.user.id })
    .toArray();

  const restaurantIds = favorites
    .map((favorite) => toObjectId(favorite.restaurantId))
    .filter(Boolean);

  const restaurants = await db.collection("restaurants")
    .find({ _id: { $in: restaurantIds }, ownerId: req.session.user.id })
    .toArray();

  return res.json(restaurants);
});

router.post("/:restaurantId", requireAuth, async (req, res) => {
  const restaurantId = req.params.restaurantId;

  if (!toObjectId(restaurantId)) {
    return res.status(400).json({ message: "Invalid restaurant ID." });
  }

  const db = getDatabase();

  const restaurant = await db.collection("restaurants").findOne({
    _id: toObjectId(restaurantId),
    ownerId: req.session.user.id
  });

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found." });
  }

  const existingFavorite = await db.collection("favorites").findOne({
    userId: req.session.user.id,
    restaurantId
  });

  if (existingFavorite) {
    return res.status(409).json({ message: "Restaurant is already in favorites." });
  }

  await db.collection("favorites").insertOne({
    userId: req.session.user.id,
    restaurantId,
    createdAt: new Date()
  });

  return res.status(201).json({ message: "Restaurant added to favorites." });
});

router.delete("/:restaurantId", requireAuth, async (req, res) => {
  const restaurantId = req.params.restaurantId;

  const db = getDatabase();

  const result = await db.collection("favorites").deleteOne({
    userId: req.session.user.id,
    restaurantId
  });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: "Favorite not found." });
  }

  return res.json({ message: "Restaurant removed from favorites." });
});

export default router;
