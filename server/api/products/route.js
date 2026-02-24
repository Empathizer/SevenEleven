import { getProducts, getProduct, getCategories } from '../../controllers/productController';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    switch (action) {
      case 'categories':
        return getCategories(req);
      case 'single':
        if (!id) {
          return NextResponse.json({ success: false, message: 'Product ID required' }, { status: 400 });
        }
        return getProduct(req, id);
      case 'all':
      default:
        return getProducts(req);
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}