require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
var cors = require("cors");
const flash = require("connect-flash");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
// var likeRouter = require("./routes/like");
// var commentRouter = require("./routes/comment");

var app = express();
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true }));

app.use(flash());

// set the view engine to ejs
app.set("view engine", "ejs");
// Set views directory
app.set("views", path.join(__dirname, "views"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/apinya", usersRouter);
app.use("/auth", authRouter);
// app.use("/like", likeRouter);
// app.use("/comment", commentRouter);

module.exports = app;
