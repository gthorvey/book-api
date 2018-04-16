var express = require("express");
var mongoose = require("mongoose");
var db = mongoose.connect("mongodb://localhost/local");
var Book = require('./models/bookModel');

var bodyParser = require("body-parser");

var app = express();
var port = process.env.port || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var bookRouter = require('./routes/bookRoutes')(Book);

app.use("/api/books", bookRouter);

app.listen(port, function(){
    console.log("Gulp is running on port " + port );
});