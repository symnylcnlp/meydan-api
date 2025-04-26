const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SigaraTuru = sequelize.define('SigaraTuru', {
  turAdi: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  aciklama: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = SigaraTuru; 