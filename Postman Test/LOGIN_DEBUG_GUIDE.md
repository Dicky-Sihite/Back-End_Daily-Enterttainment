# 🔧 Debugging Guide - Login 401 Error

## Issue
The Register endpoint returns **201 Created** successfully, but the Login endpoint returns **401 Unauthorized** (User not found).

---

## Root Cause Analysis

### Possible Causes

1. **test_email Variable Not Being Stored**
   - The Register test script should extract and store the email
   - If test_email is empty, Login fails

2. **User Not Actually Created in Database**
   - Register response is successful but database insert failed
   - User record doesn't exist when Login tries to find it

3. **Roles Table Issue**
   - After creating user, the code tries to assign a role
   - If roles table doesn't exist or role doesn't exist, user creation might fail silently

4. **Email Format Mismatch**
   - Registration creates: `testuser1705300000@example.com`
   - But database might store it differently
   - Whitespace or encoding issue

5. **Backend Service Issue**
   - Auth service might have a bug
   - JWT secrets might not be configured
   - Database connection might be failing

---

## Diagnostic Steps

### Step 1: Check Postman Console
1. Open Postman
2. Go to **View** → **Show Postman Console**
3. Run Register test
4. Look for console logs showing the stored email
5. Run Login test
6. Check console for error messages

**Expected console output after Register:**
```
Registered email: testuser1705300000@example.com
Stored as test_email: testuser1705300000@example.com
```

**Expected console output before Login:**
```
Login - Using email: testuser1705300000@example.com
Login - Using password: password123
```

**If you see:**
```
WARNING: test_email is empty!
```

The variable wasn't stored properly.

---

### Step 2: Test Hardcoded Credentials

Run the **[DEBUG] Login with Hardcoded Test Credentials** request:

```json
{
  "email": "testuser@gmail.com",
  "password": "password123"
}
```

**Possible Results:**

#### Result A: 200 OK (Success)
✅ **Problem Identified:** Dynamic email storage issue
- Backend login works fine
- The problem is the test_email variable from Register isn't being stored
- Fix: Manually set test_email variable or use a different approach

#### Result B: 401 Unauthorized
❌ **Problem:** Backend login is broken
- User testuser@gmail.com should exist but doesn't
- Check:
  - Does database have any users?
  - Is getUserRoles function working?
  - Is JWT_SECRET configured?

---

### Step 3: Check Backend Logs

1. Look at the terminal where you ran `npm run dev`
2. Check for errors like:
   ```
   Database connection error
   JWT_SECRET not defined
   Role not found
   ```

3. Expected log on successful Register:
   ```
   Registered user: testuser_1705300000 with email testuser1705300000@example.com
   ```

4. Expected log on successful Login:
   ```
   User logged in: testuser_1705300000
   Access token generated
   ```

---

### Step 4: Verify Database

Use PostgreSQL client to check:

```sql
-- Check if users table exists
SELECT * FROM users LIMIT 5;

-- Check if any users were created
SELECT id, username, email FROM users;

-- Check if roles table exists
SELECT * FROM roles;

-- Check user_roles associations
SELECT * FROM user_roles;

-- Check if refresh_tokens table exists
SELECT * FROM refresh_tokens;
```

**Problem Signs:**
- No users in table → Register is not saving to database
- Roles table doesn't exist → Registration might fail silently
- password_hash is NULL → Something's wrong with registration

---

## Solutions

### Solution 1: Reset and Try Again
1. Delete all test users from database:
   ```sql
   DELETE FROM users WHERE username LIKE 'testuser%';
   ```

2. Restart the Postman tests from Register
3. Watch the Postman console carefully

### Solution 2: Use Hardcoded Test User
If dynamic registration doesn't work, create a test user manually:

```sql
-- First, ensure role exists
INSERT INTO roles (name) VALUES ('user') ON CONFLICT DO NOTHING;

-- Create test user with known email/password
-- Note: password should be bcrypt hash of "password123"
INSERT INTO users (username, email, password_hash) VALUES (
  'testuser',
  'testuser@gmail.com',
  '$2b$12$...' -- bcrypt hash of "password123"
);

-- Assign role
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'testuser' AND r.name = 'user';
```

Then use the **[DEBUG] Login with Hardcoded Test Credentials** request.

