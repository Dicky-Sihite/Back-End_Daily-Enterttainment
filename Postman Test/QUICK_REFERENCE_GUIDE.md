# Backend API - Quick Reference Guide

## 📋 Project Overview

**Application Name:** Content & Bookmark Management API  
**Backend Stack:** Node.js + Express.js + PostgreSQL  
**Port:** 5000  
**Base URL:** `http://localhost:5000/api`

---

## 🚀 Quick Start

### 1. Environment Setup

Make sure your `.env` file contains:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=website_daily-entertaiment
DB_PASSWORD=D1cky5123
DB_PORT=5432

JWT_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
PORT=5000
NODE_ENV=development
```

### 2. Install & Run Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Server will run on http://localhost:5000
```

### 3. Import Postman Collection

1. Open Postman
2. Click **Import**
3. Select `Postman_Collection.json`
4. Collection ready to use!

---

## 📚 API Endpoints Summary

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Create new user | ❌ |
| POST | `/login` | Login & get token | ❌ |
| POST | `/refresh` | Refresh access token | ❌ |
| POST | `/logout` | Logout user | ✅ |

### Content
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/contents` | Create content | ✅ |
| GET | `/contents` | Get all contents | ❌ |
| GET | `/contents/:id` | Get content by ID | ❌ |

### Bookmarks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/bookmarks` | Add bookmark | ✅ |
| GET | `/bookmarks` | Get user bookmarks | ✅ |
| DELETE | `/bookmarks/:contentId` | Remove bookmark | ✅ |

### History
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/histories` | Track view history | ✅ |
| GET | `/histories` | Get user history | ✅ |

### Profile
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/profile` | Create/update profile | ✅ |
| GET | `/profile` | Get user profile | ✅ |
| DELETE | `/profile` | Delete profile | ✅ |

### Role-Based
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin` | Admin only access | ✅ |
| GET | `/user` | User/Admin access | ✅ |

---

## 🔑 Authentication Flow

```
1. User Registration
   POST /register
   → Get user ID

2. User Login
   POST /login
   → Get access_token (in response)
   → Get refresh_token (in httpOnly cookie)

3. Make Authenticated Requests
   Header: Authorization: Bearer {access_token}

4. Refresh Token (when expired)
   POST /refresh
   → Get new access_token

5. Logout
   POST /logout
   → Invalidate tokens
```

---

## 📝 cURL Command Examples

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

### 3. Create Content (Authenticated)
```bash
curl -X POST http://localhost:5000/api/contents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "My Article",
    "description": "Article description",
    "category_id": 1,
    "url": "https://example.com/article",
    "thumbnail": "https://example.com/thumb.jpg"
  }'
```

### 4. Get All Contents
```bash
curl -X GET http://localhost:5000/api/contents
```

### 5. Get Content By ID
```bash
curl -X GET http://localhost:5000/api/contents/1
```

### 6. Add Bookmark (Authenticated)
```bash
curl -X POST http://localhost:5000/api/bookmarks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "content_id": 1
  }'
```

### 7. Get User Bookmarks
```bash
curl -X GET http://localhost:5000/api/bookmarks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 8. Remove Bookmark
```bash
curl -X DELETE http://localhost:5000/api/bookmarks/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 9. Track History
```bash
curl -X POST http://localhost:5000/api/histories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "content_id": 1
  }'
```

### 10. Get User History
```bash
curl -X GET http://localhost:5000/api/histories \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 11. Create/Update Profile
```bash
curl -X POST http://localhost:5000/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "bio": "My bio",
    "profile_picture": "https://example.com/pic.jpg",
    "phone": "+1234567890",
    "location": "San Francisco",
    "website": "https://example.com"
  }'
```

### 12. Get Profile
```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 13. Logout
```bash
curl -X POST http://localhost:5000/api/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🧪 Testing Strategies

### Manual Testing (using Postman)
1. Import the collection
2. Run requests in order
3. Check test results (green ✓ = pass, red ✗ = fail)
4. Review response data

