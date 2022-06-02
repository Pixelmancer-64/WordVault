const mongoose = require("mongoose");
const Comment = require("./comment");

const wordSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  language: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
  category: {
    type: [String],
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  op: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

wordSchema.post("findOneAndDelete", async function (e) {
  if (e) {
    await Comment.deleteMany({ id: { $in: e.comments } });
  }
});

const word = mongoose.model("Word", wordSchema);

module.exports = word;