### Solution 3: Check Collection Variables
1. Open Postman collection
2. Go to collection settings
3. Verify initial values:
   - `test_email` = empty (should be set by Register)
   - `test_password` = "password123"
   - `access_token` = empty (should be set by Login)

### Solution 4: Enable More Debugging
Add this pre-request script to Register test to log everything:

```javascript
// In Register response test script
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    console.log('=== REGISTER SUCCESS ===');
    console.log('Response data:', JSON.stringify(jsonData.data, null, 2));
    console.log('Email from response:', jsonData.data.email);
}
```

---

## Quick Troubleshooting Flowchart

```
Login returns 401?
│
├─ Run [DEBUG] Hardcoded Login Test
│  │
│  ├─ Hardcoded test succeeds (200)?
│  │  └─ YES → Variable issue (Solution 1 or 3)
│  │
│  └─ Hardcoded test fails (401)?
│     └─ YES → Backend issue (Solution 2)
│
├─ Check Backend Logs
│  │
│  ├─ Database connection error?
│  │  └─ YES → Start PostgreSQL
│  │
│  ├─ JWT_SECRET not found?
│  │  └─ YES → Check .env file
│  │
│  └─ Role not found?
│     └─ YES → Create roles in database
│
└─ Check Database
   │
   ├─ No users?
   │  └─ YES → Register isn't saving (Solution 2)
   │
   ├─ No roles?
   │  └─ YES → Create roles manually
   │
   └─ User exists but password wrong?
      └─ YES → Verify bcrypt hashing
```

---

## Common Issues & Fixes

### Issue: "User tidak ditemukan" (User not found)
**Cause:** User doesn't exist in database  
**Fix:** 
- Verify register actually created the user
- Check database directly
- Try Solution 2 (hardcoded test user)

### Issue: "Password salah" (Password wrong)
**Cause:** Password hash doesn't match  
**Fix:**
- Ensure bcrypt.compare works correctly
- Check bcrypt version in package.json
- Verify password is passed correctly

### Issue: "Token tidak disediakan" (Token not provided)
**Cause:** Missing JWT_SECRET in .env  
**Fix:**
```bash
# Check .env file
cat .env

# Should see:
JWT_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
```

### Issue: "Terjadi kesalahan di server" (Server error)
**Cause:** Unexpected error in auth service  
**Fix:**
- Check backend console for stack trace
- Verify database connection
- Check if roles table exists
- Look for NULL reference errors

---

## Testing Checklist

- [ ] Backend server running (`npm run dev`)
- [ ] PostgreSQL database running
- [ ] `.env` file has JWT_SECRET and JWT_REFRESH_SECRET
- [ ] `users` table exists
- [ ] `roles` table exists with 'user' role
- [ ] `user_roles` table exists
- [ ] Postman console open and visible
- [ ] Variables test_email and test_password visible in collection

---

## Next Steps

1. **Try [DEBUG] Hardcoded Login Test first**
   - If succeeds: Follow Solution 1 or 3
   - If fails: Follow Solution 2

2. **Check Postman Console** 
   - Look for stored email and error messages
   - Copy error messages and debug

3. **Verify Database**
   - Ensure tables exist
   - Ensure user was created
   - Ensure role exists

4. **Check Backend Logs**
   - Look for exceptions
   - Look for JWT errors
   - Look for database errors

---

## Reference

**Backend Files:**
- Auth Service: `src/services/authService.js`
- Auth Controller: `src/controllers/authController.js`
- Database Config: `src/config/db.js`

**Database Schema:**
- Users table should have: id, username, email, password_hash
- Roles table should have: id, name
- User_roles table should have: user_id, role_id

**Environment Variables (.env):**
```env
JWT_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
DB_USER=postgres
DB_PASSWORD=D1cky5123
DB_HOST=localhost
DB_NAME=website_daily-entertaiment
DB_PORT=5432
```

---

## Getting Help

If still stuck:

1. **Share Postman Console output** - Copy logs from console
2. **Share Backend logs** - Show output from `npm run dev`
3. **Share Database query results** - Run `SELECT * FROM users;`
4. **Check test_email variable** - In Postman collection settings, verify it's not empty

---

**Last Updated:** January 15, 2024  
**Status:** Debugging in Progress
