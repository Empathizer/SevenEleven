# How to Add 15 Admin Products

## Quick Steps:

### 1. Start the Server
```bash
cd SevenEleven
npm run dev
```

### 2. Login as Admin
- Open browser: http://localhost:3000/login
- Login with admin credentials

### 3. Add Products via Browser Console

**Method 1: Browser Console (Easiest)**
1. Stay on any admin page (e.g., http://localhost:3000/admin)
2. Press `F12` to open Developer Tools
3. Go to "Console" tab
4. Open file: `add-products-browser.js`
5. Copy ALL the code
6. Paste into console
7. Press Enter
8. Wait 10-15 seconds
9. You'll see: "✅ Successfully added 15/15 products!"

**Method 2: Manual (One by One)**
1. Go to: http://localhost:3000/admin/products/new
2. Fill in the form for each product:
   - Product Name: "Wireless Bluetooth Headphones"
   - Description: "Premium noise-cancelling wireless headphones..."
   - Price: 79.99
   - Stock: 100
   - Category: Select any category
   - Images: Use URL or upload
3. Click "Add to Catalogue"
4. Repeat for all 15 products (see list below)

## Product List:

1. Wireless Bluetooth Headphones - $79.99
2. Smart Watch Pro - $199.99
3. Laptop Backpack - $49.99
4. Portable Power Bank 20000mAh - $34.99
5. Wireless Gaming Mouse - $59.99
6. USB-C Hub Adapter - $39.99
7. Mechanical Keyboard RGB - $89.99
8. Webcam HD 1080p - $69.99
9. Phone Stand Adjustable - $24.99
10. LED Desk Lamp - $44.99
11. Bluetooth Speaker Portable - $54.99
12. Wireless Charger Pad - $29.99
13. Cable Organizer Set - $19.99
14. Screen Protector Tempered Glass - $14.99
15. Laptop Cooling Pad - $39.99

## Verify Products Added:

1. Go to: http://localhost:3000/admin/products
2. You should see all 15 products
3. Go to: http://localhost:3000 (home page)
4. Products should appear on the store front
5. Login as seller and go to: http://localhost:3000/seller/products/new
6. Seller should see all 15 products to add to their store

## Troubleshooting:

**If browser console method fails:**
- Make sure you're logged in as admin
- Check if you have at least one category created
- Try refreshing the page and running again

**If products don't show:**
- Check MongoDB connection
- Verify products were created: Go to /admin/products
- Check browser console for errors
