const UserRole = require('../models/UserRole');

// @desc    Get all user roles
// @route   GET /api/roles
// @access  Private/Admin
exports.getRoles = async (req, res, next) => {
  try {
    const roles = await UserRole.find({ isActive: true }).sort({ level: -1 });
    
    res.status(200).json({
      success: true,
      count: roles.length,
      data: roles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user role
// @route   GET /api/roles/:id
// @access  Private/Admin
exports.getRole = async (req, res, next) => {
  try {
    const role = await UserRole.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: role
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user role
// @route   POST /api/roles
// @access  Private/Admin
exports.createRole = async (req, res, next) => {
  try {
    const { name, displayName, description, permissions, level } = req.body;
    
    // Check if role already exists
    const existingRole = await UserRole.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        error: 'Role with this name already exists'
      });
    }
    
    const role = await UserRole.create({
      name,
      displayName,
      description,
      permissions,
      level
    });
    
    res.status(201).json({
      success: true,
      data: role
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/roles/:id
// @access  Private/Admin
exports.updateRole = async (req, res, next) => {
  try {
    const role = await UserRole.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }
    
    const updatedRole = await UserRole.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      data: updatedRole
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user role
// @route   DELETE /api/roles/:id
// @access  Private/Admin
exports.deleteRole = async (req, res, next) => {
  try {
    const role = await UserRole.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }
    
    // Soft delete by setting isActive to false
    await UserRole.findByIdAndUpdate(req.params.id, { isActive: false });
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed default roles
// @route   POST /api/roles/seed
// @access  Private/Admin
exports.seedRoles = async (req, res, next) => {
  try {
    const defaultRoles = [
      {
        name: 'TrivixamCrmAdmin',
        displayName: 'Main Admin',
        description: 'Full system access with all permissions',
        permissions: [
          'user_management',
          'system_settings',
          'view_reports',
          'manage_customers',
          'manage_sales',
          'view_dashboard',
          'manage_roles'
        ],
        level: 100
      },
      {
        name: 'TrivixamCrmChildAdmin',
        displayName: 'Child Admin',
        description: 'Limited access for child administrators',
        permissions: [
          'manage_customers',
          'manage_sales',
          'view_dashboard'
        ],
        level: 50
      }
    ];
    
    const seededRoles = [];
    
    for (const roleData of defaultRoles) {
      const existingRole = await UserRole.findOne({ name: roleData.name });
      
      if (!existingRole) {
        const role = await UserRole.create(roleData);
        seededRoles.push(role);
      } else {
        seededRoles.push(existingRole);
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Default roles seeded successfully',
      data: seededRoles
    });
  } catch (error) {
    next(error);
  }
};
