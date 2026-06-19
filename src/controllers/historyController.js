const History = require('../models/historyModel');
const Content = require('../models/contentModel');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../utils/constants');

const trackHistory = async (req, res) => {
  try {
    const { content_id } = req.body;
    const user_id = req.user ? (req.user.id || req.user.userId) : null;

    if (!content_id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('Content ID is required')
      );
    }

    if (!user_id) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    const history = await History.addHistory(user_id, content_id);

    // Increment views_count setiap kali user menonton konten
    await Content.incrementViews(content_id);

    return res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(history, 'History tracked successfully')
    );

  } catch (error) {
    console.error('Track history error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error tracking history')
    );
  }
};

const getUserHistory = async (req, res) => {
  try {
    const user_id = req.user ? (req.user.id || req.user.userId) : null;

    if (!user_id) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    const histories = await History.findByUser(user_id);

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(histories, 'History retrieved successfully')
    );
  } catch (error) {
    console.error('Get history error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error retrieving history')
    );
  }
};

const clearUserHistory = async (req, res) => {
  try {
    const user_id = req.user ? (req.user.id || req.user.userId) : null;

    if (!user_id) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    await History.clearUserHistory(user_id);

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, 'History cleared successfully')
    );
  } catch (error) {
    console.error('Clear history error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error clearing history')
    );
  }
};

const removeHistory = async (req, res) => {
  try {
    const { contentId } = req.params;
    const user_id = req.user ? (req.user.id || req.user.userId) : null;

    if (!user_id) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    const removed = await History.removeHistory(user_id, contentId);

    if (!removed) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('History item not found')
      );
    }

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, 'History item removed successfully')
    );
  } catch (error) {
    console.error('Remove history error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error removing history item')
    );
  }
};

module.exports = {
  trackHistory,
  getUserHistory,
  clearUserHistory,
  removeHistory
};
