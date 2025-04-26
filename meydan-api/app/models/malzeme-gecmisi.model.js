const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MalzemeGecmisi = sequelize.define('MalzemeGecmisi', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sariciId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'sarici_id'
  },
  malzemeTipi: {
    type: DataTypes.ENUM('TUTUN', 'MAKARON'),
    allowNull: false,
    field: 'malzeme_tipi'
  },
  miktar: {
    type: DataTypes.DECIMAL(10,3),
    allowNull: false
  },
  aciklama: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'malzeme_gecmisi',
  timestamps: true,
  underscored: true
});

module.exports = MalzemeGecmisi; 