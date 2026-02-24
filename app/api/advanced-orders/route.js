import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;
  
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const action = searchParams.get('action');
  
  const controller = await import('@/server/controllers/advancedOrderController');
  
  const mockReq = { user, params: { id }, query: Object.fromEntries(searchParams) };
  const mockRes = {
    status: (code) => ({
      json: (data) => Response.json(data, { status: code })
    }),
    json: (data) => Response.json(data)
  };

  try {
    if (id && action === 'receipt') {
      return await controller.generateReceipt(mockReq, mockRes);
    } else if (id) {
      return await controller.getOrderById(mockReq, mockRes);
    } else {
      return await controller.getOrders(mockReq, mockRes);
    }
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;
  
  const body = await req.json();
  const { updateOrderStatus } = await import('@/server/controllers/advancedOrderController');
  
  const mockReq = { user, body, params: { id: body.id } };
  const mockRes = {
    status: (code) => ({
      json: (data) => Response.json(data, { status: code })
    }),
    json: (data) => Response.json(data)
  };

  try {
    return await updateOrderStatus(mockReq, mockRes);
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;
  
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  const { deleteOrder } = await import('@/server/controllers/advancedOrderController');
  
  const mockReq = { user, params: { id } };
  const mockRes = {
    status: (code) => ({
      json: (data) => Response.json(data, { status: code })
    }),
    json: (data) => Response.json(data)
  };

  try {
    return await deleteOrder(mockReq, mockRes);
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
