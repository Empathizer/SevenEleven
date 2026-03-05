# Seller Data Synchronization Implementation

## Overview
This document describes the implementation of seller data synchronization between the admin panel and seller pages, ensuring that any changes made by admins are immediately reflected in the seller's view.

## Problem Statement
Previously, when admins edited seller information from the admin panel, the changes were only saved to the User model, but not synchronized with the Seller model. This caused inconsistencies where:
- Seller data displayed in admin panel didn't match seller's own view
- Updates to financial data (wallet, pending balance) weren't reflected properly
- Seller-specific fields (store name, description, etc.) weren't synced between models

## Solution Architecture

### Database Models
The system uses two models for seller data:
1. **User Model** - Primary source for authentication and financial data
2. **Seller Model** - Seller-specific information and verification data

### Synchronized Fields
The following fields are now synchronized between both models:

**Financial Fields:**
- `walletBalance`
- `pendingBalance`
- `guaranteeMoney`
- `totalRecharge`
- `totalWithdrawn`
- `totalEarnings`

**Profile Fields:**
- `storeName`
- `storeDescription`
- `address`
- `phone`
- `idType`
- `idNumber`
- `idImage`
- `invitationCode`

**Settings Fields:**
- `package`
- `salesman`
- `creditScore`
- `viewsBase`
- `viewsInc`
- `commentPermission`
- `homeDisplay`

## Implementation Details

### 1. API Endpoints Updated

#### `/app/api/admin/users/[id]/route.js`
- **PUT method**: Now syncs changes to Seller model when updating a seller user
- Automatically detects if user is a seller and updates corresponding Seller record
- Ensures both models stay in sync

#### `/app/api/admin/sellers/[id]/route.js`
- **PUT method**: Now syncs changes back to User model
- Updates User model with financial and settings data
- Maintains bidirectional synchronization

#### `/app/api/seller/wallet/route.js`
- **GET method**: Fetches and merges data from both User and Seller models
- Prioritizes User model for financial data
- Returns comprehensive seller information

#### `/app/api/seller/profile/route.js`
- **GET method**: Merges data from both models for complete profile view
- **PUT method**: Updates both models when seller edits their profile
- Ensures consistency across all seller data

### 2. Database Schema Updates

#### User Model (`/server/models/User.js`)
Added seller-specific fields:
- `storeName` - Seller's store name
- `storeDescription` - Store description
- `idType` - ID document type
- `idNumber` - ID document number
- `idImage` - ID document image URL
- `invitationCode` - Seller invitation code

### 3. Admin Panel Updates

#### `/app/admin/sellers/page.tsx`
- Edit dialog now updates both models through the unified API
- Real-time field updates trigger data refresh
- All changes are immediately reflected in the seller list

## Data Flow

### Admin Edits Seller Info:
```
Admin Panel → PUT /api/admin/users/[id] → Update User Model → Sync to Seller Model → Refresh UI
```

### Admin Edits via Seller Route:
```
Admin Panel → PUT /api/admin/sellers/[id] → Update Seller Model → Sync to User Model → Refresh UI
```

### Seller Views Their Data:
```
Seller Page → GET /api/seller/wallet or /api/seller/profile → Merge User + Seller Data → Display
```

## Benefits

1. **Data Consistency**: All seller information is synchronized across both models
2. **Real-time Updates**: Changes made by admins are immediately visible to sellers
3. **Bidirectional Sync**: Updates can be made through either User or Seller endpoints
4. **Backward Compatible**: Existing code continues to work while benefiting from sync
5. **Single Source of Truth**: User model is prioritized for financial data

## Testing Checklist

- [ ] Edit seller info from admin panel and verify it appears on seller dashboard
- [ ] Update wallet balance and confirm it reflects in seller's wallet view
- [ ] Change store name and verify it updates in both admin and seller views
- [ ] Modify guarantee money and check synchronization
- [ ] Update views settings and confirm they're reflected
- [ ] Test package and salesman assignments
- [ ] Verify pending balance updates are synced
- [ ] Check that seller profile edits sync to admin view

## API Reference

### Update Seller (Admin)
```javascript
PUT /api/admin/users/[userId]
Body: {
  storeName: "New Store Name",
  walletBalance: 1000,
  guaranteeMoney: 500,
  // ... other fields
}
```

### Update Seller via Seller Route (Admin)
```javascript
PUT /api/admin/sellers/[sellerId]
Body: {
  walletBalance: 1000,
  pendingBalance: 200,
  // ... other fields
}
```

### Get Seller Wallet (Seller)
```javascript
GET /api/seller/wallet
Response: {
  success: true,
  data: {
    walletBalance: 1000,
    pendingBalance: 200,
    totalEarnings: 5000,
    totalWithdrawn: 3000,
    // ... merged data from both models
  }
}
```

### Get Seller Profile (Seller)
```javascript
GET /api/seller/profile
Response: {
  success: true,
  data: {
    storeName: "My Store",
    storeDescription: "...",
    walletBalance: 1000,
    // ... complete merged profile
  }
}
```

## Maintenance Notes

- Always update both models when adding new seller-related fields
- Prioritize User model for financial and authentication data
- Use Seller model for verification and store-specific information
- Test synchronization after any schema changes
- Monitor for data inconsistencies and add sync logic as needed

## Future Improvements

1. Add database triggers for automatic synchronization
2. Implement event-driven architecture for real-time updates
3. Add audit logging for all seller data changes
4. Create a data migration script to sync existing records
5. Add validation to prevent data conflicts
