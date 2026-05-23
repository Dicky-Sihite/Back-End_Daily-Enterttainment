# 📱 Backend API Testing Suite

Complete testing documentation and Postman collection for the Content & Bookmark Management API.

---

## 📂 Testing Files Included

### 1. **Postman_Collection.json** 🎯
Complete Postman collection with 50+ test cases covering all API endpoints.

**Features:**
- ✅ 13 endpoints fully documented
- ✅ 50+ automated tests
- ✅ Pre-configured variables and environment setup
- ✅ Error scenario testing
- ✅ Test scripts for validation

**Import Instructions:**
1. Open Postman
2. Click "Import"
3. Select `Postman_Collection.json`
4. Collection automatically configured

---

### 2. **Postman_Environment.json** 🔧
Pre-configured environment variables for easy setup.

**Variables Included:**
- `base_url` - API endpoint
- `access_token` - JWT token storage
- `refresh_token` - Refresh token storage
- `user_id` - Current user ID
- `content_id` - Current content ID
- `test_username` - Auto-generated test username
- `test_email` - Auto-generated test email
- `test_password` - Test password

**How to Use:**
1. Open Postman
2. Click "Import"
3. Select `Postman_Environment.json`
4. Select this environment before running tests

---

### 3. **POSTMAN_TESTING_GUIDE.md** 📚
Comprehensive testing guide with detailed endpoint documentation.

**Sections:**
- Authentication endpoints (Register, Login, Refresh, Logout)
- Content management (Create, Get All, Get By ID)
- Bookmarks (Add, Get, Remove)
- History (Track, Get)
- Profile (Create/Update, Get, Delete)
- Role-based access control
- Error scenarios
- Response format specifications
- Test coverage details

---

### 4. **QUICK_REFERENCE_GUIDE.md** ⚡
Quick reference for developers with common commands and examples.

**Sections:**
- Quick start instructions
- Endpoint summary table
- Authentication flow diagram
- cURL command examples (13+ examples)
- Common testing scenarios
- Troubleshooting guide
- Project structure

---

### 5. **TESTING_CHECKLIST.md** ✓
Comprehensive testing checklist for quality assurance.

**Coverage:**
- Pre-testing requirements
- Authentication testing (15+ checks)
- Content management testing (20+ checks)
- Bookmark testing (15+ checks)
- History testing (10+ checks)
- Profile testing (10+ checks)
- Role-based access testing (10+ checks)
- Error scenario testing (10+ checks)
- Integration testing
- Security testing
- Performance testing
- Database testing
- Final sign-off

---

## 🚀 Quick Start

### Step 1: Setup Environment
```bash
# Install dependencies
npm install

# Configure .env file
DB_USER=postgres
DB_HOST=localhost
DB_NAME=website_daily-entertaiment
DB_PASSWORD=D1cky5123
DB_PORT=5432
JWT_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
PORT=5000

# Start server
npm run dev
```

### Step 2: Import into Postman
1. Open Postman
2. Import `Postman_Collection.json`
3. Import `Postman_Environment.json`
4. Select the imported environment

### Step 3: Start Testing
1. Go to "Authentication" folder
2. Run "Register New User"
3. Run "Login User"
4. Then test other endpoints
5. Check test results in "Tests" tab

---

## 📋 API Endpoints Overview

