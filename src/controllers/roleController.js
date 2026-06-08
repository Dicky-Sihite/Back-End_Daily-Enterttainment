const Role = require('../models/roleModel');
const UserRole = require('../models/userRoleModel');
const User = require('../models/userModel');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../utils/constants');

// CREATE ROLE
const createRole = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('Name and slug are required')
      );
    }

    const role = await Role.create(name, slug);

    return res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(role, 'Role created successfully')
    );
  } catch (error) {
    console.error('Create role error:', error);
    if (error.code === '23505') {
      return res.status(HTTP_STATUS.CONFLICT).json(
        createErrorResponse('Role slug or name already exists')
      );
    }
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error creating role')
    );
  }
};

// GET ALL ROLES
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(roles, 'Roles retrieved successfully')
    );
  } catch (error) {
    console.error('Get all roles error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving roles')
    );
  }
};

// GET ROLE BY ID
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);

    if (!role) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Role not found')
      );
    }

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(role, 'Role retrieved successfully')
    );
  } catch (error) {
    console.error('Get role by id error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving role')
    );
  }
};

// UPDATE ROLE
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Role not found')
      );
    }

    const updated = await Role.update(id, { name, slug });

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(updated, 'Role updated successfully')
    );
  } catch (error) {
    console.error('Update role error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error updating role')
    );
  }
};

// DELETE ROLE
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Role not found')
      );
    }

    await Role.delete(id);

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, 'Role deleted successfully')
    );
  } catch (error) {
    console.error('Delete role error:', error);
    if (error.code === '23503') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('Cannot delete role that is still assigned to users')
      );
    }
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error deleting role')
    );
  }
};

// ASSIGN ROLE TO USER
const assignUserRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    if (!userId || !roleId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('userId and roleId are required')
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('User not found')
      );
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Role not found')
      );
    }

    const result = await UserRole.assignRole(userId, roleId);

    return res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(result, 'Role assigned to user successfully')
    );
  } catch (error) {
    console.error('Assign user role error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse(error.message || 'Error assigning role to user')
    );
  }
};

// REMOVE ROLE FROM USER
const removeUserRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    if (!userId || !roleId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('userId and roleId are required')
      );
    }

    await UserRole.removeRole(userId, roleId);

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, 'Role removed from user successfully')
    );
  } catch (error) {
    console.error('Remove user role error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error removing role from user')
    );
  }
};

// GET USER ROLES
const getUserRoles = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('User not found')
      );
    }

    const roles = await UserRole.findByUserId(userId);

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(roles, 'User roles retrieved successfully')
    );
  } catch (error) {
    console.error('Get user roles error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving user roles')
    );
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignUserRole,
  removeUserRole,
  getUserRoles
};
