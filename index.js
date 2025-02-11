const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ityl5rk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const spotCollection = client.db("spotDB").collection("spot");

    const countriesCollection = client.db("spotDB").collection("countries");
    
    app.get("/addSpot", async (req, res) => {
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/addSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotCollection.findOne(query);
      res.send(result);
    });
    app.post("/addSpot", async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await spotCollection.insertOne(newSpot);
      res.send(result);
    });
    app.put("/addSpot/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatePost = req.body;
      const post = {
        $set: {
          Tourists_spot_name: updatePost.Tourists_spot_name,
          Photo: updatePost.Photo,
          totaVisitorsPerYear: updatePost.totaVisitorsPerYear,
          Average_cost: updatePost.Average_cost,
          Travel_time: updatePost.Travel_time,
          Seasonality: updatePost.Seasonality,
          location: updatePost.location,
          short_description: updatePost.short_description,
          County_name: updatePost.County_name,
        },
      };
      const result = await spotCollection.updateOne(filter, post, options);
      res.send(result);
    });
    app.delete("/addSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    });


    // Countries related Api

    app.get("/countries", async (req, res) => {
      const cursor = countriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tourists spot server is runnig");
});

app.listen(port, () => {
  console.log(`Tourists spot server on port ${port}`);
});
