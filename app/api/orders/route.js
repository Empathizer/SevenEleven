import { cookies } from "next/headers";

export async function GET(req) {
  const token = cookies().get("token")?.value;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const url = id ? `http://localhost:5000/api/orders/${id}` : `http://localhost:5000/api/orders`;
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return Response.json(data);
}

export async function POST(req) {
  const token = cookies().get("token")?.value;
  const body = await req.json();
  
  const res = await fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  
  const data = await res.json();
  return Response.json(data);
}

export async function PUT(req) {
  const token = cookies().get("token")?.value;
  const body = await req.json();
  const { id, ...updateData } = body;
  
  const res = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updateData)
  });
  
  const data = await res.json();
  return Response.json(data);
}
