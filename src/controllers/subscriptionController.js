const Subscription = require('../models/subscriptionModel');
const Plan = require('../models/planModel');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../utils/constants');

const createSubscription = async (req, res) => {
  try {
    const { planId, autoRenew = false } = req.body;
    const userId = req.user ? (req.user.id || req.user.userId) : null;

    if (!planId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('Plan ID is required')
      );
    }

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    // Verify plan exists
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Subscription plan not found')
      );
    }

    if (!plan.is_active) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('This subscription plan is currently inactive')
      );
    }

    // Check if user already has an active subscription
    const activeSub = await Subscription.findActiveByUserId(userId);
    if (activeSub) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('User already has an active subscription')
      );
    }

    // Calculate dates
    const startedAt = new Date();
    const durationDays = plan.duration_days;
    const endsAt = new Date();
    endsAt.setDate(startedAt.getDate() + durationDays);

    const subscription = await Subscription.create({
      userId,
      planId,
      status: 'pending', // Starts pending until payment is confirmed
      startedAt,
      endsAt,
      autoRenew,
    });

    return res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(subscription, 'Subscription initiated successfully. Please complete the payment.')
    );
  } catch (error) {
    console.error('Create subscription error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error initiating subscription')
    );
  }
};

const getActiveSubscription = async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user.userId) : null;

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    const subscription = await Subscription.findActiveByUserId(userId);
    
    if (!subscription) {
      return res.status(HTTP_STATUS.OK).json(
        createSuccessResponse(null, 'No active subscription found')
      );
    }

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(subscription, 'Active subscription retrieved successfully')
    );
  } catch (error) {
    console.error('Get active subscription error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving active subscription')
    );
  }
};

const getSubscriptionHistory = async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user.userId) : null;

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    const history = await Subscription.findByUserId(userId);
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(history, 'Subscription history retrieved successfully')
    );
  } catch (error) {
    console.error('Get subscription history error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving subscription history')
    );
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? (req.user.id || req.user.userId) : null;

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Subscription not found')
      );
    }

    // Verify ownership or admin privileges
    const isAdmin = req.user.roles && req.user.roles.includes('admin');
    if (subscription.user_id !== userId && !isAdmin) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        createErrorResponse('Access denied')
      );
    }

    const updated = await Subscription.cancel(id);
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(updated, 'Subscription canceled successfully')
    );
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error canceling subscription')
    );
  }
};

module.exports = {
  createSubscription,
  getActiveSubscription,
  getSubscriptionHistory,
  cancelSubscription,
};
