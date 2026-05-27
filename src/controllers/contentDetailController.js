const MusicDetails = require('../models/musicDetailsModel');
const MovieDetails = require('../models/movieDetailsModel');
const NewsDetails = require('../models/newsDetailsModel');
const Content = require('../models/contentModel');
const ContentType = require('../models/contentTypeModel');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../utils/constants');

// Helper: resolve content type slug from content
async function getContentTypeSlug(content) {
  const contentType = await ContentType.findById(content.content_type_id);
  return contentType ? contentType.slug.toLowerCase() : null;
}

// =============================================
// CREATE DETAIL
// POST /api/contents/:contentId/details
// =============================================
const createDetail = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user ? (req.user.id || req.user.userId) : null;

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    // Verify content exists
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Content not found')
      );
    }

    // Only the owner or admin can add details
    const isAdmin = req.user.roles && req.user.roles.includes('admin');
    if (content.user_id !== userId && !isAdmin) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        createErrorResponse('Access denied')
      );
    }

    const typeSlug = await getContentTypeSlug(content);

    let detail;
    if (typeSlug === 'music') {
      const { artist, album, durationSeconds, audioUrl, lyrics } = req.body;
      if (!artist || !audioUrl) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          createErrorResponse('artist and audioUrl are required for music content')
        );
      }
      detail = await MusicDetails.create(contentId, { artist, album, durationSeconds, audioUrl, lyrics });

    } else if (typeSlug === 'movie') {
      const { director, durationSeconds, videoUrl, releaseDate, ageRating } = req.body;
      if (!director || !videoUrl) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          createErrorResponse('director and videoUrl are required for movie content')
        );
      }
      detail = await MovieDetails.create(contentId, { director, durationSeconds, videoUrl, releaseDate, ageRating });

    } else if (typeSlug === 'news') {
      const { author, body, source, publishedAt } = req.body;
      if (!author || !body) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          createErrorResponse('author and body are required for news content')
        );
      }
      detail = await NewsDetails.create(contentId, { author, body, source, publishedAt });

    } else {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse(`Unsupported content type: ${typeSlug}`)
      );
    }

    return res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(detail, `${typeSlug} detail created successfully`)
    );
  } catch (error) {
    console.error('Create detail error:', error);
    // Handle duplicate detail (already exists)
    if (error.code === '23505') {
      return res.status(HTTP_STATUS.CONFLICT).json(
        createErrorResponse('Detail for this content already exists. Use update instead.')
      );
    }
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error creating content detail')
    );
  }
};

// =============================================
// GET DETAIL
// GET /api/contents/:contentId/details
// =============================================
const getDetail = async (req, res) => {
  try {
    const { contentId } = req.params;

    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Content not found')
      );
    }

    const typeSlug = await getContentTypeSlug(content);

    let detail;
    if (typeSlug === 'music') {
      detail = await MusicDetails.findByContentId(contentId);
    } else if (typeSlug === 'movie') {
      detail = await MovieDetails.findByContentId(contentId);
    } else if (typeSlug === 'news') {
      detail = await NewsDetails.findByContentId(contentId);
    } else {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse(`Unsupported content type: ${typeSlug}`)
      );
    }

    if (!detail) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('No detail found for this content')
      );
    }

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(detail, 'Content detail retrieved successfully')
    );
  } catch (error) {
    console.error('Get detail error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving content detail')
    );
  }
};

// =============================================
// UPDATE DETAIL
// PUT /api/contents/:contentId/details
// =============================================
const updateDetail = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user ? (req.user.id || req.user.userId) : null;

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Content not found')
      );
    }

    const isAdmin = req.user.roles && req.user.roles.includes('admin');
    if (content.user_id !== userId && !isAdmin) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        createErrorResponse('Access denied')
      );
    }

    const typeSlug = await getContentTypeSlug(content);

    let updated;
    if (typeSlug === 'music') {
      updated = await MusicDetails.update(contentId, req.body);
    } else if (typeSlug === 'movie') {
      updated = await MovieDetails.update(contentId, req.body);
    } else if (typeSlug === 'news') {
      updated = await NewsDetails.update(contentId, req.body);
    } else {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse(`Unsupported content type: ${typeSlug}`)
      );
    }

    if (!updated) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('No detail found for this content. Create a detail first.')
      );
    }

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(updated, 'Content detail updated successfully')
    );
  } catch (error) {
    console.error('Update detail error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error updating content detail')
    );
  }
};

// =============================================
// DELETE DETAIL
// DELETE /api/contents/:contentId/details
// =============================================
const deleteDetail = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user ? (req.user.id || req.user.userId) : null;

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        createErrorResponse('User not authenticated')
      );
    }

    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Content not found')
      );
    }

    const isAdmin = req.user.roles && req.user.roles.includes('admin');
    if (content.user_id !== userId && !isAdmin) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        createErrorResponse('Access denied')
      );
    }

    const typeSlug = await getContentTypeSlug(content);

    if (typeSlug === 'music') {
      await MusicDetails.delete(contentId);
    } else if (typeSlug === 'movie') {
      await MovieDetails.delete(contentId);
    } else if (typeSlug === 'news') {
      await NewsDetails.delete(contentId);
    } else {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse(`Unsupported content type: ${typeSlug}`)
      );
    }

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, 'Content detail deleted successfully')
    );
  } catch (error) {
    console.error('Delete detail error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error deleting content detail')
    );
  }
};

module.exports = {
  createDetail,
  getDetail,
  updateDetail,
  deleteDetail,
};
