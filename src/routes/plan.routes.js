const express = require('express');
const planController = require('../controllers/plan.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const { createPlanSchema, updatePlanSchema } = require('../validations/plan.validation');

const router = express.Router();

// Public routes
router.get('/', planController.getAllPlans);
router.get('/:id', planController.getPlanById);

// Protected admin routes
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', validate(createPlanSchema), planController.createPlan);
router.put('/:id', validate(updatePlanSchema), planController.updatePlan);
router.delete('/:id', planController.deletePlan);

module.exports = router; 