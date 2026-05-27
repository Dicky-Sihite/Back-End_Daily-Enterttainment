const Profile = require('../models/profileModel');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../utils/constants');

const profileController = {
  async upsert(req, res) {
    try {
      const userId = req.user ? (req.user.id || req.user.userId) : null;

      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json(
          createErrorResponse('User not authenticated')
        );
      }

      const data = await Profile.upsert(userId, req.body);

      return res.status(HTTP_STATUS.OK).json(
        createSuccessResponse(data, 'Profile saved successfully')
      );
    } catch (err) {
      console.error('Upsert profile error:', err);
      return res.status(HTTP_STATUS.SERVER_ERROR).json(
        createErrorResponse(err.message || 'Error saving profile')
      );
    }
  },

  async get(req, res) {
    try {
      const userId = req.user ? (req.user.id || req.user.userId) : null;

      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json(
          createErrorResponse('User not authenticated')
        );
      }

      const profile = await Profile.findByUserId(userId);

      if (!profile) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          createErrorResponse('Profile not found')
        );
      }

      return res.status(HTTP_STATUS.OK).json(
        createSuccessResponse(profile, 'Profile retrieved successfully')
      );
    } catch (err) {
      console.error('Get profile error:', err);
      return res.status(HTTP_STATUS.SERVER_ERROR).json(
        createErrorResponse(err.message || 'Error retrieving profile')
      );
    }
  },

  async remove(req, res) {
    try {
      const userId = req.user ? (req.user.id || req.user.userId) : null;

      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json(
          createErrorResponse('User not authenticated')
        );
      }

      await Profile.delete(userId);

      return res.status(HTTP_STATUS.OK).json(
        createSuccessResponse(null, 'Profile deleted successfully')
      );
    } catch (err) {
      console.error('Delete profile error:', err);
      return res.status(HTTP_STATUS.SERVER_ERROR).json(
        createErrorResponse(err.message || 'Error deleting profile')
      );
    }
  },
};

module.exports = profileController;