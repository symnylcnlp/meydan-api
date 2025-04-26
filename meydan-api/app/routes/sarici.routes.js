const express = require('express');
const router = express.Router();
const sariciController = require('../controllers/sarici.controller');

/**
 * @swagger
 * /api/saricilar:
 *   get:
 *     summary: Tüm sarıcıları listele
 *     tags: [Saricilar]
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.get('/', sariciController.getAll);

/**
 * @swagger
 * /api/saricilar/{id}:
 *   get:
 *     summary: ID'ye göre sarıcı getir
 *     tags: [Saricilar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Başarılı
 *       404:
 *         description: Bulunamadı
 */
router.get('/:id', sariciController.getById);

/**
 * @swagger
 * /api/saricilar:
 *   post:
 *     summary: Yeni sarıcı ekle
 *     tags: [Saricilar]
 *     responses:
 *       201:
 *         description: Başarıyla oluşturuldu
 */
router.post('/', sariciController.create);

/**
 * @swagger
 * /api/saricilar/{id}:
 *   put:
 *     summary: Sarıcı bilgilerini güncelle
 *     tags: [Saricilar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Başarıyla güncellendi
 *       404:
 *         description: Bulunamadı
 */
router.put('/:id', sariciController.update);

/**
 * @swagger
 * /api/saricilar/{id}:
 *   delete:
 *     summary: Sarıcı sil
 *     tags: [Saricilar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Başarıyla silindi
 *       404:
 *         description: Bulunamadı
 */
router.delete('/:id', sariciController.delete);

/**
 * @swagger
 * /api/saricilar/{id}/tutun-ekle:
 *   post:
 *     summary: Sarıcıya tütün ekle
 *     tags: [Saricilar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - miktar
 *             properties:
 *               miktar:
 *                 type: number
 *                 description: Eklenecek tütün miktarı (gram)
 *     responses:
 *       200:
 *         description: Tütün başarıyla eklendi
 *       404:
 *         description: Sarıcı bulunamadı
 */
router.post('/:id/tutun-ekle', sariciController.tutunEkle);

/**
 * @swagger
 * /api/saricilar/{id}/makaron-ekle:
 *   post:
 *     summary: Sarıcıya makaron ekle
 *     tags: [Saricilar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - miktar
 *             properties:
 *               miktar:
 *                 type: integer
 *                 description: Eklenecek makaron sayısı
 *     responses:
 *       200:
 *         description: Makaron başarıyla eklendi
 *       404:
 *         description: Sarıcı bulunamadı
 */
router.post('/:id/makaron-ekle', sariciController.makaronEkle);

/**
 * @swagger
 * /api/saricilar/{id}/sigara-ekle:
 *   post:
 *     summary: Sarıcıya sarılmış sigara ekle
 *     tags: [Saricilar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - miktar
 *             properties:
 *               miktar:
 *                 type: integer
 *                 description: Eklenecek sarılmış sigara sayısı
 *     responses:
 *       200:
 *         description: Sigara başarıyla eklendi
 *       400:
 *         description: Yeterli malzeme yok
 *       404:
 *         description: Sarıcı bulunamadı
 */
router.post('/:id/sigara-ekle', sariciController.sigaraEkle);

/**
 * @swagger
 * /api/saricilar/{id}/hesapla-borc:
 *   get:
 *     summary: Sarıcının sarım borcunu hesapla
 *     tags: [Saricilar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Borç başarıyla hesaplandı
 *       404:
 *         description: Sarıcı bulunamadı
 */
router.get('/:id/hesapla-borc', sariciController.hesaplaBorc);

/**
 * @swagger
 * /api/saricilar/{id}/borc-ode:
 *   post:
 *     summary: Sarıcının borcunu öde
 *     tags: [Saricilar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Borç başarıyla ödendi
 *       404:
 *         description: Sarıcı bulunamadı
 */
router.post('/:id/borc-ode', sariciController.borcOde);

/**
 * @swagger
 * /api/saricilar/{id}/malzeme-gecmisi:
 *   get:
 *     summary: Sarıcının malzeme geçmişini getir
 *     tags: [Saricilar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Malzeme geçmişi başarıyla getirildi
 *       404:
 *         description: Sarıcı bulunamadı
 */
router.get('/:id/malzeme-gecmisi', sariciController.getMalzemeGecmisi);

module.exports = router; 