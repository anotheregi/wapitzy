const { Sequelize } = require('sequelize');
require('dotenv').config();

// Parse host and port from DB_HOST if it includes port (e.g., for Railway proxy)
let host = process.env.DB_HOST || 'localhost';
let port = process.env.DB_PORT || 3306;

if (host.includes(':')) {
  const parts = host.split(':');
  host = parts[0];
  port = parseInt(parts[1], 10) || port;
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'railway',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: host,
    port: port,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
