# Backend Models Index

## All Models Created/Updated ✅

### 1️⃣ Authentication & Users (5 Models)
| Model | File | Purpose |
|-------|------|---------|
| User | `userModel.js` | User account management |
| Profile | `profileModel.js` | User profile information |
| Role | `roleModel.js` | Role definitions |
| UserRole | `userRoleModel.js` | User-role assignments |
| RefreshToken | `refreshTokenModel.js` | JWT token management |

### 2️⃣ Content Management (5 Models)
| Model | File | Purpose |
|-------|------|---------|
| ContentType | `contentTypeModel.js` | Content type definitions |
| Content | `contentModel.js` | **[UPDATED]** Core content with new schema |
| Category | `categoryModel.js` | Content categories |
| ContentCategory | `contentCategoryModel.js` | Content-category junction |
| Bookmark | `bookmarkModel.js` | **[UPDATED]** User bookmarks |

### 3️⃣ Content Details (3 Models)
| Model | File | Purpose |
|-------|------|---------|
| MusicDetails | `musicDetailsModel.js` | Music metadata |
| MovieDetails | `movieDetailsModel.js` | Movie metadata |
| NewsDetails | `newsDetailsModel.js` | News metadata |

### 4️⃣ Subscriptions & Payments (3 Models)
| Model | File | Purpose |
|-------|------|---------|
| Plan | `planModel.js` | Subscription plans |
| Subscription | `subscriptionModel.js` | User subscriptions |
| Payment | `paymentModel.js` | Payment transactions |

### 5️⃣ Engagement & Scheduling (2 Models)
| Model | File | Purpose |
|-------|------|---------|
| History | `historyModel.js` | **[UPDATED]** View history |
| Schedule | `scheduleModel.js` | Content scheduling |

---

## Quick Import Guide

```javascript
// Authentication Models
const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const Role = require('../models/roleModel');
const UserRole = require('../models/userRoleModel');
const RefreshToken = require('../models/refreshTokenModel');

// Content Models
const ContentType = require('../models/contentTypeModel');
const Content = require('../models/contentModel');
const Category = require('../models/categoryModel');
const ContentCategory = require('../models/contentCategoryModel');
const Bookmark = require('../models/bookmarkModel');

// Content Details Models
const MusicDetails = require('../models/musicDetailsModel');
const MovieDetails = require('../models/movieDetailsModel');
const NewsDetails = require('../models/newsDetailsModel');

// Subscription Models
const Plan = require('../models/planModel');
const Subscription = require('../models/subscriptionModel');
const Payment = require('../models/paymentModel');

// Engagement Models
const History = require('../models/historyModel');
const Schedule = require('../models/scheduleModel');
```

---

## Database Relationship Diagram

```
users (PK: id)
├── profiles (FK: user_id)
├── user_roles (FK: user_id)
│   └── roles (FK: role_id)
├── refresh_tokens (FK: user_id)
├── contents (FK: user_id)
│   ├── content_types (FK: content_type_id)
│   ├── content_categories (FK: content_id)
│   │   └── categories (FK: category_id)
│   ├── music_details (FK: content_id)
│   ├── movie_details (FK: content_id)
│   ├── news_details (FK: content_id)
│   ├── bookmarks (FK: content_id)
│   ├── histories (FK: content_id)
│   └── schedules (FK: content_id)
├── subscriptions (FK: user_id, plan_id)
│   ├── plans (FK: plan_id)
│   └── payments (FK: subscription_id)
└── schedules (FK: created_by)
```

---

## Model Method Patterns

All models follow consistent patterns:

### **Create**
```javascript
const Model = require('../models/modelName');
const result = await Model.create(data);
```

### **Read**
```javascript
const item = await Model.findById(id);
const items = await Model.findAll();
const item = await Model.findBySpecificField(value);
```

### **Update**
```javascript
const updated = await Model.update(id, data);
```

### **Delete**
```javascript
await Model.delete(id);
```

### **Special Operations**
- `Content.softDelete(id)` - Mark as deleted without removing
- `Content.incrementViews(id)` - Increase view count
- `UserRole.hasRole(userId, roleSlug)` - Check role
- `RefreshToken.markAsUsed(token)` - Token management
- `Subscription.cancel(id)` - Cancel subscription
- `Payment.markAsPaid(id)` - Payment confirmation

---

## Status Fields

### Content Status
- `draft` - Not published
- `published` - Publicly visible
- `scheduled` - Will publish later
- `archived` - Hidden from view

### Subscription Status
- `pending` - Awaiting activation
- `active` - Currently active
- `expired` - Subscription ended
- `canceled` - User cancelled

### Payment Status
- `pending` - Awaiting processing
- `paid` - Successfully paid
- `failed` - Payment failed
- `refunded` - Refunded to user

### Schedule Status
- `active` - Currently scheduled
- `inactive` - Not scheduled
- `cancelled` - Cancelled by user
- `done` - Schedule completed

---

## Database Indexes

Automatically created indexes for performance:

```sql
-- Content Indexes
idx_contents_user_id (for filtering by creator)
idx_contents_content_type_id (for filtering by type)
idx_contents_status (for filtering by status)

-- Subscription Indexes
idx_subscriptions_user_id (for user lookups)
idx_subscriptions_plan_id (for plan lookups)
idx_subscriptions_status (for status filtering)

-- Bookmark & History Indexes
idx_bookmarks_user_id (for user lookups)
idx_bookmarks_content_id (for content lookups)
idx_histories_user_id (for user lookups)
idx_histories_content_id (for content lookups)

-- Category Indexes
idx_content_categories_category_id (for category lookups)

-- Schedule Indexes
idx_schedules_content_id (for content lookups)
idx_schedules_created_by (for creator lookups)
idx_schedules_status (for status filtering)

-- Payment Indexes
idx_payments_subscription_id (for subscription lookups)
idx_payments_status (for status filtering)
```

---

## Next Steps for Implementation

1. ✅ Models Created
2. 🔄 Create Controllers - Use these models in your controllers
3. 🔄 Create Services - Implement business logic
4. 🔄 Update Routes - Add endpoints for all CRUD operations
5. 🔄 Test Endpoints - Use Postman to test
6. 🔄 Deploy - Push to production

---

**Last Updated:** May 24, 2026  
**Total Models:** 18  
**Total Methods:** 100+  
**Status:** ✅ Ready for Controller Implementation
