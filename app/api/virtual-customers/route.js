import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;
  
  const { getVirtualCustomers } = await import('@/server/controllers/virtualCustomerController');
  
  const mockReq = { user };
  const mockRes = {
    status: (code) => ({
      json: (data) => Response.json(data, { status: code })
    }),
    json: (data) => Response.json(data)
  };

  try {
    return await getVirtualCustomers(mockReq, mockRes);
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
  
  const controller = await import('@/server/controllers/virtualCustomerController');
  
  const mockReq = { user, body, params: { id: body.id } };
  const mockRes = {
    status: (code) => ({
      json: (data) => Response.json(data, { status: code })
    }),
    json: (data) => Response.json(data),
    cookie: (name, value, options) => {
      const { cookies } = require('next/headers');
      cookies().set(name, value, options);
    }
  };

  try {
    if (action === 'generate') {
      return await controller.generateVirtualCustomers(mockReq, mockRes);
    } else if (action === 'login-as') {
      return await controller.loginAsUser(mockReq, mockRes);
    }
    
    return Response.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
