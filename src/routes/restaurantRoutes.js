import express from "express";
import { getDatabase } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import { toObjectId } from "../utils/objectId.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const db = getDatabase();

  const restaurants = await db.collection("restaurants")
    .find({ ownerId: req.session.user.id })
    .sort({ createdAt: -1 })
    .toArray();

  return res.json(restaurants);
});

router.post("/", requireAuth, async (req, res) => {
  const { name, cuisine, priceRange, location, category, notes } = req.body;

  if (!name || !cuisine) {
    return res.status(400).json({ message: "Restaurant name and cuisine are required." });
  }

  const db = getDatabase();

  const newRestaurant = {
    name,
    cuisine,
    priceRange: priceRange || "$",
    location: location || "",
    category: category || "General",
    notes: notes || "",
    ownerId: req.session.user.id,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db.collection("restaurants").insertOne(newRestaurant);

  return res.status(201).json({
    message: "Restaurant added successfully.",
    restaurant: { _id: result.insertedId, ...newRestaurant }
  });
});

router.put("/:id", requireAuth, async (req, res) => {
  const restaurantId = toObjectId(req.params.id);

  if (!restaurantId) {
    return res.status(400).json({ message: "Invalid restaurant ID." });
  }

  const { name, cuisine, priceRange, location, category, notes } = req.body;

  const db = getDatabase();

  const result = await db.collection("restaurants").updateOne(
    { _id: restaurantId, ownerId: req.session.user.id },
    {
      $set: {
        name,
        cuisine,
        priceRange,
        location,
        category,
        notes,
        updatedAt: new Date()
      }
    }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Restaurant not found." });
  }

  return res.json({ message: "Restaurant updated successfully." });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const restaurantId = toObjectId(req.params.id);

  if (!restaurantId) {
    return res.status(400).json({ message: "Invalid restaurant ID." });
  }

  const db = getDatabase();

  const result = await db.collection("restaurants").deleteOne({
    _id: restaurantId,
    ownerId: req.session.user.id
  });

  await db.collection("favorites").deleteMany({
    restaurantId: req.params.id,
    userId: req.session.user.id
  });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: "Restaurant not found." });
  }

  return res.json({ message: "Restaurant deleted successfully." });
});

router.get("/random/pick", requireAuth, async (req, res) => {
  const db = getDatabase();

  const restaurants = await db.collection("restaurants")
    .find({ ownerId: req.session.user.id })
    .toArray();

  if (restaurants.length === 0) {
    return res.status(404).json({ message: "Add at least one restaurant first." });
  }

  const randomIndex = Math.floor(Math.random() * restaurants.length);

  return res.json(restaurants[randomIndex]);
});

export default router;
