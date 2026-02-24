import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;
  
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  
  const controller = await import('@/server/controllers/sellerController');
  
  const mockReq = { user, query: Object.fromEntries(searchParams) };
  const mockRes = {
    status: (code) => ({
      json: (data) => Response.json(data, { status: code })
    }),
    json: (data) => Response.json(data)
  };

  try {
    if (action === 'profile') return await controller.getProfile(mockReq, mockRes);
    if (action === 'products') return await controller.getProducts(mockReq, mockRes);
    if (action === 'orders') return await controller.getOrders(mockReq, mockRes);
    if (action === 'wallet') return await controller.getWallet(mockReq, mockRes);
    if (action === 'transactions') return await controller.getTransactions(mockReq, mockRes);
    
    return Response.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;
  
  const body = await req.json();
  const { createProduct } = await import('@/server/controllers/sellerController');
  
  const mockReq = { user, body };
  const mockRes = {
    status: (code) => ({
      json: (data) => Response.json(data, { status: code })
    }),
    json: (data) => Response.json(data)
  };

  try {
    return await createProduct(mockReq, mockRes);
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;
  
  const body = await req.json();
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  
  const controller = await import('@/server/controllers/sellerController');
  
  const mockReq = { user, body, params: { id: body.id } };
  const mockRes = {
    status: (code) => ({
      json: (data) => Response.json(data, { status: code })
    }),
    json: (data) => Response.json(data)
  };

  try {
    if (action === 'profile') return await controller.updateProfile(mockReq, mockRes);
    if (action === 'product') return await controller.updateProduct(mockReq, mockRes);
    
    return Response.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'seller');
  if (error) return error;
  
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  const { deleteProduct } = await import('@/server/controllers/sellerController');
  
  const mockReq = { user, params: { id } };
  const mockRes = {
    status: (code) => ({
      json: (data) => Response.json(data, { status: code })
    }),
    json: (data) => Response.json(data)
  };

  try {
    return await deleteProduct(mockReq, mockRes);
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
