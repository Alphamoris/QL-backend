const Plan = require('../models/plan.model');
const { AppError } = require('../utils/errorHandler');

exports.createPlan = async (planData) => {
  const existingPlan = await Plan.findOne({ name: planData.name });
  if (existingPlan) {
    throw new AppError('Plan with this name already exists', 400);
  }

  return await Plan.create(planData);
};

exports.getAllPlans = async (filters = {}) => {
  const query = { ...filters };
  
  // Only return active plans by default
  if (!query.hasOwnProperty('isActive')) {
    query.isActive = true;
  }
  
  return await Plan.find(query);
};

exports.getPlanById = async (planId) => {
  const plan = await Plan.findById(planId);
  if (!plan) {
    throw new AppError('Plan not found', 404);
  }
  
  return plan;
};

exports.updatePlan = async (planId, updateData) => {
  // Check if name is being updated and if it's already in use
  if (updateData.name) {
    const existingPlan = await Plan.findOne({ 
      name: updateData.name,
      _id: { $ne: planId }
    });
    
    if (existingPlan) {
      throw new AppError('Plan with this name already exists', 400);
    }
  }
  
  const plan = await Plan.findByIdAndUpdate(
    planId,
    updateData,
    { new: true, runValidators: true }
  );
  
  if (!plan) {
    throw new AppError('Plan not found', 404);
  }
  
  return plan;
};

exports.deletePlan = async (planId) => {
  const plan = await Plan.findByIdAndDelete(planId);
  
  if (!plan) {
    throw new AppError('Plan not found', 404);
  }
  
  return plan;
}; 