const Content = require('../models/contentModel');
const ContentCategory = require('../models/contentCategoryModel');
const ContentType = require('../models/contentTypeModel');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../utils/constants');

const createContent = async (req, res) => {
  try {
    const { title, slug, description, contentTypeId, thumbnail, status = 'draft', categoryIds = [] } = req.body;
    const userId = req.user ? (req.user.id || req.user.userId) : null;
    
    if (!title || !slug || !contentTypeId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('Title, slug, and content type ID are required')
      );
    }

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    // Create content
    const content = await Content.create({
      userId,
      contentTypeId,
      title,
      slug,
      description,
      thumbnail,
      status
    });

    // Add categories if provided
    if (Array.isArray(categoryIds) && categoryIds.length > 0) {
      for (const categoryId of categoryIds) {
        await ContentCategory.addCategory(content.id, categoryId);
      }
    }

    return res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(content, 'Content created successfully')
    );
  } catch (error) {
    console.error('Create content error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error creating content')
    );
  }
};

const getAllContents = async (req, res) => {
  try {
    const { status, contentTypeId } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (contentTypeId) filters.contentTypeId = parseInt(contentTypeId);

    const contents = await Content.findAll(filters);
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(contents, 'Contents retrieved successfully')
    );
  } catch (error) {
    console.error('Get all contents error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving contents')
    );
  }
};

const getContentById = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findById(id);
    
    if (!content) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Content not found')
      );
    }

    // Increment view count
    await Content.incrementViews(id);
    
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(content, 'Content retrieved successfully')
    );
  } catch (error) {
    console.error('Get content by id error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving content')
    );
  }
};

const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, description, thumbnail, status, publishedAt } = req.body;

    const content = await Content.findById(id);
    if (!content) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Content not found')
      );
    }

    const updated = await Content.update(id, {
      title,
      slug,
      description,
      thumbnail,
      status,
      publishedAt
    });

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(updated, 'Content updated successfully')
    );
  } catch (error) {
    console.error('Update content error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error updating content')
    );
  }
};

const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { soft = true } = req.query;

    const content = await Content.findById(id);
    if (!content) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Content not found')
      );
    }

    if (soft === 'true' || soft === true) {
      await Content.softDelete(id);
    } else {
      await Content.delete(id);
    }

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, 'Content deleted successfully')
    );
  } catch (error) {
    console.error('Delete content error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error deleting content')
    );
  }
};

const addCategoryToContent = async (req, res) => {
  try {
    const { contentId, categoryId } = req.body;

    if (!contentId || !categoryId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('Content ID and category ID are required')
      );
    }

    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Content not found')
      );
    }

    const result = await ContentCategory.addCategory(contentId, categoryId);

    return res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(result, 'Category added to content successfully')
    );
  } catch (error) {
    console.error('Add category error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error adding category')
    );
  }
};

const removeCategoryFromContent = async (req, res) => {
  try {
    const { contentId, categoryId } = req.body;

    if (!contentId || !categoryId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('Content ID and category ID are required')
      );
    }

    await ContentCategory.removeCategory(contentId, categoryId);

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, 'Category removed from content successfully')
    );
  } catch (error) {
    console.error('Remove category error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error removing category')
    );
  }
};

module.exports = {
  createContent,
  getAllContents,
  getContentById,
  updateContent,
  deleteContent,
  addCategoryToContent,
  removeCategoryFromContent
};
