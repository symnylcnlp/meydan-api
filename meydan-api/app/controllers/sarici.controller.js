const Sarici = require('../models/sarici.model');
const MalzemeGecmisi = require('../models/malzeme-gecmisi.model');

const TUTUN_PER_SIGARA_KOLI = 1.2; // Her koli sigara için 1.2 koli tütün
const MAKARON_PER_SIGARA_KOLI = 1; // Her koli sigara için 1 koli makaron

// Yardımcı fonksiyonlar
const yuvarla = (sayi) => Number(Number(sayi).toFixed(3));

const hesaplaMalzemeDurumu = (gidenTutun, gidenMakaron, gelenSigara) => {
  const gerekliTutun = yuvarla(gelenSigara * TUTUN_PER_SIGARA_KOLI);
  const gerekliMakaron = yuvarla(gelenSigara * MAKARON_PER_SIGARA_KOLI);
  
  return {
    kalanTutun: yuvarla(gidenTutun - gerekliTutun),
    kalanMakaron: yuvarla(gidenMakaron - gerekliMakaron),
    gerekliTutun,
    gerekliMakaron
  };
};

const kontrolMalzemeYeterli = (gidenTutun, gidenMakaron, gelenSigara) => {
  const { kalanTutun, kalanMakaron } = hesaplaMalzemeDurumu(gidenTutun, gidenMakaron, gelenSigara);
  return kalanTutun >= 0 && kalanMakaron >= 0;
};

