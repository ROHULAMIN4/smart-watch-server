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
console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("babyToys");
    const reviewCollection = database.collection("Review");

    app.post("/review", async (req, res) => {
      const review = req.body;
      console.log("hitting tha post", review);
      const result = await reviewCollection.insertOne(review);
      console.log(result);
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
