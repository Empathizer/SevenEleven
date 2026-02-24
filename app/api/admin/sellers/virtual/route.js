import { requireAuth } from '@/lib/api-helper';
import connectDB from '@/lib/db';

export async function POST(req) {
  await connectDB();
  const { error } = await requireAuth(req, 'admin');
  if (error) return error;

  try {
    const User = (await import('@/server/models/User')).default;
    const Seller = (await import('@/server/models/Seller')).default;
    const bcrypt = require('bcryptjs');
    const { faker } = require('@faker-js/faker');

    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const username = faker.internet.email().split('@')[0];
    const email = `${username}@${randomDomain}`;
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    const invitationCode = 'INV' + Math.random().toString(36).substr(2, 8).toUpperCase();
    
    const user = await User.create({
      name: faker.company.name(),
      email,
      password: hashedPassword,
      role: 'seller',
      status: 'active',
      isVirtual: true
    });

    const seller = await Seller.create({
      userId: user._id,
      storeName: faker.company.name(),
      storeDescription: faker.company.catchPhrase(),
      status: 'approved',
      invitationCode,
      idType: 'CNIC',
      idNumber: faker.string.numeric(13),
      address: faker.location.streetAddress()
    });

    return Response.json({ 
      success: true, 
      seller, 
      user,
      invitationCode,
      message: 'Virtual seller created successfully' 
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
