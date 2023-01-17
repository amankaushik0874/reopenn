const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { factory_address, factory_abi } = require("./constants/index");
const Ether = require("ethers");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for the https://reopen-front.netlify.app/ domain
// app.use(cors({ origin: "https://reopen-front.netlify.app" }));
app.use(cors({ origin: "http://localhost:3000" }));

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

// Set up default mongoose connection
const mongoDB =
  "mongodb+srv://reopen:reopen@cluster0.rstrxen.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;
// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
// Define a schema
const Schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
  projectOwner: String,
  nftAddress: String,
  auctionAddress: String,
});

const User = mongoose.model("User", addressSchema);

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

app.post("/addname", (req, res) => {
  const myData = new User(req.body);
  myData
    .save()
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      res.status(400).send("Unable to save to database");
    });
});

app.get("/getdata", (req, res) => {
  // Get the searchTerm parameter from the query string
  const searchTerm = req.query.searchTerm;
  User.findOne({ projectOwner: searchTerm }, (err, addresses) => {
    if (err) {
      res.status(500).send({ error: "Failed to query database" });
    } else {
      res.send(addresses);
    }
  });
});

app.post("/registerfactory", (req, res) => {
  // Connect to the Ethereum network
  const provider = new Ether.providers.JsonRpcProvider(
    "https://rpc-mumbai.maticvigil.com"
  );

  // Create a contract instance
  const factory = new Ether.Contract(factory_address, factory_abi, provider);
  console.log("running...");
  // Listen for the "NFTCreated" event
  factory.once(
    "contractsCreated",
    (NFTContract, auctionContract, campaignID_, event) => {
      console.log(`NFT contract created at address: ${NFTContract}`);
      console.log(`Auction contract created at address: ${auctionContract}`);
      console.log(`Id contract created at address: ${campaignID_}`);
      // Save the NFT address to the database
    }
  );
});

// const port = "https://reopenn.vercel.app" || 3002;
const port = 3002;
app.listen(port, () => {
  console.log("Server listening on port " + port);
});
