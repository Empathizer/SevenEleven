import { createOrder, getOrders, getOrder, updateOrderStatus } from '../../controllers/orderController';
import { protect, authorize } from '../../middleware/auth';
import { NextRequest, NextResponse } from 'next/server';

async function withAuth(req, handler, roles = []) {
  try {
    const authResult = await protect(req);
    if (!authResult.success) {
      return NextResponse.json(authResult, { status: 401 });
    }
    
    if (roles.length > 0) {
      const authzResult = await authorize(roles)(req);
      if (!authzResult.success) {
        return NextResponse.json(authzResult, { status: 403 });
      }
    }
    
    return handler(req);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  return withAuth(req, async (req) => {
    const body = await req.json();
    return createOrder(req, body);
  }, ['customer']);
}

export async function GET(req) {
  return withAuth(req, async (req) => {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    switch (action) {
      case 'single':
        if (!id) {
          return NextResponse.json({ success: false, message: 'Order ID required' }, { status: 400 });
        }
        return getOrder(req, id);
      case 'all':
      default:
        return getOrders(req);
    }
  });
}

export async function PUT(req) {
  return withAuth(req, async (req) => {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (action === 'status' && id) {
      return updateOrderStatus(req, id, body);
    }

    return NextResponse.json({ success: false, message: 'Invalid action or missing ID' }, { status: 400 });
  }, ['admin', 'seller']);
}