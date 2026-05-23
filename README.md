# Backend - Daily Entertainment

Backend API untuk aplikasi Daily Entertainment.

## 📋 Prerequisites

Sebelum install, pastikan sudah install:
- **Node.js** v14+ ([download](https://nodejs.org))
- **PostgreSQL** v12+ ([download](https://www.postgresql.org))
- **Git**

## 🚀 Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/[username]/[repo-name].git
cd [folder-name]
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database
```bash
# Masuk ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE daily_entertainment;

# Keluar dari psql
\q
```

### 4. Setup Environment Variables
```bash
# Copy file contoh
cp .env.example .env

# Edit .env dengan data Anda
```

**Isi .env:**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=daily_entertainment
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Server
NODE_ENV=development
PORT=3000
```

### 5. Run Migration (Setup Database Schema)
```bash
# Pastikan database sudah ada
# Jalankan query SQL untuk membuat tables
psql -U postgres -d daily_entertainment -f database/schema.sql
```

### 6. Start Server
```bash
# Development (dengan auto-reload)
npm run dev

# Production
npm start
```

Server akan running di `http://localhost:3000`

## 📁 Struktur Project
```
src/
├── config/          # Database connection
├── controllers/     # Request handlers
├── middleware/      # Auth, Role middleware
├── models/          # Database queries
├── routes/          # API routes
├── services/        # Business logic
└── utils/           # Constants & helpers
server.js           # Entry point
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout user

Lihat [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md) untuk detail lengkap.

## 🛠️ Development

### Scripts
```bash
npm run dev    # Start with nodemon
npm start      # Start server
npm test       # Run tests (coming soon)
```

### Tech Stack
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemon** - Dev auto-reload

## 📝 Environment Variables

Lihat [.env.example](.env.example) untuk lengkap.

## 🤝 Contributing

1. Fork repository
2. Buat branch feature (`git checkout -b fitur/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin fitur/AmazingFeature`)
5. Buat Pull Request

## 📄 License

ISC
