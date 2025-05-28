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

router.use(protect);

router.post('/check-expired', restrictTo('admin'), subscriptionController.checkExpiredSubscriptions);

router.post('/', validate(createSubscriptionSchema), subscriptionController.createSubscription);

router.post('/:subscriptionId/renew', subscriptionController.renewSubscription);

router.get('/:userId', subscriptionController.getUserSubscription);
router.put('/:userId', validate(updateSubscriptionSchema), subscriptionController.updateSubscription);
router.delete('/:userId', validate(cancelSubscriptionSchema), subscriptionController.cancelSubscription);

module.exports = router; 