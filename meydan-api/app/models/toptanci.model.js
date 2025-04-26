const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Toptanci = sequelize.define('Toptanci', {
  toptanciAdi: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  aciklama: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  toplamBorc: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  }
});

module.exports = Toptanci; 