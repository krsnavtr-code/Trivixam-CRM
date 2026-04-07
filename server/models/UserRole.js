const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a role name'],
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: [true, 'Please add a display name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  permissions: [{
    type: String,
    enum: [
      'user_management',
      'system_settings',
      'view_reports',
      'manage_customers',
      'manage_sales',
      'view_dashboard',
      'manage_roles'
    ]
  }],
  level: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Static method to get role by name
userRoleSchema.statics.getRoleByName = function(roleName) {
  return this.findOne({ name: roleName, isActive: true });
};

// Instance method to check permission
userRoleSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

module.exports = mongoose.model('UserRole', userRoleSchema);
