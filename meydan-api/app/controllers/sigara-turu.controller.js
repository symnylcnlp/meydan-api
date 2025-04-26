const SigaraTuru = require('../models/sigara-turu.model');

// Tüm sigara türlerini listele
exports.findAll = async (req, res) => {
  try {
    const turler = await SigaraTuru.findAll();
    res.json(turler);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Yeni sigara türü ekle
exports.create = async (req, res) => {
  try {
    const { turAdi, aciklama } = req.body;
    const sigaraTuru = await SigaraTuru.create({
      turAdi,
      aciklama
    });
    res.status(201).json(sigaraTuru);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Sigara türünü güncelle
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { turAdi, aciklama } = req.body;
    
    const sigaraTuru = await SigaraTuru.findByPk(id);
    if (!sigaraTuru) {
      return res.status(404).json({ message: 'Sigara türü bulunamadı' });
    }

    await sigaraTuru.update({
      turAdi,
      aciklama
    });

    res.json(sigaraTuru);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Sigara türünü sil
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const sigaraTuru = await SigaraTuru.findByPk(id);
    
    if (!sigaraTuru) {
      return res.status(404).json({ message: 'Sigara türü bulunamadı' });
    }

    await sigaraTuru.destroy();
    res.json({ message: 'Sigara türü silindi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 