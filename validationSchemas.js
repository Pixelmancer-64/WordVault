const joi = require("joi");

module.exports.wordSchema = joi.object({
  word: joi
    .object({
      title: joi.string().min(1).max(64).required(),
      language: joi.string().required(),
      text: joi.string().min(1).max(255).required(),
      category: joi.string().min(1).max(64).required(),
    })
    .required(),
});

module.exports.commentSchema = joi.object({
  comment: joi
    .object({
      text: joi.string().min(1).max(255).required(),
    })
    .required(),
});
