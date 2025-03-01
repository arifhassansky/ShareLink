require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MongoDB Setup
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.koweo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const usersCollection = client.db("ShareLink").collection("users");
    // const filesCollection = client.db("ShareLink").collection("files");
    const linksCollection = client.db("ShareLink").collection("links");

    // Store User Data
    app.post("/users", async (req, res) => {
      const userEmail = req.body.email;
      const user = await usersCollection.findOne({ email: userEmail });
      if (user) {
        res.send("User already exists");
        return;
      }
      const userData = req.body;
      const result = await usersCollection.insertOne(userData);
      res.send(result);
    });

    // Create Shareable Link (New Route)
    app.post("/create-link", async (req, res) => {
      const linkData = req.body;
      const insertResult = await linksCollection.insertOne(linkData);
      const id = insertResult.insertedId;

      const result = await linksCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Mongodb use case
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

run().catch(console.dir);

// Default Route
app.get("/", (req, res) => {
  res.send("ShareLink is running with Cloudinary integration!");
});

app.listen(port, () => {
  console.log(`Server listening on PORT: ${port}`);
});
