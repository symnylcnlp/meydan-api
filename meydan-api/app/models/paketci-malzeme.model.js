const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SigaraTuru = require('./sigara-turu.model');

const PaketciMalzeme = sequelize.define('PaketciMalzeme', {
  paketciId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  malzemeTipi: {
    type: DataTypes.ENUM('SIGARA', 'PAKET'),
    allowNull: false
  },
  sigaraTuruId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: SigaraTuru,
      key: 'id'
    }
  },
  miktar: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false
  },
  aciklama: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

PaketciMalzeme.belongsTo(SigaraTuru, { foreignKey: 'sigaraTuruId' });

module.exports = PaketciMalzeme; 