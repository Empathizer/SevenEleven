import { cookies } from "next/headers";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const url = id ? `http://localhost:5000/api/products/${id}` : `http://localhost:5000/api/products?${searchParams}`;
  
  const res = await fetch(url);
  const data = await res.json();
  return Response.json(data);
}
