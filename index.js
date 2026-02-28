const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = 3000;

require("dotenv").config();

// middleware

app.use(express.json());
app.use(cors());
// user
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);
// mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.toblij9.mongodb.net/?appName=Cluster0`;

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
    await client.connect();

    const moviesCollection = client.db("cinenest").collection("movies");
    const favouriteCollection = client.db("cinenest").collection("favourite");
    // create
    app.post("/movies", async (req, res) => {
      const movie = req.body;
      //   console.log(movie);
      const result = await moviesCollection.insertOne(movie);
      res.send(result);
      //   console.log(result);
    });
    // read/get

    app.get("/movies", async (req, res) => {
      const result = await moviesCollection.find().toArray();
      res.send(result);
      //   console.log(result);
    });

    // delete
    app.delete("/movies/:id", async (req, res) => {
      const id = { _id: new ObjectId(req.params.id) };
      const result = await moviesCollection.deleteOne(id);
      res.send(result);
    });
    // update
    app.patch("/movies/:id", async (req, res) => {
      console.log(req.body);
      const filter = { _id: new ObjectId(req.params.id) };
      //   console.log(req);
      const updateDoc = {
        $set: req.body,
        $unset: { name: "" },
      };
      const result = await moviesCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // get single data
    app.get("/movies/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await moviesCollection.findOne(query);
      console.log(result);
      res.send(result);
    });
    // handle favourite
    app.post("/favourite", async (req, res) => {
      const favourite = req.body;
      // console.log(favourite);
      const result = await favouriteCollection.insertOne(favourite);
      res.send(result);
      // console.log(result);
    });
    // get favourite
    app.get("/favourite", async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const result = await favouriteCollection.find(query).toArray();
      res.send(result);
      console.log(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Cine Nest server is ready");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
