const Joi = require('joi');
const mongoose = require('mongoose');

const objectIdSchema = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'Object ID validation');

const createSubscriptionSchema = Joi.object({
  userId: objectIdSchema.required(),
  planId: objectIdSchema.required(),
  autoRenew: Joi.boolean().default(false),
  paymentMethod: Joi.string().valid('CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER', 'OTHER').default('CREDIT_CARD'),
  transactionId: Joi.string().allow(null, ''),
  metaData: Joi.object().default({}),
});

const updateSubscriptionSchema = Joi.object({
  planId: objectIdSchema,
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED', 'PENDING'),
  autoRenew: Joi.boolean(),
  paymentStatus: Joi.string().valid('PAID', 'UNPAID', 'FAILED', 'REFUNDED', 'PENDING'),
  paymentMethod: Joi.string().valid('CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER', 'OTHER'),
  transactionId: Joi.string().allow(null, ''),
  cancellationReason: Joi.string().allow(null, ''),
  metaData: Joi.object(),
}).min(1);

const cancelSubscriptionSchema = Joi.object({
  cancellationReason: Joi.string().allow(null, ''),
});

module.exports = {
  createSubscriptionSchema,
  updateSubscriptionSchema,
  cancelSubscriptionSchema,
}; 