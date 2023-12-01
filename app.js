var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// mongoDB
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/testdb");
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

// create category for special diets
db.createCollection("category");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;
