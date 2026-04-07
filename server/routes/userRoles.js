const express = require('express');
const router = express.Router();
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  seedRoles
} = require('../controllers/userRoleController');
const { protect, authorize } = require('../middleware/auth');

// Public route for seeding (remove in production)
router.post('/seed', seedRoles);

// Protected routes
router.use(protect);

// Routes that require admin permissions
router.use(authorize('TrivixamCrmAdmin'));

router.route('/')
  .get(getRoles)
  .post(createRole);

router.route('/:id')
  .get(getRole)
  .put(updateRole)
  .delete(deleteRole);

module.exports = router;
