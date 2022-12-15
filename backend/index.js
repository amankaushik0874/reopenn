// Import the mongoose module
var express = require("express");
var app = express();
var port = 3002;
const cors = require("cors");
var bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

// Set up default mongoose connection
const mongoDB = "mongodb+srv://reopen:reopen@cluster0.lmekkia.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define a schema
const Schema = mongoose.Schema;

var addressSchema = new mongoose.Schema({
    projectOwner: String,
    nftAddress: String,
    auctionAddress: String
});

var User = mongoose.model("User", addressSchema);

app.post("/", (req, res) => {
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            res.send(item);
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});

const Addresses = mongoose.model("User", addressSchema);

app.get("/", (req, res) => {
    // Get the searchTerm parameter from the query string
    const searchTerm = req.query.searchTerm;

    Addresses.findOne({ projectOwner: searchTerm }, (err, addresses) => {
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