const Schedule = require('../models/scheduleModel');
const Content = require('../models/contentModel');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../utils/constants');

const createSchedule = async (req, res) => {
  try {
    const {
      contentId,
      title,
      description,
      poster,
      scheduleType = 'one_time',
      dayOfWeek,
      startTime,
      endTime,
      startDatetime,
      endDatetime,
      recurrenceRule,
      status = 'active',
    } = req.body;

    const createdBy = req.user ? (req.user.id || req.user.userId) : null;

    if (!contentId || !title || !scheduleType) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('contentId, title, and scheduleType are required')
      );
    }

    if (!createdBy) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    // Verify content exists
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Content to schedule not found')
      );
    }

    const schedule = await Schedule.create({
      contentId,
      createdBy,
      title,
      description,
      poster,
      scheduleType,
      dayOfWeek,
      startTime,
      endTime,
      startDatetime,
      endDatetime,
      recurrenceRule,
      status,
    });

    return res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(schedule, 'Schedule created successfully')
    );
  } catch (error) {
    console.error('Create schedule error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error creating schedule')
    );
  }
};

const getActiveSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findActive();
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(schedules, 'Active schedules retrieved successfully')
    );
  } catch (error) {
    console.error('Get active schedules error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving active schedules')
    );
  }
};

const getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Schedule not found')
      );
    }

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(schedule, 'Schedule retrieved successfully')
    );
  } catch (error) {
    console.error('Get schedule by id error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving schedule')
    );
  }
};

const getSchedulesByContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const schedules = await Schedule.findByContentId(contentId);
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(schedules, 'Schedules for content retrieved successfully')
    );
  } catch (error) {
    console.error('Get schedules by content error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving schedules')
    );
  }
};

const getSchedulesByUser = async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user.userId) : null;

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    const schedules = await Schedule.findByCreatedBy(userId);
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(schedules, 'User created schedules retrieved successfully')
    );
  } catch (error) {
    console.error('Get schedules by user error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving schedules')
    );
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? (req.user.id || req.user.userId) : null;

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Schedule not found')
      );
    }

    const isAdmin = req.user.roles && req.user.roles.includes('admin');
    const isModerator = req.user.roles && req.user.roles.includes('moderator');
    if (schedule.created_by !== userId && !isAdmin && !isModerator) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        createErrorResponse('Access denied')
      );
    }

    const updated = await Schedule.update(id, req.body);
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(updated, 'Schedule updated successfully')
    );
  } catch (error) {
    console.error('Update schedule error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error updating schedule')
    );
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? (req.user.id || req.user.userId) : null;

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Schedule not found')
      );
    }

    const isAdmin = req.user.roles && req.user.roles.includes('admin');
    const isModerator = req.user.roles && req.user.roles.includes('moderator');
    if (schedule.created_by !== userId && !isAdmin && !isModerator) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        createErrorResponse('Access denied')
      );
    }

    await Schedule.delete(id);
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, 'Schedule deleted successfully')
    );
  } catch (error) {
    console.error('Delete schedule error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error deleting schedule')
    );
  }
};

module.exports = {
  createSchedule,
  getActiveSchedules,
  getScheduleById,
  getSchedulesByContent,
  getSchedulesByUser,
  updateSchedule,
  deleteSchedule,
};
