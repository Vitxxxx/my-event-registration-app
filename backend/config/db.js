require("dotenv").config();
const { MongoClient } = require("mongodb");
const URI = process.env.DB_CONNECTION_STRING;
const client = new MongoClient(URI);

let dbConnection;

async function connectToDB() {
  if (dbConnection) {
    return dbConnection;
  }

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    dbConnection = client.db();
    return dbConnection;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

connectToDB();

module.exports = client;