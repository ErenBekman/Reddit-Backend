const Joi = require("joi");

const createValidation = Joi.object({
  name: Joi.string().required().min(2),
  description: Joi.string().required().min(2),
  picture: Joi.string(),
});

const updateValidation = Joi.object({
  name: Joi.string().min(2),
  description: Joi.string().min(2),
  picture: Joi.string(),
});

module.exports = {
  createValidation,
  updateValidation,
};
