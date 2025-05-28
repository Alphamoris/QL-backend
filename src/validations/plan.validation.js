const Joi = require('joi');

const createPlanSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).required(),
  price: Joi.number().min(0).required(),
  currency: Joi.string().valid('USD', 'EUR', 'GBP', 'INR').default('USD'),
  duration: Joi.number().integer().min(1).required(),
  durationUnit: Joi.string().valid('day', 'month', 'year').default('day'),
  features: Joi.array().items(Joi.string()).default([]),
  isActive: Joi.boolean().default(true),
});

const updatePlanSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().min(10),
  price: Joi.number().min(0),
  currency: Joi.string().valid('USD', 'EUR', 'GBP', 'INR'),
  duration: Joi.number().integer().min(1),
  durationUnit: Joi.string().valid('day', 'month', 'year'),
  features: Joi.array().items(Joi.string()),
  isActive: Joi.boolean(),
}).min(1);

module.exports = {
  createPlanSchema,
  updatePlanSchema,
}; 