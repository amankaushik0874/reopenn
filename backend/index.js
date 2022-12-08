// Import the mongoose module
var express = require("express");
var app = express();
var port = 3002;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const mongoose = require("mongoose");

// Set up default mongoose connection
const mongoDB = "mongodb+srv://reopen:reopen@cluster0.mkfnkc0.mongodb.net/?retryWrites=true&w=majority";
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

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/addname", (req, res) => {
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            res.send("Name saved to database");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});

const Addresses = mongoose.model("User", addressSchema);

Addresses.find({ auctionAddress: "dabba" }, (err, addresses) => {
    console.log(addresses);
    if (err) return handleError(err);
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});
// var express = require("express");
// var app = express();
// var port = 3002;
// var bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// var mongoose = require("mongoose");
// mongoose.Promise = global.Promise;
// mongoose.connect("mongodb+srv://reopen:reopen@cluster0.mkfnkc0.mongodb.net/?retryWrites=true&w=majority");

// var addressSchema = new mongoose.Schema({
//     nftAddress: String,
//     auctionAddress: String
// });
// var User = mongoose.model("User", addressSchema);

// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/index.html");
// });

// app.post("/addname", (req, res) => {
//     var myData = new User(req.body);
//     myData.save()
//         .then(item => {
//             res.send("Name saved to database");
//         })
//         .catch(err => {
//             res.status(400).send("Unable to save to database");
//         });
// });


// app.listen(port, () => {
//     console.log("Server listening on port " + port);
// });