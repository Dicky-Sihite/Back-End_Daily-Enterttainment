# API Testing Guide - Postman Collection

## Overview
This guide provides detailed documentation for testing the Content & Bookmark API using the Postman collection. The backend is a Node.js Express application with PostgreSQL database for managing content, bookmarks, user history, and profiles.

---

## Base Configuration

### Base URL
```
http://localhost:5000/api
```

### Environment Variables (Pre-configured in Postman)
- `base_url`: `http://localhost:5000/api`
- `access_token`: JWT token obtained after login
- `refresh_token`: Refresh token stored in HTTP-only cookies
- `user_id`: Current user's ID
- `content_id`: Current content item's ID

---

## 1. Authentication Endpoints

### 1.1 Register New User
**Endpoint:** `POST /register`

**Purpose:** Create a new user account

**Request Body:**
```json
{
  "username": "testuser_1234567890",
  "email": "testuser@example.com",
  "password": "password123"
}
```

**Required Fields:**
- `username` - Unique username (string)
- `email` - Valid email address (string)
- `password` - Minimum 6 characters (string)

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User berhasil dibuat",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "testuser@example.com",
    "role": "user",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Cases:**
- `400` - Data not complete or invalid format
- `409` - Email or username already exists

**Tests Included:**
✅ Status code is 201
✅ Response has success flag
✅ Response contains user object with ID, username, email
✅ Automatically stores user_id for future requests

---

### 1.2 Login User
**Endpoint:** `POST /login`

**Purpose:** Authenticate user and obtain access token

**Request Body:**
```json
{
  "email": "testuser@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "testuser@example.com",
      "role": "user"
    }
  }
}
```

**Additional Response:** Refresh token is automatically set in HTTP-only cookie

**Error Cases:**
- `401` - Invalid password
- `404` - User not found

**Tests Included:**
✅ Status code is 200
✅ Response contains valid accessToken
✅ Response contains user data
✅ Automatically stores access_token for authenticated requests
✅ Automatically extracts refresh_token from cookies

---

### 1.3 Refresh Access Token
**Endpoint:** `POST /refresh`

**Purpose:** Get a new access token using refresh token

**Request Body:** Empty (refresh token sent via cookie)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Token berhasil diperbarui",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Cases:**
- `401` - Invalid or expired refresh token

**Tests Included:**
✅ Status code is 200
✅ New access token is provided
✅ Automatically updates access_token variable

---

### 1.4 Logout User
**Endpoint:** `POST /logout`

**Authentication:** Required (Bearer Token)

**Purpose:** Logout current user and invalidate tokens

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout berhasil",
  "data": null
}
```

**Error Cases:**
- `401` - Missing or invalid token

**Tests Included:**
✅ Status code is 200
✅ Response has success flag

---

## 2. Content Management Endpoints

### 2.1 Create Content
**Endpoint:** `POST /contents`

**Authentication:** Required (Bearer Token)

**Purpose:** Create a new content item

**Request Body:**
```json
{
  "title": "Interesting Article",
  "description": "This is an interesting article about technology",
  "category_id": 1,
  "thumbnail": "https://via.placeholder.com/300x200?text=Article",
  "url": "https://example.com/article"
}
```

**Required Fields:**
- `title` - Content title (string)
- `url` - Content URL (string)

**Optional Fields:**
- `description` - Content description (string)
- `category_id` - Category ID (integer)
- `thumbnail` - Thumbnail image URL (string)

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Content created successfully",
  "data": {
    "id": 5,
    "title": "Interesting Article",
    "description": "This is an interesting article about technology",
    "url": "https://example.com/article",
    "category_id": 1,
    "user_id": 1,
    "thumbnail": "https://via.placeholder.com/300x200?text=Article",
    "created_at": "2024-01-15T10:35:00Z"
  }
}
```

**Error Cases:**
- `400` - Missing title or URL
- `401` - Unauthorized (missing token)

