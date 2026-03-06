#!/usr/bin/env node

/**
 * Add Admin Products via API
 * 
 * Instructions:
 * 1. Start server: npm run dev
 * 2. Login as admin in browser
 * 3. Open browser console (F12)
 * 4. Copy and paste this entire script
 * 5. Press Enter
 */

const API_URL = 'http://localhost:3000';

const products = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.",
    price: 79.99,
    stock: 100,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"]
  },
  {
    name: "Smart Watch Pro",
    description: "Advanced fitness tracker with heart rate monitor, GPS, and waterproof design.",
    price: 199.99,
    stock: 75,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop"]
  },
  {
    name: "Laptop Backpack",
    description: "Durable water-resistant backpack with USB charging port and multiple compartments.",
    price: 49.99,
    stock: 150,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"]
  },
  {
    name: "Portable Power Bank 20000mAh",
    description: "High-capacity power bank with fast charging and dual USB ports.",
    price: 34.99,
    stock: 200,
    images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop"]
  },
  {
    name: "Wireless Gaming Mouse",
    description: "Ergonomic gaming mouse with RGB lighting and programmable buttons.",
    price: 59.99,
    stock: 120,
    images: ["https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=600&fit=crop"]
  },
  {
    name: "USB-C Hub Adapter",
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery.",
    price: 39.99,
    stock: 180,
    images: ["https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop"]
  },
  {
    name: "Mechanical Keyboard RGB",
    description: "Professional mechanical keyboard with customizable RGB backlighting.",
    price: 89.99,
    stock: 90,
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop"]
  },
  {
    name: "Webcam HD 1080p",
    description: "Full HD webcam with auto-focus and built-in microphone for video calls.",
    price: 69.99,
    stock: 110,
    images: ["https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&h=600&fit=crop"]
  },
  {
    name: "Phone Stand Adjustable",
    description: "Aluminum alloy phone holder with 360-degree rotation and adjustable height.",
    price: 24.99,
    stock: 250,
    images: ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop"]
  },
  {
    name: "LED Desk Lamp",
    description: "Modern LED desk lamp with touch control and adjustable brightness levels.",
    price: 44.99,
    stock: 140,
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop"]
  },
  {
    name: "Bluetooth Speaker Portable",
    description: "Waterproof portable speaker with 360-degree sound and 12-hour battery.",
    price: 54.99,
    stock: 160,
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop"]
  },
  {
    name: "Wireless Charger Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    price: 29.99,
    stock: 220,
    images: ["https://images.unsplash.com/photo-1591290619762-c588f0e8e23f?w=600&h=600&fit=crop"]
  },
  {
    name: "Cable Organizer Set",
    description: "Complete cable management solution with clips, sleeves, and ties.",
    price: 19.99,
    stock: 300,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop"]
  },
  {
    name: "Screen Protector Tempered Glass",
    description: "Premium tempered glass screen protector with anti-scratch coating.",
    price: 14.99,
    stock: 350,
    images: ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop"]
  },
  {
    name: "Laptop Cooling Pad",
    description: "Ergonomic cooling pad with 6 fans and adjustable height settings.",
    price: 39.99,
    stock: 130,
    images: ["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=600&fit=crop"]
  }
];

async function addProducts() {
  console.log('🚀 Starting to add products...\n');
  
  // Get categories first
  const catRes = await fetch(`${API_URL}/api/admin/categories`, { credentials: 'include' });
  const catData = await catRes.json();
  const categoryId = catData.categories?.[0]?._id;
  
  if (!categoryId) {
    console.error('❌ No category found. Please create a category first.');
    return;
  }
  
  console.log(`✅ Using category ID: ${categoryId}\n`);
  
  let added = 0;
  for (const product of products) {
    try {
      const res = await fetch(`${API_URL}/api/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...product,
          categoryId,
          buyingPrice: 0,
          sellerId: null
        })
      });
      
      if (res.ok) {
        added++;
        console.log(`✅ ${added}. Added: ${product.name}`);
      } else {
        console.log(`❌ Failed: ${product.name}`);
      }
    } catch (e) {
      console.log(`❌ Error: ${product.name}`);
    }
  }
  
  console.log(`\n✅ Successfully added ${added}/${products.length} products!`);
  console.log('🔄 Refresh the page to see the products.');
}

addProducts();
