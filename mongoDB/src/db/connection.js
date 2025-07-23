
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://tanayprabhu2004:tanay101204@temp.rrusolu.mongodb.net/?retryWrites=true&w=majority&appName=temp";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let isConnected = false;

async function connectMongo() {
  if (!isConnected) {
    try {
      await client.connect();
      await client.db("demo").command({ ping: 1 });
      isConnected = true;
      console.log("Connected to MongoDB Atlas (demo database)");
    } catch (err) {
      console.error('MongoDB connection error:', err);
      throw err;
    }
  }
  return client;
}

function getAssignmentCollection() {
  return client.db("demo").collection("assignment");
}

module.exports = { connectMongo, getAssignmentCollection };
