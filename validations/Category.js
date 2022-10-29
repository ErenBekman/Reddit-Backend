const Joi = require("joi");

const createValidation = Joi.object({
  name: Joi.string().required().min(2),
  sub_id: Joi.number().required(),
});

const updateValidation = Joi.object({
  name: Joi.string().required().min(2),
  sub_id: Joi.number(),
});

module.exports = {
  createValidation,
  updateValidation,
};
