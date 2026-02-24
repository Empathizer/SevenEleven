import { cookies } from "next/headers";

export async function POST(req) {
  const body = await req.json();
  const endpoint = body._endpoint || "login";
  delete body._endpoint;

  const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  
  if (data.token) {
    cookies().set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60
    });
  }

  return Response.json(data);
}

export async function GET() {
  const token = cookies().get("token")?.value;
  
  const res = await fetch("http://localhost:5000/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  return Response.json(data);
}
