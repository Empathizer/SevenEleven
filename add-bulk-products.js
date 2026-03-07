const products = {
  "ladies bag": [
    { name: "Leather Crossbody Bag", description: "Elegant leather crossbody bag with adjustable strap", price: 45.99, stock: 50 },
    { name: "Designer Tote Bag", description: "Spacious designer tote bag for everyday use", price: 59.99, stock: 40 },
    { name: "Evening Clutch Purse", description: "Stylish evening clutch with chain strap", price: 35.99, stock: 60 },
    { name: "Canvas Shoulder Bag", description: "Casual canvas shoulder bag with multiple pockets", price: 29.99, stock: 70 },
    { name: "Luxury Handbag", description: "Premium luxury handbag with gold hardware", price: 89.99, stock: 30 }
  ],
  "Watches": [
    { name: "Smart Fitness Watch", description: "Waterproof fitness tracker with heart rate monitor", price: 79.99, stock: 45 },
    { name: "Classic Leather Watch", description: "Elegant leather strap watch with date display", price: 129.99, stock: 35 },
    { name: "Digital Sports Watch", description: "Durable sports watch with stopwatch and alarm", price: 49.99, stock: 60 },
    { name: "Luxury Gold Watch", description: "Premium gold-plated watch with sapphire crystal", price: 299.99, stock: 20 },
    { name: "Minimalist Watch", description: "Modern minimalist design with mesh band", price: 69.99, stock: 50 }
  ],
  "cosmetics": [
    { name: "Matte Lipstick Set", description: "Long-lasting matte lipstick in 6 shades", price: 24.99, stock: 80 },
    { name: "Face Makeup Kit", description: "Complete makeup kit with brushes", price: 49.99, stock: 50 },
    { name: "Eye Shadow Palette", description: "12-color eye shadow palette with mirror", price: 34.99, stock: 60 },
    { name: "Foundation & Concealer", description: "Full coverage foundation with concealer", price: 39.99, stock: 55 },
    { name: "Makeup Brush Set", description: "Professional 10-piece makeup brush set", price: 29.99, stock: 70 }
  ],
  "jewelry": [
    { name: "Sterling Silver Necklace", description: "Elegant sterling silver pendant necklace", price: 54.99, stock: 40 },
    { name: "Gold Plated Earrings", description: "Beautiful gold plated drop earrings", price: 39.99, stock: 60 },
    { name: "Diamond Ring", description: "Stunning cubic zirconia diamond ring", price: 89.99, stock: 30 },
    { name: "Pearl Bracelet", description: "Classic freshwater pearl bracelet", price: 44.99, stock: 50 },
    { name: "Jewelry Gift Set", description: "Matching necklace and earring set", price: 69.99, stock: 35 }
  ],
  "sports": [
    { name: "Yoga Mat Premium", description: "Non-slip yoga mat with carrying strap", price: 34.99, stock: 60 },
    { name: "Resistance Bands Set", description: "5-piece resistance bands for home workout", price: 24.99, stock: 80 },
    { name: "Dumbbell Set", description: "Adjustable dumbbell set 5-25 lbs", price: 79.99, stock: 40 },
    { name: "Running Shoes", description: "Lightweight running shoes with cushioning", price: 69.99, stock: 50 },
    { name: "Sports Water Bottle", description: "Insulated stainless steel water bottle 32oz", price: 19.99, stock: 100 }
  ],
  "mens clothing": [
    { name: "Cotton T-Shirt Pack", description: "3-pack premium cotton t-shirts", price: 39.99, stock: 70 },
    { name: "Denim Jeans", description: "Classic fit denim jeans", price: 59.99, stock: 50 },
    { name: "Formal Dress Shirt", description: "Slim fit formal dress shirt", price: 44.99, stock: 60 },
    { name: "Casual Hoodie", description: "Comfortable fleece hoodie with pockets", price: 49.99, stock: 55 },
    { name: "Leather Jacket", description: "Genuine leather jacket with zipper", price: 149.99, stock: 25 }
  ],
  "ladies clothing": [
    { name: "Summer Dress", description: "Floral print summer dress", price: 44.99, stock: 60 },
    { name: "Skinny Jeans", description: "High-waist skinny jeans", price: 54.99, stock: 50 },
    { name: "Blouse Top", description: "Elegant silk blend blouse", price: 39.99, stock: 65 },
    { name: "Cardigan Sweater", description: "Cozy knit cardigan sweater", price: 49.99, stock: 55 },
    { name: "Maxi Skirt", description: "Flowing maxi skirt with elastic waist", price: 34.99, stock: 70 }
  ],
  "shoes": [
    { name: "Sneakers Casual", description: "Comfortable casual sneakers for daily wear", price: 59.99, stock: 60 },
    { name: "High Heels", description: "Elegant high heel pumps", price: 69.99, stock: 40 },
    { name: "Sandals Summer", description: "Comfortable summer sandals", price: 34.99, stock: 80 },
    { name: "Boots Ankle", description: "Stylish ankle boots with zipper", price: 79.99, stock: 45 },
    { name: "Loafers Leather", description: "Classic leather loafers", price: 64.99, stock: 50 }
  ],
  "perfumes": [
    { name: "Floral Perfume 50ml", description: "Long-lasting floral fragrance", price: 49.99, stock: 50 },
    { name: "Men's Cologne", description: "Masculine woody cologne", price: 54.99, stock: 45 },
    { name: "Luxury Perfume Set", description: "3-piece luxury perfume collection", price: 89.99, stock: 30 },
    { name: "Fresh Citrus Scent", description: "Refreshing citrus fragrance", price: 44.99, stock: 55 },
    { name: "Evening Perfume", description: "Elegant evening fragrance", price: 59.99, stock: 40 }
  ],
  "computers accessories": [
    { name: "Wireless Mouse", description: "Ergonomic wireless mouse with USB receiver", price: 24.99, stock: 100 },
    { name: "Mechanical Keyboard", description: "RGB backlit mechanical gaming keyboard", price: 79.99, stock: 50 },
    { name: "Laptop Stand", description: "Adjustable aluminum laptop stand", price: 34.99, stock: 70 },
    { name: "USB-C Hub", description: "7-in-1 USB-C hub with HDMI and card reader", price: 44.99, stock: 60 },
    { name: "Webcam HD", description: "1080p HD webcam with microphone", price: 54.99, stock: 55 }
  ],
  "mobiles": [
    { name: "Smartphone Pro", description: "Latest smartphone with 128GB storage", price: 699.99, stock: 30 },
    { name: "Budget Phone", description: "Affordable smartphone with dual camera", price: 199.99, stock: 50 },
    { name: "Gaming Phone", description: "High-performance gaming smartphone", price: 549.99, stock: 35 },
    { name: "5G Smartphone", description: "5G enabled smartphone with AMOLED display", price: 799.99, stock: 25 },
    { name: "Flip Phone", description: "Modern flip phone with touchscreen", price: 449.99, stock: 40 }
  ],
  "electronics accessories": [
    { name: "Phone Case", description: "Protective phone case with kickstand", price: 14.99, stock: 150 },
    { name: "Wireless Charger", description: "Fast wireless charging pad", price: 29.99, stock: 80 },
    { name: "Power Bank 20000mAh", description: "High-capacity portable power bank", price: 39.99, stock: 70 },
    { name: "Bluetooth Earbuds", description: "True wireless earbuds with charging case", price: 49.99, stock: 90 },
    { name: "Screen Protector", description: "Tempered glass screen protector", price: 9.99, stock: 200 }
  ],
  "kids toys": [
    { name: "Building Blocks Set", description: "500-piece building blocks for kids", price: 34.99, stock: 60 },
    { name: "Remote Control Car", description: "Fast RC car with rechargeable battery", price: 44.99, stock: 50 },
    { name: "Doll House", description: "3-story doll house with furniture", price: 79.99, stock: 30 },
    { name: "Educational Tablet", description: "Kids learning tablet with games", price: 59.99, stock: 45 },
    { name: "Puzzle Set", description: "4-in-1 jigsaw puzzle set for kids", price: 24.99, stock: 70 }
  ]
};

console.log('Product data prepared. Total categories:', Object.keys(products).length);
console.log('Total products:', Object.values(products).flat().length);
console.log('\nTo add these products:');
console.log('1. Go to https://www.esellerstore.shop/admin/admin-products');
console.log('2. Click "Add Product" for each item');
console.log('3. Or use the API endpoint to bulk insert\n');

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = products;
}
