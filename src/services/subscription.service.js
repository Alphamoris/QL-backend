const mongoose = require('mongoose');
const Subscription = require('../models/subscription.model');
const Plan = require('../models/plan.model');
const User = require('../models/user.model');
const { AppError } = require('../utils/errorHandler');

// Helper function to calculate end date based on plan
const calculateEndDate = (startDate, plan) => {
  const endDate = new Date(startDate);
  
  switch (plan.durationUnit) {
    case 'day':
      endDate.setDate(endDate.getDate() + plan.duration);
      break;
    case 'month':
      endDate.setMonth(endDate.getMonth() + plan.duration);
      break;
    case 'year':
      endDate.setFullYear(endDate.getFullYear() + plan.duration);
      break;
    default:
      endDate.setDate(endDate.getDate() + plan.duration);
  }
  
  return endDate;
};

exports.createSubscription = async (subscriptionData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if user exists
    const user = await User.findById(subscriptionData.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if plan exists
    const plan = await Plan.findById(subscriptionData.planId);
    if (!plan) {
      throw new AppError('Plan not found', 404);
    }

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      user: subscriptionData.userId,
      status: 'ACTIVE',
    });

    if (existingSubscription) {
      throw new AppError('User already has an active subscription', 400);
    }

    // Calculate end date based on plan duration
    const startDate = new Date();
    const endDate = calculateEndDate(startDate, plan);

    // Create subscription
    const subscription = await Subscription.create({
      user: subscriptionData.userId,
      plan: subscriptionData.planId,
      status: 'ACTIVE',
      startDate,
      endDate,
      autoRenew: subscriptionData.autoRenew || false,
      paymentMethod: subscriptionData.paymentMethod || 'CREDIT_CARD',
      paymentStatus: 'PAID',
      transactionId: subscriptionData.transactionId || null,
      metaData: subscriptionData.metaData || {},
    });

    await session.commitTransaction();
    session.endSession();

    return subscription.populate('plan');
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.getUserSubscription = async (userId) => {
  const subscription = await Subscription.findOne({ user: userId })
    .sort({ createdAt: -1 })
    .populate('plan');

  if (!subscription) {
    throw new AppError('No subscription found for this user', 404);
  }

  return subscription;
};

exports.getUserActiveSubscription = async (userId) => {
  const subscription = await Subscription.findOne({ 
    user: userId,
    status: 'ACTIVE',
  }).populate('plan');

  if (!subscription) {
    throw new AppError('No active subscription found for this user', 404);
  }

  return subscription;
};

exports.updateSubscription = async (userId, updateData) => {
  // Get current subscription
  const subscription = await Subscription.findOne({
    user: userId,
    status: 'ACTIVE',
  });

  if (!subscription) {
    throw new AppError('No active subscription found for this user', 404);
  }

  // If changing plan
  if (updateData.planId && !subscription.plan.equals(updateData.planId)) {
    const plan = await Plan.findById(updateData.planId);
    if (!plan) {
      throw new AppError('Plan not found', 404);
    }

    // Recalculate end date based on new plan
    subscription.plan = updateData.planId;
    subscription.endDate = calculateEndDate(new Date(), plan);
  }

  // Update other fields
  Object.keys(updateData).forEach(key => {
    if (key !== 'planId' && key !== 'user' && subscription[key] !== undefined) {
      subscription[key] = updateData[key];
    }
  });

  await subscription.save();
  return subscription.populate('plan');
};

exports.cancelSubscription = async (userId, cancellationReason = '') => {
  const subscription = await Subscription.findOne({
    user: userId,
    status: 'ACTIVE',
  });

  if (!subscription) {
    throw new AppError('No active subscription found for this user', 404);
  }

  subscription.status = 'CANCELLED';
  subscription.cancellationReason = cancellationReason;
  subscription.autoRenew = false;

  await subscription.save();
  return subscription.populate('plan');
};

exports.checkAndUpdateExpiredSubscriptions = async () => {
  const now = new Date();
  
  const result = await Subscription.updateMany(
    {
      status: 'ACTIVE',
      endDate: { $lt: now },
    },
    {
      $set: { status: 'EXPIRED' },
    }
  );
  
  return result.modifiedCount;
};

exports.renewSubscription = async (subscriptionId) => {
  const subscription = await Subscription.findById(subscriptionId)
    .populate('plan');

  if (!subscription) {
    throw new AppError('Subscription not found', 404);
  }

  if (subscription.status !== 'ACTIVE' && subscription.status !== 'EXPIRED') {
    throw new AppError('Only active or expired subscriptions can be renewed', 400);
  }

  // Calculate new end date
  const startDate = new Date();
  const endDate = calculateEndDate(startDate, subscription.plan);

  subscription.startDate = startDate;
  subscription.endDate = endDate;
  subscription.status = 'ACTIVE';
  
  await subscription.save();
  return subscription;
}; 