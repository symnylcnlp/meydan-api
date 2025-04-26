const express = require('express');
const router = express.Router();
const toptanciController = require('../controllers/toptanci.controller');

// Temel CRUD rotaları
router.get('/', toptanciController.getAll);
router.get('/:id', toptanciController.getById);
router.post('/', toptanciController.create);
router.put('/:id', toptanciController.update);
router.delete('/:id', toptanciController.delete);

// Özel rotalar
router.post('/:id/alisveris-ekle', toptanciController.alisverisEkle);
router.get('/:id/alisveris-gecmisi', toptanciController.alisverisGecmisi);
router.post('/:id/borc-ode', toptanciController.borcOde);

module.exports = router; 