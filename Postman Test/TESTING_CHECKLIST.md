# API Testing Checklist

## 📋 Pre-Testing Requirements

### Environment
- [ ] Node.js server is running on port 5000
- [ ] PostgreSQL database is running
- [ ] `.env` file is properly configured
- [ ] Database tables are created
- [ ] Postman is installed and updated

### Setup
- [ ] Postman collection imported (`Postman_Collection.json`)
- [ ] Postman environment imported (`Postman_Environment.json`)
- [ ] Environment variables are set correctly
- [ ] Base URL is set to `http://localhost:5000/api`

---

## 🔐 Authentication Testing

### Register Endpoint
- [ ] **Happy Path**
  - [ ] Valid registration with unique email returns 201
  - [ ] User object contains id, username, email
  - [ ] User can be verified in database
  
- [ ] **Error Cases**
  - [ ] Duplicate email returns 409
  - [ ] Duplicate username returns 409
  - [ ] Missing fields returns 400
  - [ ] Invalid email format returns 400
  - [ ] Short password returns 400

### Login Endpoint
- [ ] **Happy Path**
  - [ ] Valid credentials return 200
  - [ ] Response contains accessToken
  - [ ] Response contains user object
  - [ ] Refresh token set in httpOnly cookie
  
- [ ] **Error Cases**
  - [ ] Non-existent email returns 404
  - [ ] Wrong password returns 401
  - [ ] Missing credentials returns 400

### Refresh Token Endpoint
- [ ] **Happy Path**
  - [ ] Valid refresh token returns 200
  - [ ] New accessToken provided in response
  - [ ] Token is different from previous one
  
- [ ] **Error Cases**
  - [ ] Expired refresh token returns 401
  - [ ] Invalid refresh token returns 401
  - [ ] Missing refresh token returns 401

### Logout Endpoint
- [ ] **Happy Path**
  - [ ] Valid token returns 200
  - [ ] Logout message in response
  
- [ ] **Error Cases**
  - [ ] Missing token returns 401
  - [ ] Invalid token returns 401

---

## 📝 Content Management Testing

### Create Content Endpoint
- [ ] **Happy Path**
  - [ ] Valid content creation returns 201
  - [ ] Content contains all provided fields
  - [ ] Content ID is unique
  - [ ] user_id matches logged-in user
  - [ ] created_at timestamp is present
  
- [ ] **Required Fields**
  - [ ] Title is required (missing returns 400)
  - [ ] URL is required (missing returns 400)
  
- [ ] **Optional Fields**
  - [ ] Description can be empty
  - [ ] Category_id can be null
  - [ ] Thumbnail can be empty
  
- [ ] **Error Cases**
  - [ ] No authentication returns 401
  - [ ] Empty title returns 400
  - [ ] Empty URL returns 400

### Get All Contents Endpoint
- [ ] **Happy Path**
  - [ ] Returns 200 OK
  - [ ] Response is array
  - [ ] Each item has id, title, url
  - [ ] Each item has author info (author_name, user_id)
  - [ ] Each item has category info (category_name)
  - [ ] Results are ordered by created_at DESC
  
- [ ] **Pagination (if implemented)**
  - [ ] Large result set is paginated
  - [ ] Pagination parameters work correctly
  
- [ ] **Error Cases**
  - [ ] Invalid query parameters handled gracefully

### Get Content By ID Endpoint
- [ ] **Happy Path**
  - [ ] Valid ID returns 200
  - [ ] Response contains correct content
  - [ ] Content ID matches requested ID
  - [ ] Author information is included
  - [ ] Category information is included
  
- [ ] **Error Cases**
  - [ ] Non-existent ID returns 404 or null data
  - [ ] Invalid ID format returns 400 or error

---

## 🔖 Bookmark Testing

### Add Bookmark Endpoint
- [ ] **Happy Path**
  - [ ] Valid bookmark returns 201
  - [ ] Bookmark contains user_id and content_id
  - [ ] created_at timestamp is present
  
- [ ] **Edge Cases**
  - [ ] Adding same bookmark twice returns 200 with "already bookmarked"
  - [ ] Cannot bookmark non-existent content (if validated)
  
- [ ] **Error Cases**
  - [ ] Missing content_id returns 400
  - [ ] Invalid content_id returns 400
  - [ ] Missing token returns 401
  - [ ] Invalid token returns 401

### Get User Bookmarks Endpoint
- [ ] **Happy Path**
  - [ ] Returns 200 OK
  - [ ] Response is array
  - [ ] Each bookmark has user_id, content_id
  - [ ] Each bookmark has content details
  - [ ] Returns only current user's bookmarks
  
