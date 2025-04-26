const OdemeTakvimi = require('../models/odeme-takvimi.model');

// Tüm ödemeleri listele
exports.findAll = async (req, res) => {
  try {
    const odemeler = await OdemeTakvimi.findAll({
      order: [['odemeTarihi', 'ASC']] // Ödeme tarihine göre sırala
    });
    res.json(odemeler);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Yeni ödeme ekle
exports.create = async (req, res) => {
  try {
    const { odemeMiktari, odemeTarihi, aciklama } = req.body;
    
    const odeme = await OdemeTakvimi.create({
      odemeMiktari,
      odemeTarihi: new Date(odemeTarihi),
      aciklama
    });

    res.status(201).json(odeme);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Ödeme güncelle
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { odemeMiktari, odemeTarihi, aciklama } = req.body;

    const odeme = await OdemeTakvimi.findByPk(id);
    if (!odeme) {
      return res.status(404).json({ message: 'Ödeme bulunamadı' });
    }

    await odeme.update({
      odemeMiktari,
      odemeTarihi: new Date(odemeTarihi),
      aciklama
    });

    res.json(odeme);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Ödeme sil
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const odeme = await OdemeTakvimi.findByPk(id);
    if (!odeme) {
      return res.status(404).json({ message: 'Ödeme bulunamadı' });
    }

    await odeme.destroy();
    res.json({ message: 'Ödeme başarıyla silindi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 