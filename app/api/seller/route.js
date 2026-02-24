import { cookies } from "next/headers";

export async function GET(req) {
  const token = cookies().get("token")?.value;
  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get("endpoint") || "profile";
  
  const res = await fetch(`http://localhost:5000/api/seller/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return Response.json(data);
}

export async function POST(req) {
  const token = cookies().get("token")?.value;
  const body = await req.json();
  const endpoint = body._endpoint || "products";
  delete body._endpoint;
  
  const res = await fetch(`http://localhost:5000/api/seller/${endpoint}`, {
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
  const { id, _endpoint, ...updateData } = body;
  const endpoint = _endpoint || "profile";
  const url = id ? `http://localhost:5000/api/seller/${endpoint}/${id}` : `http://localhost:5000/api/seller/${endpoint}`;
  
  const res = await fetch(url, {
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

export async function DELETE(req) {
  const token = cookies().get("token")?.value;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  
  const res = await fetch(`http://localhost:5000/api/seller/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const data = await res.json();
  return Response.json(data);
}
