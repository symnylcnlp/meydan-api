const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Siparis = sequelize.define('Siparis', {
  gidenTutun: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    comment: 'Karton bazında giden tütün miktarı'
  },
  gidenMakaron: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    comment: 'Karton bazında giden makaron miktarı'
  },
  kartonSayisi: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Toplam karton sayısı'
  },
  sarimUcreti: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Karton başına sarım ücreti (TL)'
  },
  teslimTarihi: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Siparişin teslim tarihi'
  },
  aciklama: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Sipariş hakkında ek açıklamalar'
  }
});

module.exports = Siparis; 