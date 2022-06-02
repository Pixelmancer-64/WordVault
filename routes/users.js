const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");

const User = require("../models/user");
const Word = require("../models/word");

const catchAsyncError = require("../utils/catchAsyncError");
const ExpressError = require("../utils/ExpressError");

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  catchAsyncError(async (req, res) => {
    try {
      let { email, username, password } = req.body.user;
      username = username.trim();
      email = email.trim();
      const response = await User.register(
        new User({ email: email, username: username }),
        password
      );
      req.login(response, (err) => {
        if (err) return next(err);
        req.flash("sucess", `Welcome to WordVault ${username}!`);
        res.redirect("/");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  catchAsyncError(async (req, res) => {
    req.flash("sucess", `Welcome, ${req.user.username}!`);
    const aux = req.session.previousURL;
    delete req.session.previousURL;
    res.redirect(aux || "/");
  })
);

router.post("/logout", async (req, res) => {
  req.flash("sucess", `See you next time!`);
  req.logout();
  res.redirect("/");
});

router.get(
  "/user/:username",
  catchAsyncError(async (req, res) => {
    const { username } = req.params;
    const found = await User.find({ username: username });
    const all = await Word.find({ op: found });
    res.render("user", { all });
  })
);

module.exports = router;
