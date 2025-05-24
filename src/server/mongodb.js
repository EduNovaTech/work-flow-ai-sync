
const { MongoClient } = require('mongodb');

// MongoDB Atlas connection string - replace with your actual connection string
const uri = process.env.MONGODB_URI || "mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/workwise?retryWrites=true&w=majority";

if (!process.env.MONGODB_URI) {
  console.warn("WARNING: MONGODB_URI environment variable is not set. Please configure your MongoDB connection string.");
  console.warn("Example: MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/workwise?retryWrites=true&w=majority");
}

const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    console.log("Attempting to connect to MongoDB...");
    await client.connect();
    console.log("Successfully connected to MongoDB");
    return client.db("workwise");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    console.error("Please check your MongoDB connection string and network connectivity.");
    throw error;
  }
}

module.exports = { connectToDatabase, client };
