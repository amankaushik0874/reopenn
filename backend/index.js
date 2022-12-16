// Import the mongoose module
const express = require("express");
const app = express();
const port = 3002;
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

// Set up default mongoose connection
const mongoDB = "mongodb+srv://reopen:reopen@cluster0.rstrxen.mongodb.net/?retryWrites=true&w=majority";
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

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