**Tests Included:**
✅ Status code is 201
✅ Response has success flag
✅ Content object contains ID, title, URL
✅ Automatically stores content_id for future requests

---

### 2.2 Get All Contents
**Endpoint:** `GET /contents`

**Authentication:** Optional (public endpoint)

**Purpose:** Retrieve all content items

**Query Parameters:** None

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Contents retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Article 1",
      "description": "Description 1",
      "url": "https://example.com/article1",
      "category_id": 1,
      "category_name": "Technology",
      "user_id": 1,
      "author_name": "John Doe",
      "thumbnail": "https://...",
      "created_at": "2024-01-14T10:00:00Z"
    },
    ...
  ]
}
```

**Tests Included:**
✅ Status code is 200
✅ Response data is an array
✅ Each content item has required fields (id, title, url)

---

### 2.3 Get Content By ID
**Endpoint:** `GET /contents/{id}`

**Authentication:** Optional (public endpoint)

**Purpose:** Retrieve a specific content item

**URL Parameters:**
- `id` - Content ID (required)

**Example:**
```
GET /contents/5
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Content retrieved successfully",
  "data": {
    "id": 5,
    "title": "Interesting Article",
    "description": "Full description",
    "url": "https://example.com/article",
    "category_id": 1,
    "category_name": "Technology",
    "user_id": 1,
    "author_name": "Jane Smith",
    "thumbnail": "https://...",
    "created_at": "2024-01-15T10:35:00Z"
  }
}
```

**Error Cases:**
- `404` - Content not found

**Tests Included:**
✅ Status code is 200
✅ Content has correct ID

---

## 3. Bookmark Endpoints

### 3.1 Add Bookmark
**Endpoint:** `POST /bookmarks`

**Authentication:** Required (Bearer Token)

**Purpose:** Add a content item to user's bookmarks

**Request Body:**
```json
{
  "content_id": 5
}
```

**Required Fields:**
- `content_id` - Content ID to bookmark (integer)

**Success Response (201 Created or 200 OK):**
```json
{
  "success": true,
  "message": "Bookmark added successfully",
  "data": {
    "user_id": 1,
    "content_id": 5,
    "created_at": "2024-01-15T10:40:00Z"
  }
}
```

**Special Cases:**
- If content already bookmarked: Returns 200 OK with "Content already bookmarked"

**Error Cases:**
- `400` - Missing content_id
- `401` - Unauthorized (missing token)

**Tests Included:**
✅ Status code is 201 or 200
✅ Response has success flag

---

### 3.2 Get User Bookmarks
**Endpoint:** `GET /bookmarks`

**Authentication:** Required (Bearer Token)

**Purpose:** Retrieve all bookmarks for current user

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Bookmarks retrieved successfully",
  "data": [
    {
      "user_id": 1,
      "content_id": 5,
      "content": {
        "id": 5,
        "title": "Article Title",
        "url": "https://example.com/article",
        "thumbnail": "https://..."
      },
      "created_at": "2024-01-15T10:40:00Z"
    },
    ...
  ]
}
```

**Error Cases:**
- `401` - Unauthorized (missing token)

**Tests Included:**
✅ Status code is 200
✅ Response data is an array
✅ Each bookmark has user_id and content_id

---

### 3.3 Remove Bookmark
**Endpoint:** `DELETE /bookmarks/{contentId}`

**Authentication:** Required (Bearer Token)

**Purpose:** Remove a content item from user's bookmarks

**URL Parameters:**
- `contentId` - Content ID to remove (required)

**Example:**
```
DELETE /bookmarks/5
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Bookmark removed successfully",
  "data": null
}
```

**Error Cases:**
- `404` - Bookmark not found
- `401` - Unauthorized (missing token)

**Tests Included:**
✅ Status code is 200 or 404
✅ Response has success flag

---

## 4. History Endpoints

### 4.1 Track History
**Endpoint:** `POST /histories`

**Authentication:** Required (Bearer Token)

