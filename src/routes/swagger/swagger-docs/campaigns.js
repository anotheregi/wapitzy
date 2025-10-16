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
 *                 example: "Campaign Name"
 *                 description: "Nama kampanye"
 *               sender:
 *                 type: string
 *                 example: "6285123456789"
 *                 description: "Nomor pengirim"
 *               message:
 *                 type: string
 *                 example: "halo dik"
 *                 description: "Pesan yang akan dikirim"
 *               receivers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["6285123456789", "6285987654321"]
 *                 description: "Daftar nomor penerima"
 *     responses:
 *       201:
 *         description: Kampanye berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Campaign created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "camp_1640995200000_abc123def"
 *                     name:
 *                       type: string
 *                       example: "Campaign Name"
 *                     sender:
 *                       type: string
 *                       example: "6285123456789"
 *                     message:
 *                       type: string
 *                       example: "hai dik"
 *                     receivers:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["6285123456789", "6285987654321"]
 *                     status:
 *                       type: string
 *                       example: "draft"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T00:00:00.000Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T00:00:00.000Z"
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Mendapatkan semua kampanye
 *     tags: [Campaigns]
 *     responses:
 *       200:
 *         description: Kampanye berhasil didapatkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Campaigns retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     campaigns:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "camp_1640995200000_abc123def"
 *                           name:
 *                             type: string
 *                             example: "Campaign Name"
 *                           sender:
 *                             type: string
 *                             example: "6285123456789"
 *                           message:
 *                             type: string
 *                             example: "halo dek"
 *                           total_receivers:
 *                             type: integer
 *                             example: 2
 *                           status:
 *                             type: string
 *                             example: "draft"
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-01-01T00:00:00.000Z"
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-01-01T00:00:00.000Z"
 *                     total:
 *                       type: integer
 *                       example: 3
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /campaigns/{campaignId}:
 *   get:
 *     summary: Mendapatkan detail kampanye berdasarkan ID
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *         example: "camp_1640995200000_abc123def"
 *         description: "ID kampanye"
 *     responses:
 *       200:
 *         description: Detail kampanye berhasil didapatkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Campaign retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "camp_1640995200000_abc123def"
 *                     name:
 *                       type: string
 *                       example: "Campaign Name"
 *                     sender:
 *                       type: string
 *                       example: "6285123456789"
 *                     message:
 *                       type: string
 *                       example: "halodek"
 *                     receivers:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["6285123456789", "6285987654321"]
 *                     status:
 *                       type: string
 *                       example: "draft"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T00:00:00.000Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T00:00:00.000Z"
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Mengupdate kampanye
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *         example: "camp_1640995200000_abc123def"
 *         description: "ID kampanye"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 example: "Updated Campaign Name"
 *                 type: string
 *                 description: "Nama baru kampanye (opsional)"
 *               sender:
 *                 type: string
 *                 example: "6285123456789"
 *                 description: "Nomor pengirim baru (opsional)"
 *               message:
 *                 type: string
 *                 example: "Updated message"
 *                 description: "Pesan baru (opsional)"
 *               receivers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["6285123456789", "6285987654321", "6285111111111"]
 *                 description: "Daftar nomor penerima baru (opsional)"
 *     responses:
 *       200:
 *         description: Kampanye berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Campaign updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "camp_1640995200000_abc123def"
 *                     name:
 *                       type: string
 *                       example: "Updated Campaign Name"
 *                     sender:
 *                       type: string
 *                       example: "6285123456789"
 *                     message:
 *                       type: string
 *                       example: "Updated message"
 *                     receivers:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["6285123456789", "6285987654321", "6285111111111"]
 *                     status:
 *                       type: string
 *                       example: "draft"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T01:00:00.000Z"
 *       404:
 *         description: Campaign not found
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Menghapus kampanye
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *         example: "camp_1640995200000_abc123def"
 *         description: "ID kampanye"
 *     responses:
 *       200:
 *         description: Kampanye berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Campaign deleted successfully"
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /campaigns/{campaignId}/send:
 *   post:
 *     summary: Mengirim kampanye
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *         example: "camp_1640995200000_abc123def"
 *         description: "ID kampanye"
 *     responses:
 *       200:
 *         description: Kampanye berhasil dikirim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Campaign sent successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     campaign_id:
 *                       type: string
 *                       example: "camp_1640995200000_abc123def"
 *                     status:
 *                       type: string
 *                       example: "sent"
 *                     sent_count:
 *                       type: integer
 *                       example: 2
 *                     failed_count:
 *                       type: integer
 *                       example: 0
 *                     sent_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T02:00:00.000Z"
 *       404:
 *         description: Campaign not found
 *       400:
 *         description: Campaign already sent or invalid status
 *       500:
 *         description: Internal server error
 */
