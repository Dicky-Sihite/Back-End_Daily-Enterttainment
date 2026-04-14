const BookmarkModel = require('../models/bookmarkModel');
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

    const bookmark = await BookmarkModel.addBookmark(user_id, content_id);
    
    if (!bookmark) {
      // If no bookmark is returned but no error thrown, it was likely skipped due to ON CONFLICT
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
      createErrorResponse('Error adding bookmark')
    );
  }
};

const removeBookmark = async (req, res) => {
  try {
    const { contentId } = req.params;
    const user_id = req.user ? (req.user.id || req.user.userId) : null;

    const removed = await BookmarkModel.removeBookmark(user_id, contentId);

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
      createErrorResponse('Error removing bookmark')
    );
  }
};

const getUserBookmarks = async (req, res) => {
  try {
    const user_id = req.user ? (req.user.id || req.user.userId) : null;
    const bookmarks = await BookmarkModel.findByUser(user_id);

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(bookmarks, 'Bookmarks retrieved successfully')
    );
  } catch (error) {
    console.error('Get user bookmarks error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving bookmarks')
    );
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  getUserBookmarks
};
