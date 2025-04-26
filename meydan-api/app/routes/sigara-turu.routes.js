const express = require('express');
const router = express.Router();
const sigaraTuruController = require('../controllers/sigara-turu.controller');

// Tüm sigara türlerini listele
router.get('/', sigaraTuruController.findAll);

// Yeni sigara türü ekle
router.post('/', sigaraTuruController.create);

// Sigara türünü güncelle
router.put('/:id', sigaraTuruController.update);

// Sigara türünü sil
router.delete('/:id', sigaraTuruController.delete);

module.exports = router; 