- [ ] **Error Cases**
  - [ ] Missing token returns 401
  - [ ] Invalid token returns 401
  - [ ] Empty bookmarks returns empty array

### Remove Bookmark Endpoint
- [ ] **Happy Path**
  - [ ] Valid removal returns 200
  - [ ] Bookmark is deleted from database
  - [ ] Bookmark no longer appears in user's list
  
- [ ] **Error Cases**
  - [ ] Non-existent bookmark returns 404
  - [ ] Missing token returns 401
  - [ ] Invalid token returns 401
  - [ ] Invalid content_id format returns 400

---

## 📚 History Testing

### Track History Endpoint
- [ ] **Happy Path**
  - [ ] Valid history entry returns 201
  - [ ] History contains user_id and content_id
  - [ ] viewed_at timestamp is present
  
- [ ] **Behavior**
  - [ ] Can track same content multiple times
  - [ ] Each entry gets unique timestamp
  
- [ ] **Error Cases**
  - [ ] Missing content_id returns 400
  - [ ] Invalid content_id returns 400
  - [ ] Missing token returns 401
  - [ ] Invalid token returns 401

### Get User History Endpoint
- [ ] **Happy Path**
  - [ ] Returns 200 OK
  - [ ] Response is array
  - [ ] Each entry has user_id, content_id
  - [ ] Each entry has content details
  - [ ] Returns only current user's history
  - [ ] Results ordered by viewed_at DESC
  
- [ ] **Error Cases**
  - [ ] Missing token returns 401
  - [ ] Invalid token returns 401
  - [ ] Empty history returns empty array

---

## 👤 Profile Testing

### Create/Update Profile Endpoint
- [ ] **Happy Path**
  - [ ] Valid profile save returns 200
  - [ ] Profile contains all provided fields
  - [ ] User can update existing profile
  - [ ] updated_at timestamp is present
  
- [ ] **Optional Fields**
  - [ ] All fields are optional
  - [ ] Can save profile with no data
  
- [ ] **Error Cases**
  - [ ] Missing token returns 401
  - [ ] Invalid token returns 401
  - [ ] Invalid field format returns 400

### Get Profile Endpoint
- [ ] **Happy Path**
  - [ ] Returns 200 OK
  - [ ] Response contains profile data
  - [ ] Profile belongs to current user
  - [ ] All fields are returned correctly
  
- [ ] **Edge Cases**
  - [ ] User without profile returns null or empty
  
- [ ] **Error Cases**
  - [ ] Missing token returns 401
  - [ ] Invalid token returns 401

### Delete Profile Endpoint
- [ ] **Happy Path**
  - [ ] Valid deletion returns 200
  - [ ] Profile deleted from database
  - [ ] Get profile returns empty after delete
  
- [ ] **Error Cases**
  - [ ] Missing token returns 401
  - [ ] Invalid token returns 401
  - [ ] Non-existent profile deletion handled

---

## 🔑 Role-Based Access Testing

### Admin Access Endpoint
- [ ] **Admin User**
  - [ ] Admin returns 200 with welcome message
  
- [ ] **Regular User**
  - [ ] Regular user returns 403 Forbidden
  
- [ ] **Error Cases**
  - [ ] No token returns 401
  - [ ] Invalid token returns 401

### User Access Endpoint
- [ ] **Regular User**
  - [ ] User returns 200 with welcome message
  
- [ ] **Admin User**
  - [ ] Admin returns 200 with welcome message
  
- [ ] **Error Cases**
  - [ ] No token returns 401
  - [ ] Invalid token returns 401

---

## ⚠️ Error Scenario Testing

### Invalid Authentication
- [ ] [ ] Expired token returns 401
- [ ] [ ] Malformed token returns 401
- [ ] [ ] Missing bearer prefix returns 401
- [ ] [ ] Token from other user rejected

### Invalid Data
- [ ] [ ] SQL injection attempts handled
- [ ] [ ] XSS attempts in fields handled
- [ ] [ ] Very long strings truncated
- [ ] [ ] Special characters properly escaped

### Rate Limiting (if implemented)
- [ ] [ ] Multiple rapid requests handled
- [ ] [ ] Rate limit headers present
- [ ] [ ] 429 Too Many Requests returned

---

## 📊 Integration Testing

### Complete User Journey
- [ ] User Registration
  - [ ] Register new user successfully
  
- [ ] User Login
  - [ ] Login with registered credentials
  - [ ] Token stored for future requests
  
- [ ] Create Content
  - [ ] Create content item as logged-in user
  - [ ] Content appears in list
  
- [ ] Bookmark Content
  - [ ] Add content to bookmarks
  - [ ] Content appears in bookmarks list
  
