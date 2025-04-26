const express = require('express');
const router = express.Router();
const odemeTakvimiController = require('../controllers/odeme-takvimi.controller');

// Tüm ödemeleri listele
router.get('/', odemeTakvimiController.findAll);

// Yeni ödeme ekle
router.post('/', odemeTakvimiController.create);

// Ödeme güncelle
router.put('/:id', odemeTakvimiController.update);

// Ödeme sil
router.delete('/:id', odemeTakvimiController.delete);

module.exports = router; 