const express = require('express');
const subscriptionController = require('../controllers/subscription.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const { 
  createSubscriptionSchema, 
  updateSubscriptionSchema,
  cancelSubscriptionSchema
} = require('../validations/subscription.validation');

const router = express.Router();

// All subscription routes require authentication
router.use(protect);

// User subscription routes
router.get('/:userId', subscriptionController.getUserSubscription);
router.put('/:userId', validate(updateSubscriptionSchema), subscriptionController.updateSubscription);
router.delete('/:userId', validate(cancelSubscriptionSchema), subscriptionController.cancelSubscription);

// Creating a new subscription
router.post('/', validate(createSubscriptionSchema), subscriptionController.createSubscription);

// Renew subscription
router.post('/:subscriptionId/renew', subscriptionController.renewSubscription);

// Admin only routes
router.use(restrictTo('admin'));

// Check for expired subscriptions
router.post('/check-expired', subscriptionController.checkExpiredSubscriptions);

module.exports = router; 