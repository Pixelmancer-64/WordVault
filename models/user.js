const mongoose = require("mongoose");
const passport = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passport);

module.exports = mongoose.model("User", userSchema);
