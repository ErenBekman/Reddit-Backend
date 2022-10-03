const Joi = require("joi");

const createValidation = Joi.object({
  post_id: Joi.number().required(),
  title: Joi.string().required().min(2),
});

const updateValidation = Joi.object({
  post_id: Joi.number().required(),
  title: Joi.string().required().min(2),
});

module.exports = {
  createValidation,
  updateValidation,
};
