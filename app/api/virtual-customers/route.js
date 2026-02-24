import { cookies } from "next/headers";

export async function GET() {
  const token = cookies().get("token")?.value;
  
  const res = await fetch("http://localhost:5000/api/virtual-customers", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return Response.json(data);
}

export async function POST(req) {
  const token = cookies().get("token")?.value;
  const body = await req.json();
  const { id, action, ...postData } = body;
  
  let url = "http://localhost:5000/api/virtual-customers/generate";
  if (action === "login-as" && id) {
    url = `http://localhost:5000/api/virtual-customers/login-as/${id}`;
  }
  
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(postData)
  });
  
  const data = await res.json();
  return Response.json(data);
}
