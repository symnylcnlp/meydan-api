const express = require('express');
const router = express.Router();
const siparisController = require('../controllers/siparis.controller');

// Tüm siparişleri listele
router.get('/', siparisController.findAll);

// Yeni sipariş ekle
router.post('/', siparisController.create);

// Sipariş güncelle
router.put('/:id', siparisController.update);

// Sipariş sil
router.delete('/:id', siparisController.delete);

module.exports = router; 