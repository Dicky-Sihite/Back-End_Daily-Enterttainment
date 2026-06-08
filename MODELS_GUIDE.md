# Backend Models Updated - Complete Guide

## Overview
Your backend has been fully updated to match the new PostgreSQL database schema with 14 comprehensive models supporting:
- User authentication & roles
- Multi-type content management
- Subscription & payment system
- Content scheduling
- Bookmarks & history tracking

---

## 📋 Model Reference

### 1. **User Model** (`userModel.js`)
Manages user accounts and authentication.

**Methods:**
- `create(username, email, passwordHash)` - Create new user
- `findById(id)` - Get user by ID
- `findByEmail(email)` - Find user with password hash
- `findByUsername(username)` - Find user by username
- `update(id, data)` - Update user info
- `delete(id)` - Delete user

**Fields:**
```
id, username, email, password_hash, created_at, updated_at
```

---

### 2. **Profile Model** (`profileModel.js`)
Stores user profile information.

**Methods:**
- `upsert(userId, data)` - Insert or update profile
- `findByUserId(userId)` - Get profile by user
- `delete(userId)` - Delete profile

**Fields:**
```
id, user_id, full_name, bio, date_of_birth, gender, phone_number, address, created_at, updated_at
```

---

### 3. **Role Model** (`roleModel.js`)
Manages user roles (admin, user, moderator, etc.).

**Methods:**
- `create(name, slug)` - Create new role
- `findById(id)` - Get role by ID
- `findBySlug(slug)` - Find role by slug
- `findByName(name)` - Find role by name
- `findAll()` - List all roles
- `update(id, data)` - Update role
- `delete(id)` - Delete role

**Fields:**
```
id, name, slug, created_at, updated_at
```

---

### 4. **User Role Model** (`userRoleModel.js`)
Junction table for user-role relationships.

**Methods:**
- `assignRole(userId, roleId)` - Assign role to user
- `removeRole(userId, roleId)` - Remove role from user
- `findByUserId(userId)` - Get all roles for user
- `findByRoleId(roleId)` - Get all users with role
- `hasRole(userId, roleSlug)` - Check if user has role

**Fields:**
```
user_id, role_id, created_at
```

---

### 5. **Refresh Token Model** (`refreshTokenModel.js`)
Manages JWT refresh tokens.

**Methods:**
- `create(userId, token, expiresAt)` - Create refresh token
- `findByToken(token)` - Find token (checks expiry)
- `markAsUsed(token)` - Mark token as used
- `findByUserId(userId)` - Get user's tokens
- `delete(token)` - Delete token
- `deleteByUserId(userId)` - Delete all user's tokens

**Fields:**
```
id, user_id, token, expires_at, is_used, created_at
```

---

### 6. **Content Type Model** (`contentTypeModel.js`)
Defines types of content (music, movie, news, etc.).

**Methods:**
- `create(name, slug)` - Create content type
- `findById(id)` - Get by ID
- `findBySlug(slug)` - Find by slug
- `findByName(name)` - Find by name
- `findAll()` - List all types
- `update(id, data)` - Update type
- `delete(id)` - Delete type

**Fields:**
```
id, name, slug, created_at, updated_at
```

---

### 7. **Content Model** (`contentModel.js`)
Core content management. Updated for new schema!

**Methods:**
- `create(data)` - Create content with userId, contentTypeId, title, slug, description, thumbnail
- `findById(id)` - Get with content type and categories
- `findAll(filters)` - List with filters (status, userId, contentTypeId)
- `update(id, data)` - Update content
- `incrementViews(id)` - Increase view count
- `softDelete(id)` - Mark as deleted
- `delete(id)` - Hard delete

**New in this version:**
- Uses `content_type_id` instead of `category_id`
- Categories via junction table
- Status: draft, published, scheduled, archived
- Published date and view tracking
- Soft delete support

---

### 8. **Category Model** (`categoryModel.js`)
Content categories.

**Methods:**
- `create(name, slug, description)` - Create category
- `findById(id)` - Get by ID
- `findBySlug(slug)` - Find by slug
- `findAll()` - List all
- `update(id, data)` - Update
- `delete(id)` - Delete

**Fields:**
```
id, name, slug, description, created_at, updated_at
```

---

### 9. **Content Category Model** (`contentCategoryModel.js`)
Junction table linking content to multiple categories.

**Methods:**
- `addCategory(contentId, categoryId)` - Add category to content
- `removeCategory(contentId, categoryId)` - Remove category
- `findByContentId(contentId)` - Get all categories for content
- `findByCategoryId(categoryId)` - Get all content in category
- `deleteByContentId(contentId)` - Remove all categories from content

---

### 10. **Music Details Model** (`musicDetailsModel.js`)
Music-specific metadata.

**Methods:**
- `create(contentId, data)` - Create (artist, album, durationSeconds, audioUrl, lyrics)
- `findByContentId(contentId)` - Get music details
- `update(contentId, data)` - Update details
- `delete(contentId)` - Delete

**Fields:**
```
content_id (PK), artist, album, duration_seconds, audio_url, lyrics, created_at, updated_at
```

---

### 11. **Movie Details Model** (`movieDetailsModel.js`)
Movie-specific metadata.

**Methods:**
- `create(contentId, data)` - Create (director, durationSeconds, videoUrl, releaseDate, ageRating)
- `findByContentId(contentId)` - Get movie details
- `update(contentId, data)` - Update details
- `delete(contentId)` - Delete

