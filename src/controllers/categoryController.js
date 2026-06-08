const Category = require('../models/categoryModel');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../utils/constants');

// CREATE CATEGORY (Admin)
const createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('Name and slug are required')
      );
    }

    const category = await Category.create(name, slug, description);

    return res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(category, 'Category created successfully')
    );
  } catch (error) {
    console.error('Create category error:', error);
    if (error.code === '23505') {
      return res.status(HTTP_STATUS.CONFLICT).json(
        createErrorResponse('Category slug already exists')
      );
    }
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error creating category')
    );
  }
};

// GET ALL CATEGORIES (Public)
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(categories, 'Categories retrieved successfully')
    );
  } catch (error) {
    console.error('Get all categories error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving categories')
    );
  }
};

// GET CATEGORY BY ID (Public)
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Category not found')
      );
    }

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(category, 'Category retrieved successfully')
    );
  } catch (error) {
    console.error('Get category by id error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving category')
    );
  }
};

// UPDATE CATEGORY (Admin)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Category not found')
      );
    }

    const updated = await Category.update(id, { name, slug, description });

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(updated, 'Category updated successfully')
    );
  } catch (error) {
    console.error('Update category error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error updating category')
    );
  }
};

// DELETE CATEGORY (Admin)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Category not found')
      );
    }

    await Category.delete(id);

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, 'Category deleted successfully')
    );
  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error deleting category')
    );
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
