const Content = require('../models/contentModel');
const ContentCategory = require('../models/contentCategoryModel');
const ContentType = require('../models/contentTypeModel');
const MovieDetails = require('../models/movieDetailsModel');
const MusicDetails = require('../models/musicDetailsModel');
const NewsDetails = require('../models/newsDetailsModel');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../utils/constants');
const cloudinary = require('../config/cloudinary');

const uploadBase64ToCloudinary = async (base64String, folder = 'daily-entertainment') => {
  if (!base64String || !base64String.startsWith('data:')) {
    return base64String;
  }
  try {
    const uploadResult = await cloudinary.uploader.upload(base64String, {
      folder,
      resource_type: "auto"
    });
    return uploadResult.secure_url;
  } catch (error) {
    console.error('Error uploading base64 to Cloudinary:', error);
    throw new Error('Gagal mengunggah file ke Cloudinary: ' + error.message);
  }
};

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

    // Auto-upload base64 thumbnail if present
    let thumbnailUrl = thumbnail;
    if (thumbnail && thumbnail.startsWith('data:')) {
      thumbnailUrl = await uploadBase64ToCloudinary(thumbnail);
    }

    // Create content
    const content = await Content.create({
      userId,
      contentTypeId,
      title,
      slug,
      description,
      thumbnail: thumbnailUrl,
      status
    });

    // Add categories if provided
    if (Array.isArray(categoryIds) && categoryIds.length > 0) {
      for (const categoryId of categoryIds) {
        await ContentCategory.addCategory(content.id, categoryId);
      }
    }

    // Automatically create details based on contentTypeId / slug of the type
    const contentType = await ContentType.findById(contentTypeId);
    const typeSlug = contentType ? contentType.slug.toLowerCase() : '';
    
    let details = null;
    if (typeSlug === 'movie') {
      let videoUrl = req.body.videoUrl || req.body.url || '#';
      if (videoUrl && videoUrl.startsWith('data:')) {
        videoUrl = await uploadBase64ToCloudinary(videoUrl);
      }
      let director = req.body.director;
      if (!director && description) {
        if (description.includes('Sutradara:')) {
          const parts = description.split('\nSinopsis: ');
          director = parts[0].replace('Sutradara: ', '').trim();
        }
      }
      if (!director) director = 'Tidak diketahui';
      details = await MovieDetails.create(content.id, { director, videoUrl });
    } else if (typeSlug === 'music') {
      let audioUrl = req.body.audioUrl || req.body.url || '#';
      if (audioUrl && audioUrl.startsWith('data:')) {
        audioUrl = await uploadBase64ToCloudinary(audioUrl);
      }
      let artist = req.body.artist;
      if (!artist && description) {
        if (description.includes('Artis:')) {
          const parts = description.split('\n');
          artist = parts[0].replace('Artis: ', '').trim();
        }
      }
      if (!artist) artist = 'Tidak diketahui';
      details = await MusicDetails.create(content.id, { artist, audioUrl });
    } else if (typeSlug === 'news') {
      const author = req.body.author || 'Admin';
      const body = req.body.body || description || '';
      details = await NewsDetails.create(content.id, { author, body });
    }

    // Merge details into the returned content object for immediate frontend use
    const contentWithDetails = {
      ...content,
      director: details ? details.director : undefined,
      video_url: details ? details.video_url : undefined,
      artist: details ? details.artist : undefined,
      audio_url: details ? details.audio_url : undefined,
      author: details ? details.author : undefined,
      body: details ? details.body : undefined,
      url: details ? (details.video_url || details.audio_url) : undefined
    };

    return res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(contentWithDetails, 'Content created successfully')
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

    // Auto-upload base64 thumbnail if present
    let thumbnailUrl = thumbnail;
    if (thumbnail && thumbnail.startsWith('data:')) {
      thumbnailUrl = await uploadBase64ToCloudinary(thumbnail);
    }

    const updated = await Content.update(id, {
      title,
      slug,
      description,
      thumbnail: thumbnailUrl,
      status,
      publishedAt
    });

    // Automatically update details based on content type
    const contentType = await ContentType.findById(content.content_type_id);
    const typeSlug = contentType ? contentType.slug.toLowerCase() : '';

    let details = null;
    if (typeSlug === 'movie') {
      let videoUrl = req.body.videoUrl || req.body.url;
      if (videoUrl && videoUrl.startsWith('data:')) {
        videoUrl = await uploadBase64ToCloudinary(videoUrl);
      }
      let director = req.body.director;
      const desc = description || content.description;
      if (!director && desc) {
        if (desc.includes('Sutradara:')) {
          const parts = desc.split('\nSinopsis: ');
          director = parts[0].replace('Sutradara: ', '').trim();
        }
      }
      
      if (director || videoUrl) {
        const existing = await MovieDetails.findByContentId(id);
        if (existing) {
          details = await MovieDetails.update(id, { director, videoUrl });
        } else {
          details = await MovieDetails.create(id, { director: director || 'Tidak diketahui', videoUrl: videoUrl || '#' });
        }
      }
    } else if (typeSlug === 'music') {
      let audioUrl = req.body.audioUrl || req.body.url;
      if (audioUrl && audioUrl.startsWith('data:')) {
        audioUrl = await uploadBase64ToCloudinary(audioUrl);
      }
      let artist = req.body.artist;
      const desc = description || content.description;
      if (!artist && desc) {
        if (desc.includes('Artis:')) {
          const parts = desc.split('\n');
          artist = parts[0].replace('Artis: ', '').trim();
        }
      }
      
      if (artist || audioUrl) {
        const existing = await MusicDetails.findByContentId(id);
        if (existing) {
          details = await MusicDetails.update(id, { artist, audioUrl });
        } else {
          details = await MusicDetails.create(id, { artist: artist || 'Tidak diketahui', audioUrl: audioUrl || '#' });
        }
      }
    } else if (typeSlug === 'news') {
      const author = req.body.author;
      const body = req.body.body || description;
      
      if (author || body) {
        const existing = await NewsDetails.findByContentId(id);
        if (existing) {
          details = await NewsDetails.update(id, { author, body });
        } else {
          details = await NewsDetails.create(id, { author: author || 'Admin', body: body || description || content.description || '' });
        }
      }
    }

    const updatedWithDetails = {
      ...updated,
      director: details ? details.director : undefined,
      video_url: details ? details.video_url : undefined,
      artist: details ? details.artist : undefined,
      audio_url: details ? details.audio_url : undefined,
      author: details ? details.author : undefined,
      body: details ? details.body : undefined,
      url: details ? (details.video_url || details.audio_url) : undefined
    };

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(updatedWithDetails, 'Content updated successfully')
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
