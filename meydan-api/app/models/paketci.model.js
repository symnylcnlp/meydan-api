const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SigaraTuru = require('./sigara-turu.model');

const Paketci = sequelize.define('Paketci', {
  paketciAdi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paketlemeUcreti: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  gidenSigara: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    defaultValue: 0
  },
  alinanPaket: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    defaultValue: 0
  },
  kalanSigara: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    defaultValue: 0
  }
});

// Sigara türlerine göre stok takibi için ayrı bir tablo
const PaketciStok = sequelize.define('PaketciStok', {
  paketciId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Paketci,
      key: 'id'
    }
  },
  sigaraTuruId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SigaraTuru,
      key: 'id'
    }
  },
  gidenMiktar: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    defaultValue: 0
  },
  alinanMiktar: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    defaultValue: 0
  },
  kalanMiktar: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    defaultValue: 0
  },
  zaiyatMiktar: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  }
});

// İlişkileri tanımla
Paketci.hasMany(PaketciStok, { foreignKey: 'paketciId' });
PaketciStok.belongsTo(Paketci, { foreignKey: 'paketciId' });
PaketciStok.belongsTo(SigaraTuru, { foreignKey: 'sigaraTuruId' });

module.exports = { Paketci, PaketciStok }; 