const subscriptionService = require('../services/subscription.service');
const ApiResponse = require('../utils/apiResponse');

exports.createSubscription = async (req, res, next) => {
  try {
    const subscription = await subscriptionService.createSubscription(req.body);
    
    res.status(201).json(
      ApiResponse.success('Subscription created successfully', subscription)
    );
  } catch (error) {
    next(error);
  }
};

exports.getUserSubscription = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const subscription = await subscriptionService.getUserSubscription(userId);
    
    res.status(200).json(
      ApiResponse.success('Subscription retrieved successfully', subscription)
    );
  } catch (error) {
    next(error);
  }
};

exports.updateSubscription = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const subscription = await subscriptionService.updateSubscription(userId, req.body);
    
    res.status(200).json(
      ApiResponse.success('Subscription updated successfully', subscription)
    );
  } catch (error) {
    next(error);
  }
};

exports.cancelSubscription = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { cancellationReason } = req.body;
    
    const subscription = await subscriptionService.cancelSubscription(userId, cancellationReason);
    
    res.status(200).json(
      ApiResponse.success('Subscription cancelled successfully', subscription)
    );
  } catch (error) {
    next(error);
  }
};

exports.checkExpiredSubscriptions = async (req, res, next) => {
  try {
    const count = await subscriptionService.checkAndUpdateExpiredSubscriptions();
    
    res.status(200).json(
      ApiResponse.success(`${count} subscriptions marked as expired`, { count })
    );
  } catch (error) {
    next(error);
  }
};

exports.renewSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const subscription = await subscriptionService.renewSubscription(subscriptionId);
    
    res.status(200).json(
      ApiResponse.success('Subscription renewed successfully', subscription)
    );
  } catch (error) {
    next(error);
  }
}; 