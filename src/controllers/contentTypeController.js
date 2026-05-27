const ContentType = require('../models/contentTypeModel');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../utils/constants');

// CREATE CONTENT TYPE (Admin)
const createContentType = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('Name and slug are required')
      );
    }

    const contentType = await ContentType.create(name, slug);

    return res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(contentType, 'Content type created successfully')
    );
  } catch (error) {
    console.error('Create content type error:', error);
    if (error.code === '23505') {
      return res.status(HTTP_STATUS.CONFLICT).json(
        createErrorResponse('Content type slug already exists')
      );
    }
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error creating content type')
    );
  }
};

// GET ALL CONTENT TYPES (Public)
const getAllContentTypes = async (req, res) => {
  try {
    const contentTypes = await ContentType.findAll();
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(contentTypes, 'Content types retrieved successfully')
    );
  } catch (error) {
    console.error('Get all content types error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving content types')
    );
  }
};

// GET CONTENT TYPE BY ID (Public)
const getContentTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const contentType = await ContentType.findById(id);

    if (!contentType) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Content type not found')
      );
    }

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(contentType, 'Content type retrieved successfully')
    );
  } catch (error) {
    console.error('Get content type by id error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving content type')
    );
  }
};

// UPDATE CONTENT TYPE (Admin)
const updateContentType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    const contentType = await ContentType.findById(id);
    if (!contentType) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Content type not found')
      );
    }

    const updated = await ContentType.update(id, { name, slug });

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(updated, 'Content type updated successfully')
    );
  } catch (error) {
    console.error('Update content type error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error updating content type')
    );
  }
};

// DELETE CONTENT TYPE (Admin)
const deleteContentType = async (req, res) => {
  try {
    const { id } = req.params;

    const contentType = await ContentType.findById(id);
    if (!contentType) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Content type not found')
      );
    }

    await ContentType.delete(id);

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, 'Content type deleted successfully')
    );
  } catch (error) {
    console.error('Delete content type error:', error);
    // Handle FK violation (content type still used by contents)
    if (error.code === '23503') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('Cannot delete content type that is still in use by contents')
      );
    }
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error deleting content type')
    );
  }
};

module.exports = {
  createContentType,
  getAllContentTypes,
  getContentTypeById,
  updateContentType,
  deleteContentType,
};
