# Deploy WhatsApp Gateway ke Railway (Gratis)

Proyek ini adalah WhatsApp gateway menggunakan Node.js (backend) dan CodeIgniter (frontend PHP).

## Persiapan Deploy

1. **Buat Akun Railway**: Daftar di [railway.app](https://railway.app) (gratis).

2. **Setup Database MySQL**:
   - Di Railway, buat project baru.
   - Tambahkan database MySQL (gratis tier).
   - Catat credentials: `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT`.

3. **Clone atau Upload Kode**:
   - Push kode ke GitHub.
   - Connect GitHub repo ke Railway project.

4. **Environment Variables**:
   - Di Railway dashboard, set variables:
     - `HOST=0.0.0.0`
     - `PORT=3000`
     - `DB_HOSTNAME=<MYSQLHOST>`
     - `DB_USERNAME=<MYSQLUSER>`
     - `DB_PASSWORD=<MYSQLPASSWORD>`
     - `DB_DATABASE=<MYSQLDATABASE>`
     - `BASE_WEB=<URL Railway app Anda>`

5. **Deploy**:
   - Railway akan auto-build dan deploy.
   - Akses app di URL yang diberikan Railway.

## Catatan
- Railway gratis: 512MB RAM, 1GB disk, sleep setelah idle.
- Untuk persistent storage (session files), gunakan Railway volumes jika perlu.
- Jika ada error, cek logs di Railway dashboard.

## Troubleshooting
- Jika build gagal, pastikan `composer.json` dan `package.json` benar.
- Untuk PHP, Railway menggunakan Nixpacks untuk setup (sudah include Composer via `php82Packages.composer`).
- Jika error "undefined variable 'composer'", pastikan `nixpacks.toml` menggunakan `php82Packages.composer` bukan "composer".
- Jika error PHP version atau package compatibility, pastikan `composer.json` sudah update untuk PHP 8.2 (vlucas/phpdotenv ^5.0).
- Jika error database connection (ENOTFOUND), pastikan DB_HOSTNAME format benar (host:port) dan Railway MySQL sudah aktif.
- Cek logs di Railway dashboard untuk detail error.
