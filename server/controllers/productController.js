const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getProducts = async (req, res) => {
  try {
    const { category, search, featured, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) query.categoryId = cat._id;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    const products = await Product.find(query)
      .populate('categoryId', 'name slug')
      .populate('sellerId', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt');

    const count = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId', 'name slug')
      .populate('sellerId', 'name');
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({ categoryId: cat._id });
        return {
          ...cat.toObject(),
          productCount
        };
      })
    );

    res.json({ success: true, categories: categoriesWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
