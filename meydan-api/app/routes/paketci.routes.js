const express = require('express');
const router = express.Router();
const paketciController = require('../controllers/paketci.controller');

// Tüm paketçileri listele
router.get('/', paketciController.findAll);

// Yeni paketçi ekle
router.post('/', paketciController.create);

// Paketçiye sigara ver
router.post('/:id/sigara-ekle', paketciController.sigaraEkle);

// Paketçiden paket al
router.post('/:id/paket-ekle', paketciController.paketEkle);

// Borç hesapla
router.get('/:id/hesapla-borc', paketciController.hesaplaBorc);

// Borç öde
router.post('/:id/borc-ode', paketciController.borcOde);

// Malzeme geçmişi
router.get('/:id/malzeme-gecmisi', paketciController.malzemeGecmisi);

module.exports = router; 