const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanatize = require("express-mongo-sanitize");
const helmet = require("helmet");

const User = require("./models/user");
const ExpressError = require("./utils/ExpressError");

const wordRoute = require("./routes/words");
const commentRoute = require("./routes/comments");
const userRoute = require("./routes/users");

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(mongoSanatize());
app.use(helmet());
app.use(helmet({ contentSecurityPolicy: true }));

require('dotenv').config({ path: path.resolve(__dirname, './.env.local') })

const dbURL = process.env.DATABASE_URL;
const store = mongoStore.create({
  mongoUrl: dbURL,
  secret: process.env.SESSION_SECRET,
  touchAfter: 24 * 60 * 60,
});
store.on("error", (e) => {
  console.log("session store error", e);
});

app.use(
  session({
    secret: process.env.OTHER_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      store: store,
      name: process.env.OTHER_NAME,
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 24 * 7,
    },
  })
);

// quando for localhost comentar o httponly e o secure
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.sucess = req.flash("sucess");
  res.locals.error = req.flash("error");
  next();
});

app.engine("ejs", ejsMate);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/word", wordRoute);
app.use("/word/:id/comment", commentRoute);
app.use(userRoute);

mongoose
  .connect(dbURL, { useNewUrlParser: true })
  .then(() => {
    console.log("OPEN MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 6464;
app.listen(port, () => {
  console.log("Rodando");
});

app.get("/", (req, res) => {
  res.render("index");
});

app.all("*", (req, res, next) => {
  throw new ExpressError("Page not found :/", 404);
});

app.use((err, req, res, next) => {
  if (!err.message) err.message = "Something went wrong, sorry :/";
  if (!err.statusCode) err.statusCode = 500;

  res.render("error", { err });
});
