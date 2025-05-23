
const { MongoClient } = require('mongodb');

// MongoDB Atlas connection string - replace with your own connection string
const uri = process.env.MONGODB_URI || "mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("workwise");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

module.exports = { connectToDatabase, client };
