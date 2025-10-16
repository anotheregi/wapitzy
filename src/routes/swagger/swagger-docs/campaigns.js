/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: API Endpoint untuk manajemen kampanye pesan massal
 */

/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Membuat kampanye baru
 *     tags: [Campaigns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - sender
 *               - message
 *               - receivers
 *             properties:
 *               name:
 *                 type: string
