const planService = require('../services/plan.service');
const ApiResponse = require('../utils/apiResponse');

exports.createPlan = async (req, res, next) => {
  try {
    const plan = await planService.createPlan(req.body);
    
    res.status(201).json(
      ApiResponse.success('Plan created successfully', plan)
    );
  } catch (error) {
    next(error);
  }
};

exports.getAllPlans = async (req, res, next) => {
  try {
    // Extract query parameters for filtering
    const filters = {};
    if (req.query.isActive) {
      filters.isActive = req.query.isActive === 'true';
    }
    
    const plans = await planService.getAllPlans(filters);
    
    res.status(200).json(
      ApiResponse.success('Plans retrieved successfully', plans)
    );
  } catch (error) {
    next(error);
  }
};

exports.getPlanById = async (req, res, next) => {
  try {
    const plan = await planService.getPlanById(req.params.id);
    
    res.status(200).json(
      ApiResponse.success('Plan retrieved successfully', plan)
    );
  } catch (error) {
    next(error);
  }
};

exports.updatePlan = async (req, res, next) => {
  try {
    const plan = await planService.updatePlan(req.params.id, req.body);
    
    res.status(200).json(
      ApiResponse.success('Plan updated successfully', plan)
    );
  } catch (error) {
    next(error);
  }
};

exports.deletePlan = async (req, res, next) => {
  try {
    const plan = await planService.deletePlan(req.params.id);
    
    res.status(200).json(
      ApiResponse.success('Plan deleted successfully', plan)
    );
  } catch (error) {
    next(error);
  }
}; 