const Payment = require('../models/paymentModel');
const Subscription = require('../models/subscriptionModel');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../utils/constants');

const createPayment = async (req, res) => {
  try {
    const { subscriptionId, amount, paymentMethod, gateway, externalTransactionId } = req.body;
    const userId = req.user ? (req.user.id || req.user.userId) : null;

    if (!subscriptionId || amount === undefined || !paymentMethod || !gateway) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('subscriptionId, amount, paymentMethod, and gateway are required')
      );
    }

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    // Verify subscription exists and belongs to the user
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Subscription not found')
      );
    }

    const isAdmin = req.user.roles && req.user.roles.includes('admin');
    if (subscription.user_id !== userId && !isAdmin) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        createErrorResponse('Access denied')
      );
    }

    const payment = await Payment.create({
      subscriptionId,
      amount,
      paymentMethod,
      gateway,
      externalTransactionId,
      status: 'pending',
    });

    return res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(payment, 'Payment transaction initiated')
    );
  } catch (error) {
    console.error('Create payment error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error creating payment transaction')
    );
  }
};

const processPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? (req.user.id || req.user.userId) : null;

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Payment record not found')
      );
    }

    // Verify subscription ownership
    const subscription = await Subscription.findById(payment.subscription_id);
    const isAdmin = req.user.roles && req.user.roles.includes('admin');
    if (subscription.user_id !== userId && !isAdmin) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        createErrorResponse('Access denied')
      );
    }

    if (payment.status === 'paid') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('Payment is already processed')
      );
    }

    // Mark payment as paid
    const updatedPayment = await Payment.markAsPaid(id);

    // Automatically activate the subscription
    await Subscription.update(payment.subscription_id, {
      status: 'active',
      startedAt: new Date(),
    });

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(updatedPayment, 'Payment processed and subscription activated successfully')
    );
  } catch (error) {
    console.error('Process payment error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error processing payment')
    );
  }
};

const getPaymentsBySubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user ? (req.user.id || req.user.userId) : null;

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Subscription not found')
      );
    }

    const isAdmin = req.user.roles && req.user.roles.includes('admin');
    if (subscription.user_id !== userId && !isAdmin) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        createErrorResponse('Access denied')
      );
    }

    const payments = await Payment.findBySubscriptionId(subscriptionId);
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(payments, 'Payments retrieved successfully')
    );
  } catch (error) {
    console.error('Get payments error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving payments')
    );
  }
};

const refundPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Payment not found')
      );
    }

    if (payment.status === 'refunded') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('Payment has already been refunded')
      );
    }

    const updatedPayment = await Payment.markAsRefunded(id);

    // Cancel the subscription because of refund
    await Subscription.update(payment.subscription_id, {
      status: 'canceled',
    });

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(updatedPayment, 'Payment refunded and subscription canceled')
    );
  } catch (error) {
    console.error('Refund payment error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error refunding payment')
    );
  }
};

module.exports = {
  createPayment,
  processPayment,
  getPaymentsBySubscription,
  refundPayment,
};
