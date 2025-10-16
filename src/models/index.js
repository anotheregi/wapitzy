const { sequelize, testConnection } = require('../config/database');
const Campaign = require('./Campaign');
const ContactList = require('./ContactList');

// Test database connection
testConnection();

// Sync database (create tables if they don't exist)
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  Campaign,
  ContactList,
  syncDatabase
};
