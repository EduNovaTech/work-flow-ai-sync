
const { MongoClient } = require('mongodb');

// Replace this with your actual MongoDB Atlas connection string
// Format should be: mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
const uri = "mongodb+srv://username:password@cluster0.mongodb.net/?retryWrites=true&w=majority";
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