---

### 12. **News Details Model** (`newsDetailsModel.js`)
News-specific metadata.

**Methods:**
- `create(contentId, data)` - Create (author, body, source, publishedAt)
- `findByContentId(contentId)` - Get news details
- `update(contentId, data)` - Update details
- `delete(contentId)` - Delete

---

### 13. **Plan Model** (`planModel.js`)
Subscription plans.

**Methods:**
- `create(data)` - Create plan (name, slug, price, durationDays, description, isActive)
- `findById(id)` - Get by ID
- `findBySlug(slug)` - Find by slug
- `findAll(activeOnly)` - List plans
- `update(id, data)` - Update plan
- `delete(id)` - Delete plan

**Fields:**
```
id, name, slug, price, duration_days, description, is_active, created_at, updated_at
```

---

### 14. **Subscription Model** (`subscriptionModel.js`)
User subscriptions to plans.

**Methods:**
- `create(data)` - Create (userId, planId, status, startedAt, endsAt, autoRenew)
- `findById(id)` - Get subscription with plan details
- `findByUserId(userId)` - Get all user subscriptions
- `findActiveByUserId(userId)` - Get active subscription
- `update(id, data)` - Update subscription
- `cancel(id)` - Cancel subscription
- `delete(id)` - Delete

**Status:** pending, active, expired, canceled

---

### 15. **Payment Model** (`paymentModel.js`)
Payment transactions.

**Methods:**
- `create(data)` - Create (subscriptionId, amount, paymentMethod, gateway, externalTransactionId)
- `findById(id)` - Get payment
- `findBySubscriptionId(subscriptionId)` - Get subscription payments
- `findByExternalTransactionId(txId)` - Find by transaction ID
- `update(id, data)` - Update payment
- `markAsPaid(id)` - Mark payment completed
- `markAsRefunded(id)` - Mark refunded
- `delete(id)` - Delete

**Status:** pending, paid, failed, refunded

---

### 16. **Bookmark Model** (`bookmarkModel.js`)
User bookmarks. Updated!

**Methods:**
- `addBookmark(userId, contentId)` - Bookmark content
- `removeBookmark(userId, contentId)` - Remove bookmark
- `findByUser(userId)` - Get user's bookmarks with categories
- `isBookmarked(userId, contentId)` - Check if bookmarked

**Changes:**
- Now includes content type and categories in results
- Aggregate queries for better performance

---

### 17. **History Model** (`historyModel.js`)
Viewing history. Updated!

**Methods:**
- `addHistory(userId, contentId)` - Record view
- `findByUser(userId)` - Get view history with categories
- `findByUserAndContent(userId, contentId)` - Get last view
- `clearUserHistory(userId)` - Clear all history

**Changes:**
- Automatic timestamp on views
- Includes content type and categories
- Better query optimization

---

### 18. **Schedule Model** (`scheduleModel.js`)
Content scheduling system.

**Methods:**
- `create(data)` - Create schedule (contentId, createdBy, title, description, poster, scheduleType, dayOfWeek, startTime, endTime, startDatetime, endDatetime, recurrenceRule, status)
- `findById(id)` - Get schedule
- `findByContentId(contentId)` - Get content schedules
- `findByCreatedBy(userId)` - Get user's schedules
- `findActive()` - Get all active schedules
- `update(id, data)` - Update schedule
- `delete(id)` - Delete

**Types:** one_time, weekly, recurring
**Status:** active, inactive, cancelled, done

---

## 🔄 Usage Patterns

### Creating Content with Details

```javascript
// Music Example
const content = await Content.create({
  userId: 1,
  contentTypeId: 1, // Music type ID
  title: "Song Title",
  slug: "song-title",
  description: "Description",
  thumbnail: "url",
  status: "published"
});

const musicDetails = await MusicDetails.create(content.id, {
  artist: "Artist Name",
  album: "Album Name",
  durationSeconds: 240,
  audioUrl: "url",
  lyrics: "lyrics text"
});

// Add categories
await ContentCategory.addCategory(content.id, 1); // Category ID
await ContentCategory.addCategory(content.id, 2);
```

### User Subscription Flow

```javascript
// Create subscription
const subscription = await Subscription.create({
  userId: 1,
  planId: 1,
  status: "pending",
  startedAt: new Date(),
  endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  autoRenew: true
});

// Create payment
const payment = await Payment.create({
  subscriptionId: subscription.id,
  amount: 9.99,
  paymentMethod: "card",
  gateway: "stripe",
  externalTransactionId: "tx_123456",
  status: "pending"
});

// Mark as paid
await Payment.markAsPaid(payment.id);

// Update subscription to active
await Subscription.update(subscription.id, {
  status: "active"
});
```

---

## 📝 Migration Notes

- All old `category_id` references in Content should be replaced with `content_type_id`
- Content categories are now managed via `ContentCategory` junction table
- Update any controller queries to use new model methods
- Import new models as needed in controllers
- All models use consistent async/await pattern
- All models include timestamps (created_at, updated_at)

---

## ✅ Next Steps

1. **Update Controllers** - Import and use new models in your controllers
2. **Update Routes** - Create routes for new features (subscriptions, payments, schedules)
3. **Update Services** - Create service layer for business logic
4. **Test Endpoints** - Use Postman to test all CRUD operations
5. **Middleware** - Add authorization checks for role-based access

