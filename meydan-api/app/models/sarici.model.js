const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const MalzemeGecmisi = require('./malzeme-gecmisi.model');

const Sarici = sequelize.define('Sarici', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sariciAdi: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'sarici_adi'
  },
  sarimUcreti: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    field: 'sarim_ucreti'
  },
  hazirKoliUcreti: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    field: 'hazir_koli_ucreti'
  },
  gidenTutun: {
    type: DataTypes.DECIMAL(10,3),
    allowNull: true,
    defaultValue: 0,
    field: 'giden_tutun'
  },
  gidenMakaron: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    field: 'giden_makaron'
  },
  gelenSigara: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    field: 'gelen_sigara'
  },
  kalanTutun: {
    type: DataTypes.DECIMAL(10,3),
    allowNull: true,
    defaultValue: 0,
    field: 'kalan_tutun'
  },
  kalanMakaron: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    field: 'kalan_makaron'
  }
}, {
  tableName: 'saricilar',
  timestamps: true, // createdAt ve updatedAt kolonlarını otomatik ekler
  underscored: true // snake_case kolon isimleri kullanır
});

// Sarici ve MalzemeGecmisi arasındaki ilişkiyi tanımla
Sarici.hasMany(MalzemeGecmisi, {
  foreignKey: 'sarici_id',
  as: 'malzemeGecmisi'
});

MalzemeGecmisi.belongsTo(Sarici, {
  foreignKey: 'sarici_id',
  as: 'sarici'
});

module.exports = Sarici; 