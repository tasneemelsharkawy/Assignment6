require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.DB_NAME || "assignment7_db";

const client = new MongoClient(uri);

let db = null;

async function connectDB() {
  if (db) return db;
  await client.connect();
  db = client.db(dbName);
  console.log(`Connected to MongoDB database: ${dbName}`);
  return db;
}

function getDB() {
  if (!db) {
    throw new Error("Database not connected yet. Call connectDB() first.");
  }
  return db;
}

module.exports = { connectDB, getDB, client };
