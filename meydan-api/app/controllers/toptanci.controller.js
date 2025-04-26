const Toptanci = require('../models/toptanci.model');
const ToptanciAlisveris = require('../models/toptanci-alisveris.model');

// Yardımcı fonksiyonlar
const yuvarla = (sayi) => Number(Number(sayi).toFixed(2));

const toptanciController = {
  // Tüm toptancıları getir
  async getAll(req, res) {
    try {
      const toptancilar = await Toptanci.findAll();
      res.json(toptancilar);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Tek bir toptancı getir
  async getById(req, res) {
    try {
      const toptanci = await Toptanci.findByPk(req.params.id);
      if (!toptanci) {
        return res.status(404).json({ message: 'Toptancı bulunamadı' });
      }
      res.json(toptanci);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Yeni toptancı ekle
  async create(req, res) {
    try {
      const data = {
        toptanciAdi: req.body.toptanciAdi,
        aciklama: req.body.aciklama,
        toplamBorc: 0
      };

      const toptanci = await Toptanci.create(data);
      res.status(201).json(toptanci);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Toptancı güncelle
  async update(req, res) {
    try {
      const toptanci = await Toptanci.findByPk(req.params.id);
      if (!toptanci) {
        return res.status(404).json({ message: 'Toptancı bulunamadı' });
      }

      const data = {
        toptanciAdi: req.body.toptanciAdi,
        aciklama: req.body.aciklama
      };

      await toptanci.update(data);
      res.json(toptanci);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Toptancı sil
  async delete(req, res) {
    try {
      const toptanci = await Toptanci.findByPk(req.params.id);
      if (!toptanci) {
        return res.status(404).json({ message: 'Toptancı bulunamadı' });
      }
      await toptanci.destroy();
      res.json({ message: 'Toptancı silindi' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Alışveriş ekle
  async alisverisEkle(req, res) {
    try {
      const toptanci = await Toptanci.findByPk(req.params.id);
      if (!toptanci) {
        return res.status(404).json({ message: 'Toptancı bulunamadı' });
      }

      const { alinanMallar, tutar } = req.body;
      if (!alinanMallar || !tutar || tutar <= 0) {
        return res.status(400).json({ message: 'Geçerli mal bilgileri ve tutar giriniz' });
      }

      const yeniToplamBorc = yuvarla(Number(toptanci.toplamBorc) + Number(tutar));

      // Alışveriş kaydı oluştur
      const alisveris = await ToptanciAlisveris.create({
        toptanciId: toptanci.id,
        alinanMallar,
        tutar: yuvarla(tutar)
      });

      // Toplam borcu güncelle
      await toptanci.update({
        toplamBorc: yeniToplamBorc
      });

      res.json({
        toptanciAdi: toptanci.toptanciAdi,
        alisveris: {
          alinanMallar,
          tutar: yuvarla(tutar)
        },
        guncelBorc: yeniToplamBorc
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Alışveriş geçmişi
  async alisverisGecmisi(req, res) {
    try {
      const toptanci = await Toptanci.findByPk(req.params.id);
      if (!toptanci) {
        return res.status(404).json({ message: 'Toptancı bulunamadı' });
      }

      const alisverisler = await ToptanciAlisveris.findAll({
        where: { toptanciId: toptanci.id },
        order: [['createdAt', 'DESC']]
      });

      res.json({
        toptanciAdi: toptanci.toptanciAdi,
        toplamBorc: toptanci.toplamBorc,
        alisverisler: alisverisler
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Borç öde
  async borcOde(req, res) {
    try {
      const toptanci = await Toptanci.findByPk(req.params.id);
      if (!toptanci) {
        return res.status(404).json({ message: 'Toptancı bulunamadı' });
      }

      const { odenenTutar } = req.body;
      if (!odenenTutar || odenenTutar <= 0) {
        return res.status(400).json({ message: 'Geçerli bir ödeme tutarı giriniz' });
      }

      if (odenenTutar > toptanci.toplamBorc) {
        return res.status(400).json({ 
          message: 'Ödeme tutarı toplam borçtan fazla olamaz',
          toplamBorc: toptanci.toplamBorc,
          odenenTutar
        });
      }

      const kalanBorc = yuvarla(Number(toptanci.toplamBorc) - Number(odenenTutar));
      
      await toptanci.update({
        toplamBorc: kalanBorc
      });

      res.json({
        toptanciAdi: toptanci.toptanciAdi,
        odenenTutar: yuvarla(odenenTutar),
        kalanBorc: kalanBorc
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = toptanciController; 