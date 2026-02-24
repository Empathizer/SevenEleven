import { cookies } from "next/headers";

export async function GET() {
  const token = cookies().get("token")?.value;
  
  const res = await fetch("http://localhost:5000/api/messages", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return Response.json(data);
}

export async function PUT(req) {
  const token = cookies().get("token")?.value;
  const body = await req.json();
  const { id } = body;
  
  const res = await fetch(`http://localhost:5000/api/messages/${id}/read`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const data = await res.json();
  return Response.json(data);
}
