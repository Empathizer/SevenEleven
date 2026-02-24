import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function PUT(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;
  
  const body = await req.json();
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  
  const controller = await import('@/server/controllers/advancedSellerController');
  
  const mockReq = { user, body, params: { id: body.id } };
  const mockRes = {
    status: (code) => ({
      json: (data) => Response.json(data, { status: code })
    }),
    json: (data) => Response.json(data)
  };

  try {
    if (action === 'package') return await controller.setSellerPackage(mockReq, mockRes);
    if (action === 'salesman') return await controller.setSellerSalesman(mockReq, mockRes);
    if (action === 'views') return await controller.setSellerViews(mockReq, mockRes);
    if (action === 'guarantee') return await controller.setSellerGuarantee(mockReq, mockRes);
    
    return Response.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;
  
  const body = await req.json();
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  
  const controller = await import('@/server/controllers/advancedSellerController');
  
  const mockReq = { user, body, params: { id: body.id } };
  const mockRes = {
    status: (code) => ({
      json: (data) => Response.json(data, { status: code })
    }),
    json: (data) => Response.json(data)
  };

  try {
    if (action === 'message') return await controller.sendMessageToSeller(mockReq, mockRes);
    if (action === 'balance') return await controller.adjustSellerBalance(mockReq, mockRes);
    
    return Response.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
