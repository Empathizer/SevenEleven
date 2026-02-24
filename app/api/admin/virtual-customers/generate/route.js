import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/api-helper';

export async function POST(req) {
  await connectDB();
  
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;
  
  const body = await req.json();
  
  try {
    const { faker } = require('@faker-js/faker');
    const bcrypt = require('bcryptjs');
    const User = (await import('@/server/models/User')).default;
    
    const { count = 1, initialBalance = 0 } = body;
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
        address: faker.location.streetAddress(),
        walletBalance: initialBalance
      });
      customers.push(customer);
    }
    
    return Response.json({ success: true, customers, message: `${count} virtual customer(s) created` });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
