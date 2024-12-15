

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
    type: DataTypes.ENUM('Pending', 'In Progress', 'Resolved','Under Investigation','Approved'),
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
  investigationId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  attachment: {
    type: DataTypes.STRING, 
    allowNull: true,        
  },
  internalNotes: {  
    type: DataTypes.TEXT,
    allowNull: true,  
  },
  resolutionSummary: {  
    type: DataTypes.TEXT,
    allowNull: true,  
  },
}, {
  timestamps: true, 
});

module.exports = Query;
