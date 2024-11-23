var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var connection = require("./config/db");
var hbs = require("hbs");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var gamesRouter = require("./routes/games");

var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "views", "layouts"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "458484",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(function (req, res, next) {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/games", gamesRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