const sariciController = {
  // Tüm sarıcıları getir
  async getAll(req, res) {
    try {
      const saricilar = await Sarici.findAll();
      res.json(saricilar);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Tek bir sarıcı getir
  async getById(req, res) {
    try {
      const sarici = await Sarici.findByPk(req.params.id);
      if (!sarici) {
        return res.status(404).json({ message: 'Sarıcı bulunamadı' });
      }
      res.json(sarici);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Yeni sarıcı ekle
  async create(req, res) {
    try {
      const data = { ...req.body };
      
      // Giden malzemeleri yuvarla
      data.gidenTutun = yuvarla(data.gidenTutun || 0);
      data.gidenMakaron = yuvarla(data.gidenMakaron || 0);
      data.gelenSigara = 0;
      
      // Kalan malzeme başlangıçta giden malzemeye eşit
      data.kalanTutun = data.gidenTutun;
      data.kalanMakaron = data.gidenMakaron;

      const sarici = await Sarici.create(data);
      res.status(201).json(sarici);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Sarıcı güncelle
  async update(req, res) {
    try {
      const sarici = await Sarici.findByPk(req.params.id);
      if (!sarici) {
        return res.status(404).json({ message: 'Sarıcı bulunamadı' });
      }

      const data = { ...req.body };
      
      // Eğer giden malzeme miktarları değiştiyse, kalanları güncelle
      if (data.gidenTutun !== undefined) {
        data.gidenTutun = yuvarla(data.gidenTutun);
        const malzemeDurumu = hesaplaMalzemeDurumu(data.gidenTutun, sarici.gidenMakaron, sarici.gelenSigara);
        if (malzemeDurumu.kalanTutun < 0) {
          return res.status(400).json({ message: 'Bu değişiklik mevcut sarılan sigaralar için yetersiz tütün oluşturur' });
        }
        data.kalanTutun = malzemeDurumu.kalanTutun;
      }
      
      if (data.gidenMakaron !== undefined) {
        data.gidenMakaron = yuvarla(data.gidenMakaron);
        const malzemeDurumu = hesaplaMalzemeDurumu(sarici.gidenTutun, data.gidenMakaron, sarici.gelenSigara);
        if (malzemeDurumu.kalanMakaron < 0) {
          return res.status(400).json({ message: 'Bu değişiklik mevcut sarılan sigaralar için yetersiz makaron oluşturur' });
        }
        data.kalanMakaron = malzemeDurumu.kalanMakaron;
      }

      // Eğer gelen sigara sayısı değiştiyse, kalan malzemeleri güncelle
      if (data.gelenSigara !== undefined) {
        data.gelenSigara = yuvarla(data.gelenSigara);
        if (!kontrolMalzemeYeterli(sarici.gidenTutun, sarici.gidenMakaron, data.gelenSigara)) {
          return res.status(400).json({ message: 'Bu miktar sigara için yeterli malzeme yok' });
        }
        const malzemeDurumu = hesaplaMalzemeDurumu(sarici.gidenTutun, sarici.gidenMakaron, data.gelenSigara);
        data.kalanTutun = malzemeDurumu.kalanTutun;
        data.kalanMakaron = malzemeDurumu.kalanMakaron;
      }

      await sarici.update(data);
      res.json(sarici);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Sarıcı sil
  async delete(req, res) {
    try {
      const sarici = await Sarici.findByPk(req.params.id);
      if (!sarici) {
        return res.status(404).json({ message: 'Sarıcı bulunamadı' });
      }
      await sarici.destroy();
      res.json({ message: 'Sarıcı silindi' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Tütün ekle
  async tutunEkle(req, res) {
    try {
      const sarici = await Sarici.findByPk(req.params.id);
      if (!sarici) {
        return res.status(404).json({ message: 'Sarıcı bulunamadı' });
      }

      const { miktar } = req.body;
      if (!miktar || miktar <= 0) {
        return res.status(400).json({ message: 'Geçerli bir miktar giriniz' });
      }

      const yeniGidenTutun = yuvarla(Number(sarici.gidenTutun) + Number(miktar));
      const malzemeDurumu = hesaplaMalzemeDurumu(yeniGidenTutun, sarici.gidenMakaron, sarici.gelenSigara);

      // Malzeme geçmişine ekle
      await MalzemeGecmisi.create({
        sariciId: sarici.id,
        malzemeTipi: 'TUTUN',
        miktar: miktar,
        aciklama: `${miktar} koli tütün verildi`
      });

      await sarici.update({
        gidenTutun: yeniGidenTutun,
        kalanTutun: malzemeDurumu.kalanTutun
      });

      const guncelSarici = await sarici.reload();
      
      res.json({
        ...guncelSarici.toJSON(),
        eklenenTutun: miktar,
        guncelKalan: malzemeDurumu.kalanTutun
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Makaron ekle
  async makaronEkle(req, res) {
    try {
      const sarici = await Sarici.findByPk(req.params.id);
      if (!sarici) {
        return res.status(404).json({ message: 'Sarıcı bulunamadı' });
      }

      const { miktar } = req.body;
      if (!miktar || miktar <= 0) {
        return res.status(400).json({ message: 'Geçerli bir miktar giriniz' });
      }

      const yeniGidenMakaron = yuvarla(Number(sarici.gidenMakaron) + Number(miktar));
      const malzemeDurumu = hesaplaMalzemeDurumu(sarici.gidenTutun, yeniGidenMakaron, sarici.gelenSigara);

      // Malzeme geçmişine ekle
      await MalzemeGecmisi.create({
        sariciId: sarici.id,
        malzemeTipi: 'MAKARON',
        miktar: miktar,
        aciklama: `${miktar} koli makaron verildi`
      });

      await sarici.update({
        gidenMakaron: yeniGidenMakaron,
        kalanMakaron: malzemeDurumu.kalanMakaron
      });

      const guncelSarici = await sarici.reload();
      
      res.json({
        ...guncelSarici.toJSON(),
        eklenenMakaron: miktar,
        guncelKalan: malzemeDurumu.kalanMakaron
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Sigara ekle
  async sigaraEkle(req, res) {
    try {
      const sarici = await Sarici.findByPk(req.params.id);
      if (!sarici) {
        return res.status(404).json({ message: 'Sarıcı bulunamadı' });
      }

      const { miktar } = req.body;
      if (!miktar || miktar <= 0) {
        return res.status(400).json({ message: 'Geçerli bir miktar giriniz' });
      }

      const yeniGelenSigara = yuvarla(sarici.gelenSigara + miktar);
      const malzemeDurumu = hesaplaMalzemeDurumu(sarici.gidenTutun, sarici.gidenMakaron, yeniGelenSigara);

      // Malzeme kontrolü
      if (malzemeDurumu.kalanTutun < 0) {
        return res.status(400).json({ 
          message: 'Yeterli tütün yok',
          gerekli: malzemeDurumu.gerekliTutun,
          mevcut: sarici.gidenTutun,
          eksik: yuvarla(malzemeDurumu.gerekliTutun - sarici.gidenTutun)
        });
      }
      if (malzemeDurumu.kalanMakaron < 0) {
        return res.status(400).json({ 
          message: 'Yeterli makaron yok',
          gerekli: malzemeDurumu.gerekliMakaron,
          mevcut: sarici.gidenMakaron,
          eksik: yuvarla(malzemeDurumu.gerekliMakaron - sarici.gidenMakaron)
        });
      }

      await sarici.update({
        gelenSigara: yeniGelenSigara,
        kalanTutun: malzemeDurumu.kalanTutun,
        kalanMakaron: malzemeDurumu.kalanMakaron
      });

      res.json({
        ...sarici.toJSON(),
        eklenenSigara: miktar,
        guncelDurum: {
          kalanTutun: malzemeDurumu.kalanTutun,
          kalanMakaron: malzemeDurumu.kalanMakaron,
          sarimBorcu: yuvarla(yeniGelenSigara * sarici.sarimUcreti)
        }
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Borç hesapla
  async hesaplaBorc(req, res) {
    try {
      const sarici = await Sarici.findByPk(req.params.id);
      if (!sarici) {
        return res.status(404).json({ message: 'Sarıcı bulunamadı' });
      }

      const malzemeDurumu = hesaplaMalzemeDurumu(sarici.gidenTutun, sarici.gidenMakaron, sarici.gelenSigara);
      const sarimBorcu = yuvarla(sarici.gelenSigara * sarici.sarimUcreti);

      const hesaplama = {
        sariciAdi: sarici.sariciAdi,
        gelenSigara: sarici.gelenSigara,
        birimSarimUcreti: sarici.sarimUcreti,
        toplamSarimBorcu: sarimBorcu,
        malzemeDurumu: {
          gidenTutun: sarici.gidenTutun,
          gidenMakaron: sarici.gidenMakaron,
          kalanTutun: malzemeDurumu.kalanTutun,
          kalanMakaron: malzemeDurumu.kalanMakaron
        }
      };

      res.json(hesaplama);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Borç öde
  async borcOde(req, res) {
    try {
      const sarici = await Sarici.findByPk(req.params.id);
      if (!sarici) {
        return res.status(404).json({ message: 'Sarıcı bulunamadı' });
      }

      const { odenenTutar } = req.body;
      if (!odenenTutar || odenenTutar <= 0) {
        return res.status(400).json({ message: 'Geçerli bir ödeme tutarı giriniz' });
      }

      const guncelBorc = yuvarla(sarici.gelenSigara * sarici.sarimUcreti);
      
      if (odenenTutar > guncelBorc) {
        return res.status(400).json({ 
          message: 'Ödeme tutarı toplam borçtan fazla olamaz',
          guncelBorc: guncelBorc,
          odenenTutar
        });
      }

      // Ödenen tutara göre kaç koli sigaranın ödendiğini hesapla
      const odenenKoli = yuvarla(odenenTutar / sarici.sarimUcreti);
      const yeniGelenSigara = yuvarla(sarici.gelenSigara - odenenKoli);
      
      await sarici.update({
        gelenSigara: yeniGelenSigara
      });

      const kalanBorc = yuvarla(yeniGelenSigara * sarici.sarimUcreti);

      res.json({
        sariciAdi: sarici.sariciAdi,
        odenenTutar: yuvarla(odenenTutar),
        odenenKoli: odenenKoli,
        kalanBorc: kalanBorc
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Hazır koli al
  async hazirKoliAl(req, res) {
    try {
      const sarici = await Sarici.findByPk(req.params.id);
      if (!sarici) {
        return res.status(404).json({ message: 'Sarıcı bulunamadı' });
      }

      const { miktar } = req.body;
      if (!miktar || miktar <= 0) {
        return res.status(400).json({ message: 'Geçerli bir miktar giriniz' });
      }

      const hazirKoliBorcu = yuvarla(sarici.hazirKoliUcreti * miktar);

      const hesaplama = {
        sariciAdi: sarici.sariciAdi,
        alinanHazirKoli: miktar,
        birimHazirKoliUcreti: sarici.hazirKoliUcreti,
        hazirKoliBorcu: hazirKoliBorcu
      };

      res.json(hesaplama);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Malzeme geçmişini getir
  async getMalzemeGecmisi(req, res) {
    try {
      const sarici = await Sarici.findByPk(req.params.id);
      if (!sarici) {
        return res.status(404).json({ message: 'Sarıcı bulunamadı' });
      }

      const gecmis = await MalzemeGecmisi.findAll({
        where: { sariciId: sarici.id },
        order: [['createdAt', 'DESC']]
      });

      res.json({
        sariciAdi: sarici.sariciAdi,
        malzemeGecmisi: gecmis.map(kayit => ({
          malzemeTipi: kayit.malzemeTipi,
          miktar: kayit.miktar,
          aciklama: kayit.aciklama,
          tarih: kayit.createdAt
        }))
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = sariciController; 