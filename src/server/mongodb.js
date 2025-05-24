
import { MongoClient } from 'mongodb';

// MongoDB Atlas connection string
const uri = process.env.MONGO_URI || "mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/workwise?retryWrites=true&w=majority";

if (!process.env.MONGO_URI) {
  console.warn("WARNING: MONGO_URI environment variable is not set. Please check your .env file.");
  console.warn("Expected format: MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/workwise?retryWrites=true&w=majority");
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
});

async function connectToDatabase() {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("Using connection string:", uri.replace(/:[^:@]+@/, ':****@')); // Hide password in logs
    
    await client.connect();
    
    // Test the connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB");
    
    return client.db("workwise");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    console.error("Please check:");
    console.error("1. Your internet connection");
    console.error("2. MongoDB Atlas cluster is running");
    console.error("3. IP address is whitelisted in MongoDB Atlas");
    console.error("4. Username and password are correct");
    throw error;
  }
}

export { connectToDatabase, client };
