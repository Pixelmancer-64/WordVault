const Word = require("./models/word");
const Comment = require("./models/comment");

const ExpressError = require("./utils/ExpressError");
const catchAsyncError = require("./utils/catchAsyncError");
const validation = require("./validationSchemas");

module.exports.login = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.previousURL = req.originalUrl;
    req.flash("error", "You must be signed in!");
    res.redirect("/login");
  } else next();
};

module.exports.op = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const found = await Word.findById(id);
  if (!found.op.equals(req.user._id)) {
    throw new ExpressError(
      "401",
      "Access denied! You do not have permission to do this"
    );
  }
  next();
});

module.exports.opComment = catchAsyncError(async (req, res, next) => {
  const { commentId } = req.params;
  const found = await Comment.findById(commentId);
  console.log(found);
  if (!found.op.equals(req.user._id)) {
    throw new ExpressError(
      "401",
      "Access denied! You do not have permission to do this"
    );
  }
  next();
});

module.exports.validateWord = (req, res, next) => {
  const { error } = validation.wordSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};

module.exports.validateComment = (req, res, next) => {
  const { error } = validation.commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};
