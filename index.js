const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const dotenv = require("dotenv");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// manere
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4vnd1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("babyToys");
    const reviewCollection = database.collection("Review");
    const usersCollection = database.collection("users");
    const productsCollection = database.collection("products");
    const salesRequiestCollection = database.collection("salesRequiest");

    app.post("/review", async (req, res) => {
      const review = req.body;
      console.log("hitting tha post", review);
      const result = await reviewCollection.insertOne(review);
      console.log(result);
      res.json(result);
    });
    app.post("/users", async (req, res) => {
      const review = req.body;
      const result = await usersCollection.insertOne(review);
      res.json(result);
    });
    app.post("/salesrequiest", async (req, res) => {
      const review = req.body;
      const result = await salesRequiestCollection.insertOne(review);
      res.json(result);
    });
    app.post("/addproduct", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.json(result);
    });
    app.get("/addproduct", async (req, res) => {
      const cursor = productsCollection.find({});
      const product = await cursor.toArray();
      res.send(product);
    });
    app.get("/salesrequiest", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = salesRequiestCollection.find(query);
      const product = await cursor.toArray();
      res.send(product);
    });
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    app.put("/users/makeadmin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);

      res.json(result);
    });
    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("staart the root folder");
});
app.listen(port, () => {
  console.log("server is runnig ", port);
});
