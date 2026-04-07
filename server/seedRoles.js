const mongoose = require('mongoose');
const UserRole = require('./models/UserRole');

// Connect to database
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();

const seedRoles = async () => {
  try {
    // Clear existing roles
    await UserRole.deleteMany({});
    
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
        level: 100,
        isActive: true
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
        level: 50,
        isActive: true
      }
    ];
    
    const createdRoles = await UserRole.insertMany(defaultRoles);
    
    console.log('Default roles seeded successfully:');
    createdRoles.forEach(role => {
      console.log(`- ${role.displayName} (${role.name}) - Level: ${role.level}`);
      console.log(`  Permissions: ${role.permissions.join(', ')}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  }
};

seedRoles();
