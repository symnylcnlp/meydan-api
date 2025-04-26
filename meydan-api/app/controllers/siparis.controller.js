const Siparis = require('../models/siparis.model');

// Tüm siparişleri listele
exports.findAll = async (req, res) => {
  try {
    const siparisler = await Siparis.findAll({
      order: [['teslimTarihi', 'DESC']]
    });
    res.json(siparisler);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Yeni sipariş ekle
exports.create = async (req, res) => {
  try {
    const { gidenTutun, gidenMakaron, kartonSayisi, sarimUcreti, teslimTarihi, aciklama } = req.body;
    
    const siparis = await Siparis.create({
      gidenTutun,
      gidenMakaron,
      kartonSayisi,
      sarimUcreti,
      teslimTarihi: new Date(teslimTarihi),
      aciklama
    });

    res.status(201).json(siparis);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Sipariş güncelle
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { gidenTutun, gidenMakaron, kartonSayisi, sarimUcreti, teslimTarihi, aciklama } = req.body;

    const siparis = await Siparis.findByPk(id);
    if (!siparis) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }

    await siparis.update({
      gidenTutun,
      gidenMakaron,
      kartonSayisi,
      sarimUcreti,
      teslimTarihi: new Date(teslimTarihi),
      aciklama
    });

    res.json(siparis);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Sipariş sil
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const siparis = await Siparis.findByPk(id);
    if (!siparis) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }

    await siparis.destroy();
    res.json({ message: 'Sipariş başarıyla silindi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 