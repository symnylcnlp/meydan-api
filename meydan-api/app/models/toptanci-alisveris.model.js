const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ToptanciAlisveris = sequelize.define('ToptanciAlisveris', {
  toptanciId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  alinanMallar: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  tutar: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  }
});

module.exports = ToptanciAlisveris; 