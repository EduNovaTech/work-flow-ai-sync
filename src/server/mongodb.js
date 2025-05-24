
import { MongoClient } from 'mongodb';

// MongoDB Atlas connection string - using MONGO_URI to match your .env file
const uri = process.env.MONGO_URI || "mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/workwise?retryWrites=true&w=majority";

if (!process.env.MONGO_URI) {
  console.warn("WARNING: MONGO_URI environment variable is not set. Please configure your MongoDB connection string.");
  console.warn("Example: MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/workwise?retryWrites=true&w=majority");
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

export { connectToDatabase, client };
