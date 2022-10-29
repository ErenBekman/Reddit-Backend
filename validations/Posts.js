const Joi = require("joi");

const createValidation = Joi.object({
  sub_id: Joi.number(),
  title: Joi.string().required().min(2),
  content: Joi.string().required().min(2),
  type: Joi.string().min(2),
  image: Joi.string().min(2),
  vote_count: Joi.number(),
});

const updateValidation = Joi.object({
  title: Joi.string().min(2),
  content: Joi.string().min(2),
  type: Joi.string().min(2),
  image: Joi.string().min(2),
  vote_count: Joi.number(),
});

module.exports = {
  createValidation,
  updateValidation,
};