| Folder | Endpoint | Method | Auth | Purpose |
|--------|----------|--------|------|---------|
| **Authentication** | `/register` | POST | ❌ | Create new user |
| | `/login` | POST | ❌ | Login & get token |
| | `/refresh` | POST | ❌ | Refresh token |
| | `/logout` | POST | ✅ | Logout user |
| **Content** | `/contents` | POST | ✅ | Create content |
| | `/contents` | GET | ❌ | Get all contents |
| | `/contents/:id` | GET | ❌ | Get by ID |
| **Bookmarks** | `/bookmarks` | POST | ✅ | Add bookmark |
| | `/bookmarks` | GET | ✅ | Get bookmarks |
| | `/bookmarks/:contentId` | DELETE | ✅ | Remove bookmark |
| **History** | `/histories` | POST | ✅ | Track history |
| | `/histories` | GET | ✅ | Get history |
| **Profile** | `/profile` | POST | ✅ | Create/update |
| | `/profile` | GET | ✅ | Get profile |
| | `/profile` | DELETE | ✅ | Delete profile |
| **Roles** | `/admin` | GET | ✅ | Admin access |
| | `/user` | GET | ✅ | User access |

---

## 🧪 Testing Workflow

### Recommended Test Order
```
1. Authentication
   ├── Register New User
   ├── Login User
   ├── Refresh Access Token
   └── Logout User

2. Content Management
   ├── Create Content
   ├── Get All Contents
   └── Get Content By ID

3. Features
   ├── Add Bookmark
   ├── Track History
   └── Create Profile

4. Verification
   ├── Get User Bookmarks
   ├── Get User History
   ├── Get Profile
   └── Role-Based Access

5. Cleanup
   ├── Remove Bookmark
   └── Delete Profile
```

---

## ✅ Test Coverage Summary

### Automated Tests
- **Authentication:** 8 tests
- **Content Management:** 6 tests
- **Bookmarks:** 6 tests
- **History:** 4 tests
- **Profile:** 6 tests
- **Role-Based Access:** 4 tests
- **Error Scenarios:** 6 tests

**Total: 40+ automated tests**

### What Gets Tested
✅ HTTP status codes  
✅ Response structure  
✅ Required fields presence  
✅ Field data types  
✅ Authentication enforcement  
✅ Authorization rules  
✅ Error messages  
✅ Variable storage for reuse  

---

## 🔑 Key Features

### Authentication Flow
```
Register → Login → (Get accessToken + refreshToken)
  ↓
Use accessToken for authenticated requests
  ↓
Token expires? → Use refreshToken to get new accessToken
  ↓
Logout → Tokens invalidated
```

### Automated Test Scripts
Each request includes tests that:
1. Verify HTTP status code
2. Check response structure
3. Validate required fields
4. Store tokens for future requests
5. Provide detailed error messages

### Environment Variables
Automatically updated by test scripts:
- `access_token` - Set on login
- `refresh_token` - Extracted from cookies
- `user_id` - Set on registration/login
- `content_id` - Set on content creation

---

## 🛠️ Usage Examples

### Using the Collection in Postman
```
1. Import both JSON files
2. Select the environment
3. Expand "Authentication" folder
4. Click "Register New User"
5. Click "Send"
6. Check the "Tests" tab for results
7. All subsequent requests can use the stored tokens
```

### Using cURL Commands
See `QUICK_REFERENCE_GUIDE.md` for 13+ example commands.

```bash
# Example: Login and capture token
TOKEN=$(curl -s -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.data.accessToken')

# Use token in next request
curl -X GET http://localhost:5000/api/bookmarks \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Test Results Guide

### Green Checkmark ✅
- Test passed successfully
- No action needed

### Red X ❌
- Test failed
- Check error message in test output
- Verify request body and authentication
- Check if endpoint is working

### Response Examples
See `POSTMAN_TESTING_GUIDE.md` for expected responses for each endpoint.

---

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Check if port is in use
netstat -tuln | grep 5000

# Kill process
lsof -ti:5000 | xargs kill -9
```

### Database Connection Error
- Verify PostgreSQL is running
- Check `.env` credentials
- Test: `psql -U postgres -h localhost`

### Token Not Working
- Ensure you've logged in first
- Check token isn't expired
- Verify Authorization header format: `Bearer {token}`

### Tests Showing Red X
- Check test results message
- Verify endpoint is correct
- Ensure request body is valid
- Check if authenticated endpoints have token

---

## 📝 Test Results Template