### CLI Testing (using curl)
```bash
# Extract token from login response
TOKEN=$(curl -s -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"

# Use token in subsequent requests
curl -X GET http://localhost:5000/api/bookmarks \
  -H "Authorization: Bearer $TOKEN"
```

### Automated Testing (Postman Runner)
1. Open Postman
2. Select the collection
3. Click **Run**
4. Configure iterations and delays
5. Execute full suite
6. Review report

---

## ✅ Expected Test Results

When running the full collection, you should see:

```
Total Tests: 40+
✅ Authentication tests: 8
✅ Content management tests: 6
✅ Bookmark operations: 6
✅ History tracking: 4
✅ Profile management: 6
✅ Role-based access: 4
✅ Error scenarios: 6
```

---

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Check if port 5000 is in use
netstat -tuln | grep 5000

# Kill process using port 5000
lsof -ti:5000 | xargs kill -9
```

### Database Connection Error
- Verify PostgreSQL is running
- Check `.env` file credentials
- Test connection: `psql -U postgres -h localhost`

### Authentication Errors
- Ensure JWT_SECRET is set in `.env`
- Check token expiration time
- Use refresh endpoint to get new token

### CORS Issues
- Update CORS configuration in `src/app.js` if needed
- Ensure credentials are properly sent

---

## 📊 Request/Response Examples

### Success Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": 1,
    "name": "Example"
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

---

## 🔒 Security Notes

1. **Never commit `.env` file** - Contains sensitive credentials
2. **Use HTTPS in production** - Current setup uses HTTP for development
3. **Refresh tokens are httpOnly** - Not accessible from JavaScript
4. **Access tokens expire** - Use refresh endpoint to renew
5. **Passwords are hashed** - Using bcrypt

---

## 📁 Project Structure

```
BackEnd/
├── server.js                 # Entry point
├── .env                      # Environment variables
├── package.json              # Dependencies
├── Postman_Collection.json   # Postman tests
├── POSTMAN_TESTING_GUIDE.md # Detailed guide
├── API_TESTING_GUIDE.md      # This file
└── src/
    ├── app.js                # Express app setup
    ├── config/
    │   └── db.js            # Database connection
    ├── controllers/          # Business logic
    ├── models/               # Database queries
    ├── routes/               # API endpoints
    ├── middleware/           # Auth, roles
    ├── services/             # Auth service
    └── utils/                # Constants, helpers
```

---

## 🎯 Test Checklist

Before deploying to production:

- [ ] All endpoints return correct HTTP status codes
- [ ] Authentication flow works end-to-end
- [ ] Protected endpoints require valid tokens
- [ ] Role-based access control works
- [ ] Error messages are clear and helpful
- [ ] Request validation works (missing fields, invalid data)
- [ ] Database transactions complete successfully
- [ ] No sensitive data in error messages
- [ ] CORS properly configured
- [ ] Rate limiting implemented (if needed)

---

## 📞 Support Resources

- **API Documentation:** See `POSTMAN_TESTING_GUIDE.md`
- **Postman Collection:** Import `Postman_Collection.json`
- **Database:** PostgreSQL 8.20.0
- **Dependencies:** See `package.json`

---

## 📝 Common Scenarios

### Scenario 1: Complete User Journey
```bash
# 1. Register
curl -X POST http://localhost:5000/api/register ...
# 2. Login
curl -X POST http://localhost:5000/api/login ...
# 3. Create Content
curl -X POST http://localhost:5000/api/contents ...
# 4. Bookmark Content
curl -X POST http://localhost:5000/api/bookmarks ...
# 5. Track History
curl -X POST http://localhost:5000/api/histories ...
# 6. View Profile
curl -X GET http://localhost:5000/api/profile ...
```

### Scenario 2: Testing Authorization
```bash
# Try accessing admin endpoint without admin role
# Expected: 403 Forbidden

# Try accessing protected endpoint without token
# Expected: 401 Unauthorized
```

### Scenario 3: Error Handling
```bash
# Register with missing email
# Expected: 400 Bad Request

# Login with wrong password
# Expected: 401 Unauthorized

# Get non-existent content
# Expected: 404 Not Found
```

---

Generated: 2024-01-15  
Version: 1.0.0
