const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OdemeTakvimi = sequelize.define('OdemeTakvimi', {
  odemeMiktari: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Ödenecek miktar (TL)'
  },
  odemeTarihi: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Ödeme tarihi'
  },
  aciklama: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Ödeme hakkında açıklama'
  }
});

module.exports = OdemeTakvimi; 