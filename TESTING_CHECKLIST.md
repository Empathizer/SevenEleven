# Complete Testing Checklist - All Changes

## 1. ✅ 20% Profit Model (No Manual Selling Price)

### Test Steps:
1. Login as **approved seller**
2. Go to `/seller/products/new`
3. Select a product from dropdown
4. **Verify:**
   - ✅ No "Selling Price" input field
   - ✅ Shows "Product Price: $X"
   - ✅ Shows "Your Profit per unit: $Y (20%)"
   - ✅ Enter stock quantity (e.g., 5)
   - ✅ Shows "Total Cost: $X × 5"
   - ✅ Shows "Total Profit: $Y × 5"

---

## 2. ✅ Wallet Balance Check (Price × Stock)

### Test Steps:
1. Check seller wallet balance (e.g., $500)
2. Try to add product:
   - Product price: $100
   - Stock: 10 units
   - Total cost: $1000
3. **Verify:**
   - ✅ Error: "Insufficient wallet balance. You need $1000 but have $500"
4. Try with valid amount:
   - Product price: $100
   - Stock: 4 units
   - Total cost: $400
5. **Verify:**
   - ✅ Product added successfully

---

## 3. ✅ Wallet Data Sync (Admin ↔ Seller)

### Test Steps:
1. **Admin adds $1000 to seller wallet:**
   - Go to `/admin/sellers/[id]/wallet`
   - Click "Add Deposit"
   - Amount: $1000
   - Note: "Test deposit"
   - Click "Confirm Deposit"
   
2. **Verify in Admin Panel:**
   - ✅ Wallet Balance shows $1000
   - ✅ Total Earnings shows $1000
   
3. **Verify in Seller Panel:**
   - Login as that seller
   - Go to `/seller` (dashboard)
   - ✅ Wallet Balance shows $1000
   - ✅ Total Earnings shows $1000
   - Go to `/seller/products/new`
   - ✅ Shows "Your Wallet Balance: $1000.00"

4. **Admin deducts $200:**
   - Go to `/admin/sellers/[id]/wallet`
   - Click "Deduct Amount"
   - Amount: $200
   - Note: "Withdrawal"
   - Click "Confirm Deduction"
   
5. **Verify Both Panels:**
   - ✅ Admin shows: Wallet $800
   - ✅ Seller shows: Wallet $800

---

## 4. ✅ Pending Balance Display

### Test Steps:
1. Login as seller
2. Go to `/seller` (dashboard)
3. **Verify:**
   - ✅ Shows "Wallet Balance: $X"
   - ✅ Shows "Pending Balance: $Y"
   - ✅ Shows "Total Earnings: $Z"
   - ✅ Shows "Total Products: N"

---

## 5. ✅ Admin Can Delete Users

### Test Steps:
1. Login as admin
2. Go to `/admin/users`
3. Find a customer or seller (not admin)
4. Click delete button
5. Confirm deletion
6. **Verify:**
   - ✅ User deleted from list
   - ✅ User's products deleted (if seller)
   - ✅ User's orders deleted
   - ✅ Cannot delete admin accounts

---

## 6. ✅ Email Notifications

### Test Steps A: Registration Email
1. Register new seller with temp email
2. **Verify:**
   - ✅ Email received from `support@esellerstore.shop`
   - ✅ Subject: "Seller Registration Received"
   - ✅ Contains store name and pending status

### Test Steps B: Approval Email
1. Admin approves seller
2. **Verify:**
   - ✅ Email received from `support@esellerstore.shop`
   - ✅ Subject: "Your EsellerStore Seller Account Has Been Approved!"
   - ✅ Contains login link and store details

---

## 7. ✅ Product Display on Home Page

### Test Steps:
1. Go to homepage `/`
2. **Verify:**
   - ✅ Categories section shows all categories
   - ✅ Featured Products section shows products
   - ✅ "Just For You" section shows products
   - ✅ Product cards display correctly

---

## 8. ✅ Product Display on Category Pages

### Test Steps:
1. Go to `/products`
2. **Verify:**
   - ✅ Shows all products
   - ✅ Shows product count
3. Click on a category
4. **Verify:**
   - ✅ Filters products by category
   - ✅ Shows correct category name in breadcrumb

---

## 9. ✅ Admin Image Upload

### Test Steps:
1. Login as admin
2. Go to `/admin/products/new`
3. Fill product form
4. Click "Choose File" for images
5. Select 2-3 images
6. **Verify:**
   - ✅ Image previews appear
   - ✅ Shows thumbnails of selected images
7. Submit form
8. **Verify:**
   - ✅ Product created with uploaded images
   - ✅ Images stored in `/public/uploads/`

---

## 10. ✅ Seller Verification Badge

### Test Steps:
1. Login as approved seller
2. **Verify in Sidebar:**
   - ✅ Shows "✓ Verified" badge next to store name
3. Go to `/seller/store`
4. **Verify:**
   - ✅ Shows "Verified" badge at top
   - ✅ Email shows "Verified" badge

---

## Critical Data Sync Test

### Test All Fields Sync Between Admin & Seller:
1. **Admin Panel** (`/admin/sellers`):
   - Wallet Balance
   - Pending Balance
   - Guarantee Money
   - Views (Base/Inc)
   - Credit Score
   - Total Recharge
   - Total Withdrawal

2. **Seller Panel** (`/seller`):
   - Wallet Balance
   - Pending Balance
   - Total Earnings

3. **Test:**
   - Admin changes any value
   - Seller refreshes page
   - ✅ Values match exactly

---

## Quick Test Commands

### Start Development Server:
```bash
cd /Users/ali/Downloads/esellerstore/SevenEleven
npm run dev
```

### Test URLs:
- Home: http://localhost:3000
- Products: http://localhost:3000/products
- Admin: http://localhost:3000/admin
- Seller: http://localhost:3000/seller
- Register: http://localhost:3000/seller/register

---

## Expected Results Summary:

✅ Sellers earn fixed 20% profit (no manual price setting)
✅ Wallet balance checked: balance ≥ (price × stock)
✅ All wallet data synced between admin and seller
✅ Pending balance shown on seller dashboard
✅ Admin can permanently delete users
✅ Email notifications sent on registration and approval
✅ Products display correctly on home and category pages
✅ Admin can upload images for products
✅ Verified badge shown for approved sellers

---

## Known Issues to Verify:

1. ⚠️ Email delivery (check spam folder or use temp email)
2. ⚠️ Image upload on Vercel (may need different storage solution)
3. ⚠️ Pending balance calculation (needs order completion logic)

---

## Environment Variables Required (Vercel):

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_EXPIRE=7d
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_USER=support@esellerstore.shop
EMAIL_PASS=2491p100@N
EMAIL_FROM_NAME=EsellerStore
FRONTEND_URL=https://www.esellerstore.shop
```

---

## Test Priority:

**HIGH PRIORITY:**
1. Wallet sync between admin and seller ⭐⭐⭐
2. Product price calculation (price × stock) ⭐⭐⭐
3. 20% profit model ⭐⭐⭐

**MEDIUM PRIORITY:**
4. Email notifications ⭐⭐
5. Product display on pages ⭐⭐
6. Delete users functionality ⭐⭐

**LOW PRIORITY:**
7. Image upload ⭐
8. Verified badge ⭐

---

Ready to deploy and test! 🚀
