const Joi = require("joi");

const createValidation = Joi.object({
  title: Joi.string().required().min(2),
  textContent: Joi.string().required().min(2),
  post_image: Joi.string().min(2),
});

const updateValidation = Joi.object({
  title: Joi.string().min(2),
  textContent: Joi.string().min(2),
  post_image: Joi.string().min(2),
});

module.exports = {
  createValidation,
  updateValidation,
};