### After Running Full Collection

**Total Requests:** 50+  
**Status:** All Green ✅

**Results:**
- Authentication: 8/8 passed
- Content: 6/6 passed
- Bookmarks: 6/6 passed
- History: 4/4 passed
- Profile: 6/6 passed
- Role-Based: 4/4 passed
- Errors: 6/6 passed

---

## 📚 Documentation Structure

```
Testing Documentation
├── Postman_Collection.json
│   └── 50+ test cases with scripts
├── Postman_Environment.json
│   └── Pre-configured variables
├── POSTMAN_TESTING_GUIDE.md
│   └── Detailed endpoint documentation
├── QUICK_REFERENCE_GUIDE.md
│   └── Quick commands and examples
├── TESTING_CHECKLIST.md
│   └── QA checklist for validation
└── README.md (this file)
    └── Overview and quick start
```

---

## 🔐 Security Considerations

1. **Never commit `.env` file** to version control
2. **Use HTTPS in production** (setup uses HTTP for dev)
3. **Refresh tokens are httpOnly** - not accessible from JS
4. **Access tokens expire** - use refresh endpoint
5. **Passwords hashed** with bcrypt
6. **No sensitive data** in error messages

---

## 🎯 Testing Best Practices

1. **Run tests in order** - Follows authentication flow
2. **Check test results** - Green means passing, red means failure
3. **Use meaningful data** - Makes debugging easier
4. **Monitor response times** - Detect performance issues
5. **Test error cases** - Validate error handling
6. **Test with real data** - Ensure database integration works

---

## 📞 Support & Help

### For Issues:
1. Check error message in test output
2. Review relevant section in `POSTMAN_TESTING_GUIDE.md`
3. See troubleshooting in `QUICK_REFERENCE_GUIDE.md`
4. Verify database connection
5. Check server logs

### Documentation:
- **Endpoint Details:** See `POSTMAN_TESTING_GUIDE.md`
- **Quick Commands:** See `QUICK_REFERENCE_GUIDE.md`
- **Testing Workflow:** See `TESTING_CHECKLIST.md`

---

## 🚀 Next Steps

1. ✅ Import Postman collection and environment
2. ✅ Start server: `npm run dev`
3. ✅ Run authentication tests first
4. ✅ Test other endpoints
5. ✅ Review test results
6. ✅ Check "Tests" tab for detailed results
7. ✅ Iterate and fix issues

---

## 📊 Collection Statistics

- **Total Endpoints:** 13
- **Total Test Cases:** 50+
- **Automated Tests:** 40+
- **Error Scenarios:** 6+
- **Variables:** 10+
- **Auth Methods:** JWT Bearer Token
- **Response Format:** JSON

---

## 🎓 Learning Resources

Within this testing suite, you'll learn about:

✅ RESTful API testing best practices  
✅ JWT authentication flow  
✅ Postman test scripting  
✅ Error handling and validation  
✅ Role-based access control testing  
✅ Integration testing patterns  
✅ Security testing concepts  

---

## 📅 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-15 | Initial release with full test coverage |

---

## 📝 Notes

- All timestamps are auto-generated to ensure unique test data
- Variables automatically update across requests
- Tests run sequentially to maintain data flow
- No setup scripts needed - tests are independent

---

**Created:** January 15, 2024  
**Format:** JSON + Markdown  
**API Base:** `http://localhost:5000/api`  
**Status:** ✅ Ready to use

---

## Quick Links

- 📖 [Detailed Testing Guide](./POSTMAN_TESTING_GUIDE.md)
- ⚡ [Quick Reference](./QUICK_REFERENCE_GUIDE.md)
- ✓ [Testing Checklist](./TESTING_CHECKLIST.md)
- 📦 [Postman Collection](./Postman_Collection.json)
- 🔧 [Postman Environment](./Postman_Environment.json)

---

**Happy Testing! 🎉**
