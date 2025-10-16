/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: API Endpoint untuk manajemen daftar kontak
 */

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Membuat daftar kontak baru
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Customer VIP"
 *                 description: "Nama daftar kontak"
 *               description:
 *                 type: string
 *                 example: "Daftar pelanggan VIP untuk promosi"
 *                 description: "Deskripsi daftar kontak (opsional)"
 *               contacts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Egi ganteng"
 *                       description: "Nama kontak (opsional)"
 *                     phone:
 *                       type: string
 *                       example: "6285123456789"
 *                       description: "Nomor telepon dengan kode negara"
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["VIP", "Jakarta"]
 *                       description: "Tag untuk mengkategorikan kontak (opsional)"
 *                 example: [
 *                   {"name": "Egi ganteng", "phone": "6285123456789", "tags": ["VIP"]},
 *                   {"name": "ASEP KNALPOT", "phone": "6285987654321", "tags": ["Regular"]}
 *                 ]
 *                 description: "Array kontak yang akan ditambahkan"
 *     responses:
 *       201:
 *         description: Daftar kontak berhasil dibuat
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
 *                   example: "Contact list created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "list_1640995200000_abc123def"
 *                     name:
 *                       type: string
 *                       example: "Customer VIP"
 *                     description:
 *                       type: string
 *                       example: "Daftar pelanggan VIP untuk promosi"
 *                     contacts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Egi ganteng"
 *                           phone:
 *                             type: string
 *                             example: "6285123456789"
 *                           tags:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["VIP"]
 *                     total_contacts:
 *                       type: integer
 *                       example: 2
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
 *     summary: Mendapatkan semua daftar kontak
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: Daftar kontak berhasil didapatkan
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
 *                   example: "Contact lists retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     lists:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "list_1640995200000_abc123def"
 *                           name:
 *                             type: string
 *                             example: "Customer VIP"
 *                           description:
 *                             type: string
 *                             example: "Daftar pelanggan VIP untuk promosi"
 *                           total_contacts:
 *                             type: integer
 *                             example: 2
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
 * /contacts/{listId}:
 *   get:
 *     summary: Mendapatkan detail daftar kontak berdasarkan ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         example: "list_1640995200000_abc123def"
 *         description: "ID daftar kontak"
 *     responses:
 *       200:
 *         description: Detail daftar kontak berhasil didapatkan
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
 *                   example: "Contact list retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "list_1640995200000_abc123def"
 *                     name:
 *                       type: string
 *                       example: "Customer VIP"
 *                     description:
 *                       type: string
 *                       example: "Daftar pelanggan VIP untuk promosi"
 *                     contacts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Egi ganteng"
 *                           phone:
 *                             type: string
 *                             example: "6285123456789"
 *                           tags:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["VIP"]
 *                     total_contacts:
 *                       type: integer
 *                       example: 2
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T00:00:00.000Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T00:00:00.000Z"
 *       404:
 *         description: Contact list not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Mengupdate daftar kontak
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         example: "list_1640995200000_abc123def"
 *         description: "ID daftar kontak"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Customer VIP Updated"
 *                 description: "Nama baru daftar kontak (opsional)"
 *               description:
 *                 type: string
 *                 example: "Daftar pelanggan VIP terbaru"
 *                 description: "Deskripsi baru (opsional)"
 *               contacts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Egi ganteng Updated"
 *                     phone:
 *                       type: string
 *                       example: "6285123456789"
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["VIP", "Updated"]
 *                 description: "Array kontak baru (opsional)"
 *     responses:
 *       200:
 *         description: Daftar kontak berhasil diupdate
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
 *                   example: "Contact list updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "list_1640995200000_abc123def"
 *                     name:
 *                       type: string
 *                       example: "Customer VIP Updated"
 *                     description:
 *                       type: string
 *                       example: "Daftar pelanggan VIP terbaru"
 *                     contacts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Egi ganteng Updated"
 *                           phone:
 *                             type: string
 *                             example: "6285123456789"
 *                           tags:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["VIP", "Updated"]
 *                     total_contacts:
 *                       type: integer
 *                       example: 2
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T01:00:00.000Z"
 *       404:
 *         description: Contact list not found
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Menghapus daftar kontak
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         example: "list_1640995200000_abc123def"
 *         description: "ID daftar kontak"
 *     responses:
 *       200:
 *         description: Daftar kontak berhasil dihapus
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
 *                   example: "Contact list deleted successfully"
 *       404:
 *         description: Contact list not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /contacts/import/csv:
 *   post:
 *     summary: Mengimport kontak dari file CSV
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - listName
 *               - csvUrl
 *             properties:
 *               listName:
 *                 type: string
 *                 example: "Import CSV Contacts"
 *                 description: "Nama daftar kontak baru"
 *               description:
 *                 type: string
 *                 example: "Kontak diimport dari file CSV"
 *                 description: "Deskripsi daftar kontak (opsional)"
 *               csvUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://moreegih.gg/contacts.csv"
 *                 description: "URL publik file CSV yang berisi kontak"
 *     responses:
 *       201:
 *         description: Kontak berhasil diimport dari CSV
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
 *                   example: "Contacts imported successfully from CSV"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "list_1640995200000_xyz789abc"
 *                     name:
 *                       type: string
 *                       example: "Import CSV Contacts"
 *                     description:
 *                       type: string
 *                       example: "Kontak diimport dari file CSV"
 *                     contacts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Egi ganteng"
 *                           phone:
 *                             type: string
 *                             example: "6285123456789"
 *                           tags:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["Imported"]
 *                     total_contacts:
 *                       type: integer
 *                       example: 100
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T00:00:00.000Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T00:00:00.000Z"
 *       400:
 *         description: Invalid CSV URL or format
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /contacts/{listId}/phones:
 *   get:
 *     summary: Mendapatkan daftar nomor telepon dari kontak list
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         example: "list_1640995200000_abc123def"
 *         description: "ID daftar kontak"
 *     responses:
 *       200:
 *         description: Daftar nomor telepon berhasil didapatkan
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
 *                   example: "Contact phones retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     list_id:
 *                       type: string
 *                       example: "list_1640995200000_abc123def"
 *                     list_name:
 *                       type: string
 *                       example: "Customer VIP"
 *                     phones:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["6285123456789", "6285987654321"]
 *                     total:
 *                       type: integer
 *                       example: 2
 *       404:
 *         description: Contact list not found
 *       500:
 *         description: Internal server error
 */
