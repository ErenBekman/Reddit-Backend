const Joi = require("joi");

const createValidation = Joi.object({
  content: Joi.string(),
  post_id: Joi.number(),
  parent_id: Joi.number(),
});

const updateValidation = Joi.object({
  content: Joi.string().required(),
});

module.exports = {
  createValidation,
  updateValidation,
};
