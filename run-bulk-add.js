#!/usr/bin/env node

const products = require('./add-bulk-products.js');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://www.esellerstore.shop';

// Category mapping - you'll need to get actual category IDs from your database
const categoryMapping = {
  "ladies bag": "ladies bag",
  "Watches": "watches",
  "cosmetics": "cosmetics",
  "jewelry": "jewelry",
  "sports": "sports",
  "mens clothing": "mens clothing",
  "ladies clothing": "ladies clothing",
  "shoes": "shoes",
  "perfumes": "perfumes",
  "computers accessories": "computers accessories",
  "mobiles": "mobiles",
  "electronics accessories": "electronics accessories",
  "kids toys": "kids toys"
};

// Placeholder image URLs (you can replace with actual product images)
const getPlaceholderImages = (category) => {
  return [
    `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(category)}`,
    `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(category)}+2`
  ];
};

async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/api/admin/categories`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

async function addProduct(productData, categoryId) {
  try {
    const response = await fetch(`${API_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        ...productData,
        categoryId,
        sellerId: null,
        buyingPrice: 0,
        images: productData.images,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviewCount: Math.floor(Math.random() * 500) + 50,
        soldCount: Math.floor(Math.random() * 1000) + 100
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to add product:', error);
    return { success: false, error: error.message };
  }
}

async function bulkAddProducts() {
  console.log('Starting bulk product addition...\n');
  
  // First, get all categories
  const categories = await getCategories();
  console.log(`Found ${categories.length} categories\n`);

  let successCount = 0;
  let failCount = 0;

  for (const [categoryName, productList] of Object.entries(products)) {
    console.log(`\nProcessing category: ${categoryName}`);
    
    // Find matching category ID
    const category = categories.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (!category) {
      console.log(`  ⚠️  Category "${categoryName}" not found in database. Skipping...`);
      failCount += productList.length;
      continue;
    }

    console.log(`  Found category ID: ${category._id}`);

    for (const product of productList) {
      const productData = {
        ...product,
        images: getPlaceholderImages(categoryName)
      };

      const result = await addProduct(productData, category._id);
      
      if (result.success) {
        console.log(`  ✓ Added: ${product.name}`);
        successCount++;
      } else {
        console.log(`  ✗ Failed: ${product.name} - ${result.message || result.error}`);
        failCount++;
      }

      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Bulk addition complete!`);
  console.log(`Success: ${successCount} products`);
  console.log(`Failed: ${failCount} products`);
  console.log('='.repeat(50));
}

// Run the script
bulkAddProducts().catch(console.error);