**Purpose:** Track that user has viewed a content item

**Request Body:**
```json
{
  "content_id": 5
}
```

**Required Fields:**
- `content_id` - Content ID viewed (integer)

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "History tracked successfully",
  "data": {
    "id": 123,
    "user_id": 1,
    "content_id": 5,
    "viewed_at": "2024-01-15T10:45:00Z"
  }
}
```

**Error Cases:**
- `400` - Missing content_id
- `401` - Unauthorized (missing token)

**Tests Included:**
✅ Status code is 201
✅ Response has success flag

---

### 4.2 Get User History
**Endpoint:** `GET /histories`

**Authentication:** Required (Bearer Token)

**Purpose:** Retrieve view history for current user

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "History retrieved successfully",
  "data": [
    {
      "id": 123,
      "user_id": 1,
      "content_id": 5,
      "content": {
        "id": 5,
        "title": "Article Title",
        "url": "https://example.com/article"
      },
      "viewed_at": "2024-01-15T10:45:00Z"
    },
    ...
  ]
}
```

**Error Cases:**
- `401` - Unauthorized (missing token)

**Tests Included:**
✅ Status code is 200
✅ Response data is an array
✅ Each history item has user_id and content_id

---

## 5. Profile Endpoints

### 5.1 Create/Update Profile
**Endpoint:** `POST /profile`

**Authentication:** Required (Bearer Token)

**Purpose:** Create or update user profile

**Request Body:**
```json
{
  "bio": "I love reading interesting content",
  "profile_picture": "https://via.placeholder.com/150",
  "phone": "+1234567890",
  "location": "San Francisco, CA",
  "website": "https://example.com"
}
```

**Optional Fields:**
- `bio` - User biography (string)
- `profile_picture` - Profile image URL (string)
- `phone` - Phone number (string)
- `location` - User location (string)
- `website` - Personal website URL (string)

**Success Response (200 OK):**
```json
{
  "message": "Profile saved",
  "data": {
    "id": 1,
    "user_id": 1,
    "bio": "I love reading interesting content",
    "profile_picture": "https://via.placeholder.com/150",
    "phone": "+1234567890",
    "location": "San Francisco, CA",
    "website": "https://example.com",
    "updated_at": "2024-01-15T10:50:00Z"
  }
}
```

**Error Cases:**
- `401` - Unauthorized (missing token)

**Tests Included:**
✅ Status code is 200
✅ Response has message field

---

### 5.2 Get Profile
**Endpoint:** `GET /profile`

**Authentication:** Required (Bearer Token)

**Purpose:** Retrieve current user's profile

**Success Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "bio": "I love reading interesting content",
  "profile_picture": "https://via.placeholder.com/150",
  "phone": "+1234567890",
  "location": "San Francisco, CA",
  "website": "https://example.com",
  "created_at": "2024-01-15T10:50:00Z"
}
```

**Error Cases:**
- `401` - Unauthorized (missing token)
- `404` - Profile not found

**Tests Included:**
✅ Status code is 200
✅ Response contains data object

---

### 5.3 Delete Profile
**Endpoint:** `DELETE /profile`

**Authentication:** Required (Bearer Token)

**Purpose:** Delete current user's profile

**Success Response (200 OK):**
```json
{
  "message": "Profile deleted"
}
```

**Error Cases:**
- `401` - Unauthorized (missing token)

**Tests Included:**
✅ Status code is 200
✅ Response has message field

---

## 6. Role-Based Access Control

### 6.1 Admin Access Test
**Endpoint:** `GET /admin`

**Authentication:** Required (Bearer Token)

**Purpose:** Test admin-only endpoint (requires admin role)

**Success Response (200 OK) - Admin User:**
```json
{
  "success": true,
  "message": "Selamat datang Admin",
  "data": null
}
```

**Error Response (403 Forbidden) - Regular User:**
```json
{
  "success": false,
  "message": "Akses ditolak",
  "data": null
}
```

**Error Cases:**
- `401` - Unauthorized (missing token)
- `403` - Forbidden (user doesn't have admin role)

---

### 6.2 User Access Test
**Endpoint:** `GET /user`

**Authentication:** Required (Bearer Token)

**Purpose:** Test user-accessible endpoint (user or admin role)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Selamat datang User",
  "data": null
}
```

