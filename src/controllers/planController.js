const Plan = require('../models/planModel');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../utils/constants');

const createPlan = async (req, res) => {
  try {
    const { name, slug, price, durationDays, description, isActive } = req.body;

    if (!name || !slug || price === undefined || !durationDays) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('Name, slug, price, and durationDays are required')
      );
    }

    const plan = await Plan.create({
      name,
      slug,
      price,
      durationDays,
      description,
      isActive,
    });

    return res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(plan, 'Plan created successfully')
    );
  } catch (error) {
    console.error('Create plan error:', error);
    if (error.code === '23505') {
      return res.status(HTTP_STATUS.CONFLICT).json(
        createErrorResponse('Plan slug already exists')
      );
    }
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error creating plan')
    );
  }
};

const getAllPlans = async (req, res) => {
  try {
    // Only show inactive plans if all=true is explicitly requested
    const all = req.query.all === 'true';
    
    // Check if the user is authorized to see inactive plans (admin or moderator)
    let activeOnly = true;
    if (all && req.user && req.user.roles && (req.user.roles.includes('admin') || req.user.roles.includes('moderator'))) {
      activeOnly = false;
    }

    const plans = await Plan.findAll(activeOnly);
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(plans, 'Plans retrieved successfully')
    );
  } catch (error) {
    console.error('Get all plans error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving plans')
    );
  }
};

const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Plan not found')
      );
    }

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(plan, 'Plan retrieved successfully')
    );
  } catch (error) {
    console.error('Get plan by id error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving plan')
    );
  }
};

const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Plan not found')
      );
    }

    const updated = await Plan.update(id, req.body);
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(updated, 'Plan updated successfully')
    );
  } catch (error) {
    console.error('Update plan error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error updating plan')
    );
  }
};

const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Plan not found')
      );
    }

    await Plan.delete(id);
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, 'Plan deleted successfully')
    );
  } catch (error) {
    console.error('Delete plan error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error deleting plan')
    );
  }
};

module.exports = {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
};
