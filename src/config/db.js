import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "where2bite";

if (!uri) {
  throw new Error("Missing MONGODB_URI in .env file");
}

const client = new MongoClient(uri);
let db;

export async function connectToDatabase() {
  if (db) {
    return db;
  }

  await client.connect();
  db = client.db(dbName);
  console.log(`Connected to MongoDB database: ${dbName}`);
  return db;
}

export function getDatabase() {
  if (!db) {
    throw new Error("Database has not been connected yet");
  }

  return db;
}