**Error Cases:**
- `401` - Unauthorized (missing token)

---

## 7. Error Scenarios

The collection includes test cases for common error scenarios:

### 7.1 Login with Invalid Credentials
Tests authentication failure with non-existent user or wrong password.

### 7.2 Access Protected Endpoint Without Token
Tests that protected endpoints require authentication.

### 7.3 Create Content with Missing Required Fields
Tests validation for required request body fields.

### 7.4 Get Non-Existent Content
Tests handling of resource not found scenarios.

---

## How to Use the Postman Collection

### 1. Import Collection
1. Open Postman
2. Click "Import" button
3. Select the `Postman_Collection.json` file
4. Collection will be imported with all endpoints and tests

### 2. Setup Environment Variables
The collection includes pre-configured variables:
- Update `base_url` if your server runs on a different URL
- Other variables are automatically updated by test scripts

### 3. Execute Tests
**Authentication Flow:**
1. Start with "Register New User" to create a test account
2. Run "Login User" to get access token (automatically stored)
3. Other authenticated endpoints can now be used

**Recommended Test Order:**
1. Authentication → Register
2. Authentication → Login
3. Content → Create Content
4. Bookmarks → Add Bookmark
5. History → Track History
6. Profile → Create/Update Profile
7. Role-Based Access → User Access Test

### 4. View Test Results
- Click on a request and run it
- Check the "Tests" tab in the response panel
- Green checkmarks indicate passing tests
- Red X indicates failing tests

### 5. Run Full Collection Tests
1. Click the collection name
2. Click "Run" button
3. Execute all requests in sequence
4. Review test summary at the end

---

## Automated Test Coverage

The collection includes 40+ automated tests covering:

✅ **Status Codes**
- Correct HTTP status codes for success (200, 201)
- Proper error codes (400, 401, 403, 404)

✅ **Response Structure**
- All responses follow success/error format
- Data fields are present when expected

✅ **Data Validation**
- Required fields are present
- Field types are correct

✅ **Authentication**
- Token storage and retrieval
- Protected endpoints require auth
- Invalid tokens are rejected

✅ **Business Logic**
- Bookmarks can be added and removed
- History is tracked correctly
- Profile can be created/updated/deleted

---

## Common Issues and Solutions

### Issue: "Token not provided" error
**Solution:** Make sure you've run the Login endpoint first to get the access token.

### Issue: "Email or username already exists" on register
**Solution:** Use different email/username (collection uses timestamp to auto-generate unique values)

### Issue: "Content already bookmarked"
**Solution:** This is normal - you can bookmark the same content multiple times, and it will return 200 OK

### Issue: Tests show red X marks
**Solution:** Check the actual response in the Response panel and verify:
- Endpoint URL is correct
- Request body has required fields
- Authentication token is valid

---

## API Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

---

## Database Schema Overview

The backend uses PostgreSQL with the following main tables:

- **users** - User accounts with email, username, password
- **contents** - Content items with title, URL, category
- **bookmarks** - User bookmark associations
- **histories** - User view history
- **profiles** - Extended user profile information
- **categories** - Content categories

---

## Best Practices

1. **Use environment variables** - Don't hardcode values in requests
2. **Run tests in order** - Follow the recommended sequence
3. **Check test results** - Always review the Tests tab
4. **Use meaningful data** - Make requests with realistic data
5. **Monitor response times** - Check for performance issues
6. **Save responses** - Use Postman's response examples feature

---

## Support

For issues or questions about the API:
1. Check the test results and error messages
2. Review the endpoint documentation above
3. Verify request body format
4. Check authentication tokens are valid

