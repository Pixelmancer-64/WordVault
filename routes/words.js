const express = require("express");
const router = express.Router();
const Word = require("../models/word");
const authentication = require("../middleware");
const catchAsyncError = require("../utils/catchAsyncError");

function validID(found) {
  if (!found) {
    req.flash("error", "We could not find that post");
    return res.redirect("/words");
  }
}

router.get("/new", authentication.login, (req, res) => {
  const lang = req.acceptsLanguages();
  res.render("insert", { lang });
});

router.get(
  "/",
  catchAsyncError(async (req, res) => {
    const all = await Word.find({});
    res.render("words", { all });
  })
);

router.get(
  "/:id",
  catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const found = await Word.findById(id)
      .populate({ path: "comments", populate: { path: "op" } })
      .populate("op");
    validID(found);
    res.render("specificWord", { found });
  })
);

router.get(
  "/:id/edit",
  authentication.login,
  authentication.op,
  catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const found = await Word.findById(id);
    res.render("edit", { found });
  })
);

router.post(
  "/",
  authentication.login,
  authentication.validateWord,
  catchAsyncError(async (req, res) => {
    const hey = new Word(req.body.word);
    hey.op = req.user._id;
    await hey.save();
    req.flash("sucess", "It is a sucess!");
    res.redirect(`/word/${hey.id}`);
  })
);

router.delete(
  "/:id",
  authentication.login,
  authentication.op,
  catchAsyncError(async (req, res) => {
    const { id } = req.params;
    await Word.findByIdAndDelete(id);
    res.redirect("/word");
  })
);

router.put(
  "/:id",
  authentication.login,
  authentication.op,
  authentication.validateWord,
  catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const found = await Word.findById(id);
    validID(found);
    await Word.findByIdAndUpdate(id, req.body.word, { runValidators: true });
    req.flash("sucess", "Successfully uptated post!");
    res.redirect(`/word/${id}`);
  })
);

module.exports = router;
