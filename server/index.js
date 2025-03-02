require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

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

    // Fetch All Links
    app.get("/links", async (req, res) => {
      const links = await linksCollection.find().toArray();
      res.send(links);
    });

    // get specifiq link
    app.get("/link-details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const link = await linksCollection.findOne(query);
      res.send(link);
    });

    // verify password for private links
    app.post("/verify-password", async (req, res) => {
      const { linkId, password } = req.body;

      const link = await linksCollection.findOne({
        _id: new ObjectId(linkId),
      });

      if (link.password === password) {
        res.send({ success: true });
      } else {
        res.send({ success: false });
      }
    });

    // Increase link visit count
    app.patch("/update-count/:id", async (req, res) => {
      const id = req.params.id;
      const options = { upsert: true };
      try {
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $inc: { VisitedCount: 1 },
        };

        const result = await linksCollection.updateOne(
          query,
          updateDoc,
          options
        );
        res.send(result);
      } catch (error) {
        console.error("Error updating visit count:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // get specifiq user links by email
    app.get("/my-shared-links/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const links = await linksCollection.find(query).toArray();
      res.send(links);
    });

    // Update Shared Link
    app.put("/my-shared-links/:id", async (req, res) => {
      const id = req.params.id;
      const updatedLink = req.body;

      // Prepare the update object
      const updateData = {
        $set: {
          content: updatedLink.content,
          isPrivate: updatedLink.isPrivate,
          expirationDate: updatedLink.expirationDate,
        },
      };

      // Update the link in the MongoDB collection
      const result = await linksCollection.updateOne(
        { _id: new ObjectId(id) },
        updateData
      );
      res.send(result);
    });

    // Delete Shared Link
    app.delete("/my-shared-links/:id", async (req, res) => {
      const { id } = req.params;

      const result = await linksCollection.deleteOne({
        _id: new ObjectId(id),
      });
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
  res.send("ShareLink is running!");
});

app.listen(port, () => {
  console.log(`Server listening on PORT: ${port}`);
});