- [ ] Track History
  - [ ] Track content view
  - [ ] View appears in history list
  
- [ ] Create Profile
  - [ ] Create profile for user
  - [ ] Profile can be retrieved
  - [ ] Profile can be updated
  
- [ ] Delete Content Association
  - [ ] Remove bookmark
  - [ ] Content removed from bookmarks

### Cross-User Testing
- [ ] [ ] User A cannot see User B's bookmarks
- [ ] [ ] User A cannot see User B's history
- [ ] [ ] User A cannot see User B's profile
- [ ] [ ] User A can see public content from User B

---

## 🔒 Security Testing

### Authentication & Authorization
- [ ] [ ] Protected endpoints require valid token
- [ ] [ ] Expired tokens are rejected
- [ ] [ ] Invalid tokens are rejected
- [ ] [ ] Role-based access properly enforced

### Data Protection
- [ ] [ ] Passwords are hashed (not plain text)
- [ ] [ ] Sensitive data not in error messages
- [ ] [ ] No sensitive data in logs
- [ ] [ ] User data properly isolated

### Input Validation
- [ ] [ ] Empty strings validated
- [ ] [ ] Special characters handled
- [ ] [ ] SQL injection prevented
- [ ] [ ] XSS attacks prevented

---

## 🎯 Response Format Validation

### Success Responses
- [ ] [ ] All success responses include `success: true`
- [ ] [ ] Message field is meaningful
- [ ] [ ] Data field contains expected structure
- [ ] [ ] Proper HTTP status code (200, 201)

### Error Responses
- [ ] [ ] All error responses include `success: false`
- [ ] [ ] Error messages are clear
- [ ] [ ] Data field is null
- [ ] [ ] Proper error HTTP status code

### Headers
- [ ] [ ] Content-Type is application/json
- [ ] [ ] CORS headers present (if needed)
- [ ] [ ] No sensitive info in headers

---

## ⏱️ Performance Testing

### Response Times
- [ ] [ ] List endpoints respond < 500ms
- [ ] [ ] Get single item < 200ms
- [ ] [ ] Create/Update < 300ms
- [ ] [ ] Delete < 200ms

### Database
- [ ] [ ] No N+1 query problems
- [ ] [ ] Proper indexing used
- [ ] [ ] Connection pooling working

### Load Testing (if applicable)
- [ ] [ ] Server handles 100 concurrent users
- [ ] [ ] No memory leaks detected
- [ ] [ ] Response times stable under load

---

## 🗄️ Database Testing

### Data Integrity
- [ ] [ ] Foreign key constraints enforced
- [ ] [ ] Unique constraints working
- [ ] [ ] Required fields enforced
- [ ] [ ] Default values applied

### CRUD Operations
- [ ] [ ] Create: New records inserted correctly
- [ ] [ ] Read: Data retrieved accurately
- [ ] [ ] Update: Changes saved correctly
- [ ] [ ] Delete: Records removed properly

---

## 📝 Documentation Testing

### API Documentation
- [ ] [ ] All endpoints documented
- [ ] [ ] Request/response examples provided
- [ ] [ ] Error codes documented
- [ ] [ ] Authentication requirements clear

### Code Comments
- [ ] [ ] Complex logic explained
- [ ] [ ] Function purposes documented
- [ ] [ ] Parameters documented

---

## ✅ Final Sign-Off

### Test Summary
- Total Endpoints Tested: ___/13
- Total Tests Run: ___/150
- Tests Passed: ___
- Tests Failed: ___
- Success Rate: ___%

### Issues Found
- [ ] No critical issues
- [ ] Critical issues: _____
- [ ] Non-critical issues: _____

### Ready for Production
- [ ] All critical tests passed
- [ ] All endpoints functional
- [ ] Error handling working
- [ ] Security validation complete
- [ ] Performance acceptable
- [ ] Documentation complete

### Sign-Off

**Tester Name:** ________________  
**Date:** ________________  
**Status:** ☐ Approved ☐ Needs Work

**Notes:**
```
_________________________________________
_________________________________________
_________________________________________
```

---

## 📞 Test Results Reference

### Passing Tests
✅ - Test passed successfully

### Failing Tests
❌ - Test failed, see notes section

### Skipped Tests
⊘ - Test skipped (not applicable)

### In Progress
⟳ - Test in progress

---

## 🔄 Regression Testing

Run this checklist regularly to ensure changes don't break existing functionality:

- [ ] Run at every major code change
- [ ] Run before production deployment
- [ ] Run after database migration
- [ ] Run after dependency update

---

**Generated:** 2024-01-15  
**Version:** 1.0.0  
**Last Updated:** January 15, 2024
