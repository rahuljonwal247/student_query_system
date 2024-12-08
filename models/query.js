

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Assuming you have a 'db.js' file for Sequelize connection

const Query = sequelize.define('Query', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Resolved'),
    defaultValue: 'Pending',
  },
  resolverId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  attachment: {
    type: DataTypes.STRING, // You can change this to DataTypes.BLOB if storing the file itself
    allowNull: true,        // Allowing null for optional attachments
  },
  internalNotes: {  // Add internalNotes field
    type: DataTypes.TEXT,
    allowNull: true,  // Allow null as it might not always be required
  },
  resolutionSummary: {  // Add resolutionSummary field
    type: DataTypes.TEXT,
    allowNull: true,  // Allow null as it might not always be required
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt columns
});

module.exports = Query;
