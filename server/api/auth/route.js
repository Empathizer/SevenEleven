import { register, login, getMe, logout } from '../../controllers/authController';
import { protect } from '../../middleware/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'register':
        return register(req, body);
      case 'login':
        return login(req, body);
      case 'logout':
        return logout(req);
      default:
        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    if (action === 'me') {
      const authResult = await protect(req);
      if (!authResult.success) {
        return NextResponse.json(authResult, { status: 401 });
      }
      return getMe(req);
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}