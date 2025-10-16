/**
 * @swagger
 * tags:
 *   name: Bulk Messaging
 *   description: API Endpoint untuk pengiriman pesan massal (bulk messaging)
 */

/**
 * @swagger
 * /bulk/send:
 *   post:
 *     summary: Mengirim pesan ke banyak penerima sekaligus (Bulk Messaging)
 *     tags: [Bulk Messaging]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sender
 *               - receivers
 *               - message
 *             properties:
 *               sender:
 *                 type: string
 *                 example: "session_id_1"
 *                 description: "ID sesi pengirim"
 *               receivers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["628123456789", "6285987654321", "6285111111111"]
 *                 description: "Array nomor penerima dengan kode negara"
 *               message:
 *                 type: string
 *                 example: "Promosi spesial! Diskon 50% hari ini saja!"
 *                 description: "Isi pesan yang akan dikirim ke semua penerima"
 *               file:
 *                 type: string
 *                 example: "https://moreegih.gg/promo-image.jpg"
 *                 description: "URL publik file media (opsional)"
 *               viewOnce:
 *                 type: boolean
 *                 example: false
 *                 description: "Pesan sekali lihat (opsional, default: false)"
 *               delay:
 *                 type: number
 *                 minimum: 500
 *                 maximum: 5000
 *                 example: 1000
 *                 description: "Delay antar pengiriman dalam milidetik (500-5000ms, default: 1000)"
 *     responses:
 *       200:
 *         description: Bulk messaging berhasil diproses
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
 *                   example: "Bulk message sent successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 3
 *                       description: "Total penerima"
 *                     sent:
 *                       type: integer
 *                       example: 2
 *                       description: "Jumlah pesan berhasil dikirim"
 *                     failed:
 *                       type: integer
 *                       example: 1
 *                       description: "Jumlah pesan gagal dikirim"
 *                     invalid:
 *                       type: integer
 *                       example: 0
 *                       description: "Jumlah nomor tidak valid"
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           receiver:
 *                             type: string
 *                             example: "628123456789@s.whatsapp.net"
 *                           messageId:
 *                             type: string
 *                             example: "ABCD1234"
 *                             nullable: true
 *                           status:
 *                             type: string
 *                             enum: [sent, failed]
 *                             example: "sent"
 *                           error:
 *                             type: string
 *                             example: "Invalid phone number"
 *                             nullable: true
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "receivers array cannot be empty"
 *       404:
 *         description: Session not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Session not found"
 *       429:
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Too many bulk messages sent. Please try again later."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to send bulk message"
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
