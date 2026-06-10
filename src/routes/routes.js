const express = require('express');
const router = express.Router();
const { register, login, refresh, logout } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const uploadRoutes = require("./uploadRoutes");
const { 
  createContent, 
  getAllContents, 
  getContentById,
  updateContent,
  deleteContent,
  addCategoryToContent,
  removeCategoryFromContent
} = require('../controllers/contentController');
const { addBookmark, removeBookmark, getUserBookmarks, checkBookmark } = require('../controllers/bookmarkController');
const { trackHistory, getUserHistory, clearUserHistory, removeHistory } = require('../controllers/historyController');
const {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan
} = require('../controllers/planController');
const {
  createSubscription,
  getActiveSubscription,
  getSubscriptionHistory,
  cancelSubscription
} = require('../controllers/subscriptionController');
const {
  createPayment,
  processPayment,
  getPaymentsBySubscription,
  refundPayment
} = require('../controllers/paymentController');
const {
  createSchedule,
  getActiveSchedules,
  getScheduleById,
  getSchedulesByContent,
  getSchedulesByUser,
  updateSchedule,
  deleteSchedule
} = require('../controllers/scheduleController');
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const {
  createContentType,
  getAllContentTypes,
  getContentTypeById,
  updateContentType,
  deleteContentType,
} = require('../controllers/contentTypeController');
const {
  createDetail,
  getDetail,
  updateDetail,
  deleteDetail,
} = require('../controllers/contentDetailController');
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignUserRole,
  removeUserRole,
  getUserRoles,
} = require('../controllers/roleController');
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  createSuccessResponse,
} = require('../utils/constants');

router.use('/profile', require('./profileRoutes'));

// REGISTER
router.post('/register', register);

// LOGIN
router.post('/login', login);

// REFRESH TOKEN
router.post('/refresh', refresh);

// LOGOUT
router.post('/logout', logout);

// ADMIN route
router.get(
  '/admin',
  authenticateToken,
  authorizeRoles('admin'),
  (req, res) => {
    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, SUCCESS_MESSAGES.WELCOME_ADMIN)
    );
  }
);

// USER route
router.get(
  '/user',
  authenticateToken,
  authorizeRoles('user', 'admin'),
  (req, res) => {
    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, SUCCESS_MESSAGES.WELCOME_USER)
    );
  }
);

// CONTENT routes
router.post('/contents', authenticateToken, createContent);
router.get('/contents', getAllContents);
router.get('/contents/:id', getContentById);
router.put('/contents/:id', authenticateToken, updateContent);
router.delete('/contents/:id', authenticateToken, deleteContent);
router.post('/contents/category', authenticateToken, addCategoryToContent);
router.delete('/contents/category', authenticateToken, removeCategoryFromContent);

// BOOKMARK routes
router.post('/bookmarks', authenticateToken, addBookmark);
router.delete('/bookmarks/:contentId', authenticateToken, removeBookmark);
router.get('/bookmarks', authenticateToken, getUserBookmarks);
router.get('/bookmarks/:contentId', authenticateToken, checkBookmark);

// HISTORY routes
router.post('/histories', authenticateToken, trackHistory);
router.get('/histories', authenticateToken, getUserHistory);
router.delete('/histories', authenticateToken, clearUserHistory);
router.delete('/histories/:contentId', authenticateToken, removeHistory);

// PLAN routes
router.post('/plans', authenticateToken, authorizeRoles('admin'), createPlan);
router.get('/plans', getAllPlans);
router.get('/plans/:id', authenticateToken, getPlanById);
router.put('/plans/:id', authenticateToken, authorizeRoles('admin'), updatePlan);
router.delete('/plans/:id', authenticateToken, authorizeRoles('admin'), deletePlan);

// SUBSCRIPTION routes
router.post('/subscriptions', authenticateToken, createSubscription);
router.get('/subscriptions/active', authenticateToken, getActiveSubscription);
router.get('/subscriptions/history', authenticateToken, getSubscriptionHistory);
router.put('/subscriptions/:id/cancel', authenticateToken, cancelSubscription);

// PAYMENT routes
router.post('/payments', authenticateToken, createPayment);
router.post('/payments/:id/pay', authenticateToken, processPayment);
router.get('/payments/subscription/:subscriptionId', authenticateToken, getPaymentsBySubscription);
router.put('/payments/:id/refund', authenticateToken, authorizeRoles('admin'), refundPayment);

// SCHEDULE routes
router.post('/schedules', authenticateToken, authorizeRoles('admin', 'moderator'), createSchedule);
router.get('/schedules', authenticateToken, getActiveSchedules);
router.get('/schedules/content/:contentId', authenticateToken, getSchedulesByContent);
router.get('/schedules/user', authenticateToken, getSchedulesByUser);
router.get('/schedules/:id', authenticateToken, getScheduleById);
router.put('/schedules/:id', authenticateToken, updateSchedule);
router.delete('/schedules/:id', authenticateToken, deleteSchedule);

// CATEGORY routes
router.post('/categories', authenticateToken, authorizeRoles('admin'), createCategory);
router.get('/categories', getAllCategories);
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id', authenticateToken, authorizeRoles('admin'), updateCategory);
router.delete('/categories/:id', authenticateToken, authorizeRoles('admin'), deleteCategory);

// CONTENT TYPE routes
router.post('/content-types', authenticateToken, authorizeRoles('admin'), createContentType);
router.get('/content-types', getAllContentTypes);
router.get('/content-types/:id', getContentTypeById);
router.put('/content-types/:id', authenticateToken, authorizeRoles('admin'), updateContentType);
router.delete('/content-types/:id', authenticateToken, authorizeRoles('admin'), deleteContentType);

// CONTENT DETAIL routes (Music / Movie / News — auto-resolved by content type)
router.post('/contents/:contentId/details', authenticateToken, createDetail);
router.get('/contents/:contentId/details', getDetail);
router.put('/contents/:contentId/details', authenticateToken, updateDetail);
router.delete('/contents/:contentId/details', authenticateToken, deleteDetail);

// ROLE routes (Admin only for management, Admin/Moderator to view user roles)
router.post('/roles', authenticateToken, authorizeRoles('admin'), createRole);
router.get('/roles', authenticateToken, authorizeRoles('admin'), getAllRoles);
router.get('/roles/:id', authenticateToken, authorizeRoles('admin'), getRoleById);
router.put('/roles/:id', authenticateToken, authorizeRoles('admin'), updateRole);
router.delete('/roles/:id', authenticateToken, authorizeRoles('admin'), deleteRole);
router.post('/roles/assign', authenticateToken, authorizeRoles('admin'), assignUserRole);
router.post('/roles/remove', authenticateToken, authorizeRoles('admin'), removeUserRole);
router.get('/roles/user/:userId', authenticateToken, authorizeRoles('admin', 'moderator'), getUserRoles);

// USER MANAGEMENT routes
router.get('/users', authenticateToken, authorizeRoles('admin'), getAllUsers);
router.post('/users', authenticateToken, authorizeRoles('admin'), createUser);
router.put('/users/:id', authenticateToken, authorizeRoles('admin'), updateUser);
router.delete('/users/:id', authenticateToken, authorizeRoles('admin'), deleteUser);

// CLOUDINARY
router.use(uploadRoutes);

module.exports = router;
