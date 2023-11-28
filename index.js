import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { time } from "console";
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';


const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();
var isAsleep = false;
const day = 'Tuesday';

const uri = process.env.MONGODB_URI;
// console.log('uri is ' + uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// console.log('client is' + client);

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    console.log('attempting connection to DB');
    await client.connect();
    console.log('ping');
    const database = client.db('napTrackDB');
    const naps = database.collection('naps');
    // console.log(naps);
    // const query = { napElapsedTime: '30min' };
    // const nap = await naps.findOne(query);
    // console.log(nap);
    // Send a ping to confirm a successful connection
    await client.db("napTrackDB").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    // console.log(naps);
  } catch (err) {
    console.error(err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


// Routes 

// app.get("/", (req, res) => {
//   console.log("sending file!");
//   res.sendFile(__dirname + "/public/index.html");
// });

app.set("view engine", "ejs"); //Uses EJS as view engine, if you are using EJS. If you don't use EJS, you should remove this.
app.use(express.urlencoded({ extended: true })); //Add middleware to app's request handling pipeline & parse URL-encoded data like data structures/arrays into requesst body. This allows data sent from HTML forms in Express.js to be accessed as JavaScript objects for further processing. 
app.use(express.static("views")); //This serves static files like HTML, CSS, JS from a directory named "public" to the client-side of a web app, so static files can be accessed by users' web browsers 

app.use(async (req, res, next) => {
  req.db = await client.connect();
  console.log('ok we got here');
  // console.log(req.db);
  next();
});


app.post("/update", (req, res) => {
  // change state
  isAsleep = !isAsleep;
  // alert("submitted!");
  console.log("asleep is" + isAsleep);
  console.log(new Date().getHours());
  console.log(new Date().getMinutes());
})

app.post("/retrieve", (req, res) => {
  // change state
  // isAsleep = !isAsleep;
  // console.log("asleep is" + isAsleep);
})

app.get("/view", async (req, res) => {
  console.log("view was called!");
  try {
    // req.db = await client.connect();
    const collection = client.db('napTrackDB').collection("naps"); //Replace "your_collection_name" with the actual name of the MongoDB collection from which you want to retrieve documents.
    console.log(req);
    const queryName = req.query.childName;
    console.log('queryName is ' + queryName);
    const query = { childName: queryName };
    const options = {
      sort: { napNumber: 1 }
    }
    const documents = await collection.find(query, options).toArray();
    console.log(documents);
    res.render("index.ejs", { queryName, day, documents });
    // res.render("JSON", { documents }); //Replace "your_template_name" with the name of the template you want to render (if you are using a template engine). Alternatively, you can send the data as JSON if your application doesn't use template rendering.
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching data.");
  }
})


// 7. This is where you shine! Perform your database operations here, e.g. the app.get function. This is what you should do to display a list of documents (aka data) from a MongoDB collection: 
app.get("/", async (req, res) => {
  try {
    // req.db = await client.connect();
    const collection = client.db('napTrackDB').collection("naps"); //Replace "your_collection_name" with the actual name of the MongoDB collection from which you want to retrieve documents.
    const documents = await collection.find({}).toArray();
    console.log(documents);
    res.render("index.ejs", { day, documents });
    // res.render("JSON", { documents }); //Replace "your_template_name" with the name of the template you want to render (if you are using a template engine). Alternatively, you can send the data as JSON if your application doesn't use template rendering.
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching data.");
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
})



// TODO: create front end
// create back-end logic 
// create db layer, that contains state (also need to decide what i want to store and what i want to compute dynamically)


