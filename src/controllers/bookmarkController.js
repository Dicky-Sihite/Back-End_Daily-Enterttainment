const Bookmark = require('../models/bookmarkModel');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../utils/constants');

const addBookmark = async (req, res) => {
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

    const bookmark = await Bookmark.addBookmark(user_id, content_id);
    
    if (!bookmark) {
      return res.status(HTTP_STATUS.OK).json(
        createSuccessResponse(null, 'Content already bookmarked')
      );
    }

    return res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(bookmark, 'Bookmark added successfully')
    );
  } catch (error) {
    console.error('Add bookmark error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error adding bookmark')
    );
  }
};

const removeBookmark = async (req, res) => {
  try {
    const { contentId } = req.params;
    const user_id = req.user ? (req.user.id || req.user.userId) : null;

    if (!user_id) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    const removed = await Bookmark.removeBookmark(user_id, contentId);

    if (!removed) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Bookmark not found')
      );
    }

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, 'Bookmark removed successfully')
    );
  } catch (error) {
    console.error('Remove bookmark error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error removing bookmark')
    );
  }
};

const getUserBookmarks = async (req, res) => {
  try {
    const user_id = req.user ? (req.user.id || req.user.userId) : null;

    if (!user_id) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    const bookmarks = await Bookmark.findByUser(user_id);

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(bookmarks, 'Bookmarks retrieved successfully')
    );
  } catch (error) {
    console.error('Get user bookmarks error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error retrieving bookmarks')
    );
  }
};

const checkBookmark = async (req, res) => {
  try {
    const { contentId } = req.params;
    const user_id = req.user ? (req.user.id || req.user.userId) : null;

    if (!user_id) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    const isBookmarked = await Bookmark.isBookmarked(user_id, contentId);

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse({ isBookmarked }, 'Bookmark status retrieved')
    );
  } catch (error) {
    console.error('Check bookmark error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error checking bookmark')
    );
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  getUserBookmarks,
  checkBookmark
};
