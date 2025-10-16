const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  file: {
    type: DataTypes.STRING,
    allowNull: true
  },
  viewOnce: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  delay: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
    validate: {
      min: 500,
      max: 5000
    }
  },
  receivers: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isArray(value) {
        if (!Array.isArray(value)) {
          throw new Error('Receivers must be an array');
        }
        if (value.length === 0) {
          throw new Error('At least one receiver is required');
        }
      }
    }
  },
  total_receivers: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'running', 'completed', 'failed', 'cancelled', 'scheduled'),
    defaultValue: 'pending'
  },
  scheduled_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  results: {
    type: DataTypes.JSON,
    allowNull: true
  },
  progress: {
    type: DataTypes.JSON,
    defaultValue: {
      sent: 0,
      failed: 0,
      invalid: 0,
      total: 0
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'campaigns',
  timestamps: false,
  indexes: [
    {
      fields: ['status']
    },
    {
      fields: ['scheduled_at']
    }
  ]
});

module.exports = Campaign;
