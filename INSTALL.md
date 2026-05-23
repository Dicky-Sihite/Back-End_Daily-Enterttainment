# 🚀 Panduan Instalasi Backend - Daily Entertainment

Panduan lengkap untuk menginstall dan menjalankan backend ini di komputer Anda.

## ✅ Requirement (Prasyarat)

Pastikan Anda sudah install:

| Software | Version | Link Download |
|----------|---------|----------------|
| Node.js | v14 atau lebih tinggi | [nodejs.org](https://nodejs.org) |
| PostgreSQL | v12 atau lebih tinggi | [postgresql.org](https://www.postgresql.org) |
| Git | Latest | [git-scm.com](https://git-scm.com) |

### Verifikasi Installation
```bash
node --version
npm --version
psql --version
git --version
```

---

## 📥 Step 1: Clone Repository

```bash
# Clone dari GitHub
git clone https://github.com/[username]/[repo-name].git

# Masuk ke folder project
cd [folder-name]
```

---

## 📦 Step 2: Install Dependencies

```bash
npm install
```

Dependencies yang akan diinstall:
- `express` - Web framework
- `pg` - PostgreSQL driver
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `dotenv` - Environment variables
- `validator` - Input validation
- `cookie-parser` - Cookie handling

---

## 🗄️ Step 3: Setup Database PostgreSQL

### 3a. Buat Database
```bash
# Masuk ke PostgreSQL
psql -U postgres

# Buat database baru
CREATE DATABASE daily_entertainment;

# Verifikasi (lihat list database)
\l

# Keluar dari PostgreSQL
\q
```

### 3b. Setup Database Schema
```bash
# Jalankan file schema.sql
psql -U postgres -d daily_entertainment -f database/schema.sql

# Atau manual: masuk ke database dan copy-paste isi schema.sql
psql -U postgres -d daily_entertainment
# Paste isi database/schema.sql di sini
# \q untuk keluar
```

**Hasil:** Akan membuat 8 tables (users, roles, content, bookmarks, dll) + insert default roles.

---

## ⚙️ Step 4: Setup Environment Variables

### 4a. Copy .env.example ke .env
```bash
# Windows (Command Prompt)
copy .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

### 4b. Edit .env File
```bash
# Buka .env dengan text editor
# Ganti nilai sesuai konfigurasi Anda
```

**File .env harus berisi:**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=daily_entertainment
DB_USER=postgres
DB_PASSWORD=your_password_postgres  # Ganti dengan password Postgres Anda

# JWT Configuration (Generate string random)
JWT_SECRET=kamu_bisa_generate_string_random_disini
JWT_REFRESH_SECRET=kamu_bisa_generate_string_random_disini

# Server
NODE_ENV=development
PORT=3000
```

### ⚠️ PENTING
- **Jangan commit .env file ke GitHub** (.env sudah di .gitignore)
- Gunakan password yang kuat untuk production
- Generate JWT secret yang random dan panjang

---

## ✨ Step 5: Verifikasi Installation

```bash
# Test connection database
npm install -g pg-cli  # Optional

# Atau buka psql dan test manual
psql -U postgres -d daily_entertainment
SELECT * FROM roles;
\q
```

---

## 🎯 Step 6: Run Server

### Development Mode (dengan auto-reload)
```bash
npm run dev
```

Output yang diharapkan:
```
Database connected successfully
Server running on http://localhost:3000
```

### Production Mode
```bash
npm start
```

---

## 🔍 Testing API

### Test Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Lihat [API_TESTING_GUIDE.md](../API_TESTING_GUIDE.md) untuk endpoint lengkap.

---

## ❌ Troubleshooting

### Error: "Database connection error"
```
Solusi:
- Pastikan PostgreSQL running
- Cek konfigurasi di .env (DB_HOST, DB_USER, DB_PASSWORD)
- Verifikasi database sudah dibuat
```

### Error: "Port 3000 already in use"
```bash
# Linux/Mac: Find process
lsof -i :3000

# Windows: Find process
netstat -ano | findstr :3000

# Kill process atau ganti PORT di .env
```

### Error: "Module not found: express"
```bash
# Re-install dependencies
rm -rf node_modules package-lock.json
npm install
```

### Error: "EACCES: permission denied"
```bash
# Linux/Mac: Gunakan sudo
sudo npm install
```

---

## 📚 Dokumentasi Lebih Lanjut

- [README.md](../README.md) - Overview project
- [API_TESTING_GUIDE.md](../API_TESTING_GUIDE.md) - API endpoints detail

---

## 🤝 Butuh Bantuan?

Jika ada masalah:
1. Baca error message dengan teliti
2. Cek documentation di atas
3. Buka GitHub Issues
4. Tanyakan di Discord/grup development

---

**Happy Coding! 🎉**
