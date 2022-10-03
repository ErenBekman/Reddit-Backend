const Joi = require("joi");

const createValidation = Joi.object({
  post_id: Joi.number().required(),
  comment_text: Joi.string(),
});

const updateValidation = Joi.object({
  comment_text: Joi.string().required(),
});

module.exports = {
  createValidation,
  updateValidation,
};
