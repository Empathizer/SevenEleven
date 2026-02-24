import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/api-helper';

export async function GET(req) {
  await connectDB();
  
  const { error, user } = await requireAuth(req, 'admin');
  if (error) return error;
  
  try {
    const User = (await import('@/server/models/User')).default;
    const customers = await User.find({ role: 'customer', isVirtual: true }).select('-password');
    return Response.json({ success: true, customers, data: customers });
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
  
  try {
    if (action === 'generate') {
      const { faker } = require('@faker-js/faker');
      const bcrypt = require('bcryptjs');
      const User = (await import('@/server/models/User')).default;
      
      const { count = 1 } = body;
      const customers = [];
      
      for (let i = 0; i < count; i++) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const customer = await User.create({
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          password: hashedPassword,
          role: 'customer',
          status: 'active',
          isVirtual: true,
          address: faker.location.streetAddress()
        });
        customers.push(customer);
      }
      
      return Response.json({ success: true, customers, message: `${count} virtual customer(s) created` });
    }
    
    return Response.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
