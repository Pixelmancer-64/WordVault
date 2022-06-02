const express = require("express");
const router = express.Router({ mergeParams: true });
const authentication = require("../middleware");
const Word = require("../models/word");
const Comment = require("../models/comment");
const catchAsyncError = require("../utils/catchAsyncError");

router.delete(
  "/:commentId",
  authentication.login,
  authentication.opComment,
  catchAsyncError(async (req, res) => {
    const { id, commentId } = req.params;
    await Word.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);

    res.redirect(`/word/${id}`);
  })
);

router.post(
  "/",
  authentication.login,
  authentication.validateComment,
  catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const found = await Word.findById(id);
    const comment = new Comment(req.body.comment);
    comment.op = req.user._id;

    found.comments.push(comment);
    await comment.save();
    await found.save();

    res.redirect(`/word/${found.id}`);
  })
);

module.exports = router;
