const { Paketci, PaketciStok } = require('../models/paketci.model');
const PaketciMalzeme = require('../models/paketci-malzeme.model');
const SigaraTuru = require('../models/sigara-turu.model');
const { Op } = require('sequelize');

// Tüm paketçileri listele
exports.findAll = async (req, res) => {
  try {
    const paketciler = await Paketci.findAll({
      include: [{
        model: PaketciStok,
        include: [{
          model: SigaraTuru,
          attributes: ['turAdi']
        }]
      }]
    });
    res.json(paketciler);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Yeni paketçi ekle
exports.create = async (req, res) => {
  try {
    const { paketciAdi, paketlemeUcreti } = req.body;
    const paketci = await Paketci.create({
      paketciAdi,
      paketlemeUcreti
    });
    res.status(201).json(paketci);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Paketçiye sigara ver
exports.sigaraEkle = async (req, res) => {
  try {
    const { id } = req.params;
    const { miktar, sigaraTuruId } = req.body;

    const paketci = await Paketci.findByPk(id);
    if (!paketci) {
      return res.status(404).json({ message: 'Paketçi bulunamadı' });
    }

    const sigaraTuru = await SigaraTuru.findByPk(sigaraTuruId);
    if (!sigaraTuru) {
      return res.status(404).json({ message: 'Sigara türü bulunamadı' });
    }

    // Stok kaydını bul veya oluştur
    let stok = await PaketciStok.findOne({
      where: {
        paketciId: id,
        sigaraTuruId
      }
    });

    if (!stok) {
      stok = await PaketciStok.create({
        paketciId: id,
        sigaraTuruId,
        gidenMiktar: miktar,
        kalanMiktar: miktar
      });
    } else {
      await stok.update({
        gidenMiktar: parseFloat(stok.gidenMiktar) + parseFloat(miktar),
        kalanMiktar: parseFloat(stok.kalanMiktar) + parseFloat(miktar)
      });
    }

    // Genel toplamları güncelle
    await paketci.update({
      gidenSigara: parseFloat(paketci.gidenSigara) + parseFloat(miktar),
      kalanSigara: parseFloat(paketci.kalanSigara) + parseFloat(miktar)
    });

    // Malzeme geçmişine ekle
    await PaketciMalzeme.create({
      paketciId: id,
      malzemeTipi: 'SIGARA',
      sigaraTuruId,
      miktar,
      aciklama: `${miktar} koli ${sigaraTuru.turAdi} sigara verildi`
    });

    res.json({
      paketciAdi: paketci.paketciAdi,
      sigaraTuru: sigaraTuru.turAdi,
      eklenenSigara: miktar,
      guncelKalan: stok.kalanMiktar
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Paketçiden paket al
exports.paketEkle = async (req, res) => {
  try {
    const { id } = req.params;
    const { miktar, sigaraTuruId, zaiyatMiktar } = req.body;

    const paketci = await Paketci.findByPk(id);
    if (!paketci) {
      return res.status(404).json({ message: 'Paketçi bulunamadı' });
    }

    const sigaraTuru = await SigaraTuru.findByPk(sigaraTuruId);
    if (!sigaraTuru) {
      return res.status(404).json({ message: 'Sigara türü bulunamadı' });
    }

    // Stok kaydını kontrol et
    const stok = await PaketciStok.findOne({
      where: {
        paketciId: id,
        sigaraTuruId
      }
    });

    if (!stok || parseFloat(stok.kalanMiktar) < parseFloat(miktar)) {
      return res.status(400).json({ 
        message: 'Yeterli sigara yok',
        mevcut: stok ? stok.kalanMiktar : 0,
        istenen: miktar
      });
    }

    // Stok miktarını güncelle
    await stok.update({
      alinanMiktar: parseFloat(stok.alinanMiktar) + parseFloat(miktar),
      kalanMiktar: parseFloat(stok.kalanMiktar) - parseFloat(miktar),
      zaiyatMiktar: zaiyatMiktar || null
    });

    // Genel toplamları güncelle
    await paketci.update({
      alinanPaket: parseFloat(paketci.alinanPaket) + parseFloat(miktar),
      kalanSigara: parseFloat(paketci.kalanSigara) - parseFloat(miktar)
    });

    // Malzeme geçmişine ekle
    await PaketciMalzeme.create({
      paketciId: id,
      malzemeTipi: 'PAKET',
      sigaraTuruId,
      miktar,
      aciklama: `${miktar} koli ${sigaraTuru.turAdi} paket alındı${zaiyatMiktar ? `, zaiyat: ${zaiyatMiktar}` : ''}`
    });

    res.json({
      paketciAdi: paketci.paketciAdi,
      sigaraTuru: sigaraTuru.turAdi,
      alinanPaket: miktar,
      zaiyatMiktar: zaiyatMiktar || null,
      guncelDurum: {
        kalanSigara: stok.kalanMiktar,
        paketlemeBorcu: miktar * paketci.paketlemeUcreti
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Borç hesapla
exports.hesaplaBorc = async (req, res) => {
  try {
    const { id } = req.params;
    const paketci = await Paketci.findByPk(id, {
      include: [{
        model: PaketciStok,
        include: [{
          model: SigaraTuru,
          attributes: ['turAdi']
        }]
      }]
    });
    
    if (!paketci) {
      return res.status(404).json({ message: 'Paketçi bulunamadı' });
    }

    const toplamPaketlemeBorcu = parseFloat(paketci.alinanPaket) * parseFloat(paketci.paketlemeUcreti);

    res.json({
      paketciAdi: paketci.paketciAdi,
      alinanPaket: paketci.alinanPaket,
      birimPaketlemeUcreti: paketci.paketlemeUcreti,
      toplamPaketlemeBorcu: toplamPaketlemeBorcu,
      malzemeDurumu: {
        gidenSigara: paketci.gidenSigara,
        alinanPaket: paketci.alinanPaket,
        kalanSigara: paketci.kalanSigara,
        stokDurumu: paketci.PaketciStoks.map(stok => ({
          sigaraTuru: stok.SigaraTuru.turAdi,
          gidenMiktar: stok.gidenMiktar,
          alinanMiktar: stok.alinanMiktar,
          kalanMiktar: stok.kalanMiktar
        }))
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Borç öde
exports.borcOde = async (req, res) => {
  try {
    const { id } = req.params;
    const { odenenTutar } = req.body;

    const paketci = await Paketci.findByPk(id);
    if (!paketci) {
      return res.status(404).json({ message: 'Paketçi bulunamadı' });
    }

    const toplamBorc = parseFloat(paketci.alinanPaket) * parseFloat(paketci.paketlemeUcreti);
    
    if (odenenTutar > toplamBorc) {
      return res.status(400).json({ 
        message: 'Ödeme tutarı toplam borçtan fazla olamaz',
        guncelBorc: toplamBorc,
        odenmekIstenen: odenenTutar
      });
    }

    const odenenKoli = odenenTutar / paketci.paketlemeUcreti;
    const kalanBorc = toplamBorc - odenenTutar;

    res.json({
      paketciAdi: paketci.paketciAdi,
      odenenTutar,
      odenenKoli,
      kalanBorc
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Malzeme geçmişi
exports.malzemeGecmisi = async (req, res) => {
  try {
    const { id } = req.params;
    const paketci = await Paketci.findByPk(id);
    
    if (!paketci) {
      return res.status(404).json({ message: 'Paketçi bulunamadı' });
    }

    const malzemeGecmisi = await PaketciMalzeme.findAll({
      where: { paketciId: id },
      include: [{
        model: SigaraTuru,
        attributes: ['turAdi']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      paketciAdi: paketci.paketciAdi,
      malzemeGecmisi: malzemeGecmisi.map(m => ({
        ...m.toJSON(),
        sigaraTuru: m.SigaraTuru ? m.SigaraTuru.turAdi : null
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 