import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  
  return Response.json(
    { success: true, message: 'Logged out' },
    { 
      status: 200,
      headers: {
        'Set-Cookie': 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax'
      }
    }
  );
}
