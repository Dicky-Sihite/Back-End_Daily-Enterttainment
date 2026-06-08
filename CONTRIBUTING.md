# 🤝 Contributing Guide

Terima kasih telah tertarik berkontribusi! Panduan ini membantu Anda untuk berkontribusi dengan efektif.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

---

## 📜 Code of Conduct

Kami berkomitmen untuk menjaga komunitas yang welcoming dan inclusive.
Silakan baca [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) untuk detail.

---

## 🚀 Getting Started

### 1. Fork Repository
```bash
# Klik tombol "Fork" di GitHub
```

### 2. Clone Fork Anda
```bash
git clone https://github.com/your-username/repo-name.git
cd repo-name
```

### 3. Setup Development Environment
```bash
# Install dependencies
npm install

# Setup database & environment
# Ikuti panduan di INSTALL.md
```

### 4. Create Feature Branch
```bash
git checkout -b fitur/nama-fitur-anda
# atau untuk bug fix:
git checkout -b bugfix/nama-bug-anda
```

---

## 💻 Development Workflow

### Branch Naming Convention
```
fitur/deskripsi-fitur          # Untuk fitur baru
bugfix/deskripsi-bug           # Untuk perbaikan bug
docs/deskripsi-dokumentasi     # Untuk dokumentasi
test/deskripsi-test            # Untuk testing
refactor/deskripsi-refactor    # Untuk refactoring
```

### Development Environment
```bash
# Start development server
npm run dev

# Check for errors
npm run lint  # (jika tersedia)

# Run tests
npm test      # (jika tersedia)
```

---

## 📝 Commit Guidelines

### Format Commit Message
```
[TYPE] Brief description

Detailed explanation if needed.
- Point 1
- Point 2

Closes #123  (jika ada issue related)
```

### Commit Types
- `feat`: Fitur baru
- `fix`: Perbaikan bug
- `docs`: Perubahan dokumentasi
- `style`: Formatting, missing semicolons, dll
- `refactor`: Refactoring code tanpa mengubah fungsionalitas
- `test`: Tambah atau update tests
- `chore`: Update dependencies, config files, dll

### Commit Examples
```bash
# Fitur baru
git commit -m "feat: tambah user authentication endpoint"

# Bug fix
git commit -m "fix: perbaiki password validation error"

# Dokumentasi
git commit -m "docs: update API documentation"

# Refactor
git commit -m "refactor: ubah authService ke model-based"
```

### Tips Commit
- Commit sering dengan perubahan yang fokus
- Jangan campurkan berbagai perubahan dalam satu commit
- Tulis deskripsi yang clear dan informatif
- Reference issues jika ada: `Closes #123`

---

## 🔄 Pull Request Process

### Sebelum Submit PR

1. **Update dengan main branch terbaru**
```bash
git fetch upstream
git rebase upstream/main
```

2. **Test semua perubahan**
```bash
npm run dev    # Test server
npm test       # Test otomatis (jika ada)
```

3. **Review kode sendiri sebelum push**

### Submit Pull Request

1. **Push ke fork Anda**
```bash
git push origin fitur/nama-fitur-anda
```

2. **Buat Pull Request di GitHub**
   - Judul yang clear dan deskriptif
   - Jelaskan perubahan yang dilakukan
   - Reference issues: `Closes #123`
   - Explain why changes were needed
   - Include screenshots/logs jika relevant

### PR Template
```
## Description
Jelaskan perubahan yang dilakukan

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Jelaskan testing yang sudah dilakukan

## Checklist
- [ ] Kode mengikuti style guide
- [ ] Sudah test secara manual
- [ ] Dokumentasi sudah diupdate
- [ ] Tidak ada console.log atau debug code
- [ ] Semua tests passed

## Screenshots/Logs (jika applicable)
```

### PR Review Process

- Maintainers akan review kode Anda
- Mungkin ada requested changes
- Diskusikan setiap feedback dengan detail
- Update PR sesuai feedback
- Merge ketika approved ✅

---

## 📐 Coding Standards

### JavaScript/Node.js Style Guide

#### Naming Convention
```javascript
// Constants
const MAX_CONNECTIONS = 10;
const API_TIMEOUT = 5000;

// Functions & variables
const getUserById = async (userId) => { };
let userCount = 0;

// Classes
class UserModel {
  constructor() { }
}
```

#### File Structure
```javascript
// 1. Imports di atas
const express = require('express');
const userModel = require('../models/userModel');

// 2. Constants
const MAX_RETRY = 3;

// 3. Helper functions
function validate(data) { }

// 4. Main functions
async function handler(req, res) { }

// 5. Exports di bawah
module.exports = { };
```

#### Error Handling
```javascript
// ✅ GOOD - Consistent error handling
try {
  const user = await userModel.findById(userId);
  if (!user) {
    throw { status: 404, message: 'User tidak ditemukan' };
  }
  return user;
} catch (error) {
  console.error('Error:', error);
  throw error;
}

// ❌ AVOID - Inconsistent error handling
try {
  // ...
} catch (err) {
  res.send(err);  // No status code
}
```

#### Comments & Documentation
```javascript
// ❌ AVOID - Useless comments
const a = 1;  // Set a to 1

// ✅ GOOD - Meaningful comments
// Limit API calls untuk prevent rate limiting
const API_CALL_DELAY = 1000;

// Function documentation
/**
 * Fetch user data dari database
 * @param {number} userId - User ID
 * @returns {Promise<Object>} User object
 * @throws {Error} Jika user tidak ditemukan
 */
async function getUserData(userId) {
  // ...
}
```

#### Code Quality
```javascript
// ❌ AVOID
const result = users.map(u => u.id).filter(id => id > 0);

// ✅ BETTER - More readable
const activeUserIds = users
  .map(user => user.id)
  .filter(id => id > 0);
```

### API Endpoints Standard

```javascript
// Konsisten path format
/api/v1/resource
/api/v1/resource/:id
/api/v1/resource/:id/sub-resource

// Konsisten response format
{
  "status": "success",
  "code": 200,
  "data": { },
  "message": "Operation successful"
}

// Error response
{
  "status": "error",
  "code": 400,
  "message": "Invalid input",
  "errors": [ ]
}
```

### Database Queries
```javascript
// ✅ GOOD - Parameterized queries
const result = await pool.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// ❌ AVOID - SQL Injection vulnerable
const result = await pool.query(
  `SELECT * FROM users WHERE id = ${userId}`
);
```

---

## 🧪 Testing

Jika project punya test suite:

```bash
# Run all tests
npm test

# Run specific test
npm test -- auth.test.js

# Run with coverage
npm test -- --coverage
```

---

## 📚 Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com)
- [JavaScript Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

---

## ❓ Questions?

- Buka GitHub Discussion
- Comment di issue yang relevant
- Tanyakan di PR Anda

---

**Thank you for contributing! 🙌**
