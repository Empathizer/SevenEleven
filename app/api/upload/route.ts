import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];
    
    if (!files || files.length === 0) {
      return Response.json({ success: false, message: 'No files uploaded' }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Convert to base64 data URL for storage
      const base64 = buffer.toString('base64');
      const mimeType = file.type || 'image/jpeg';
      const dataUrl = `data:${mimeType};base64,${base64}`;
      
      urls.push(dataUrl);
    }

    return Response.json({ success: true, urls });
  } catch (error: any) {
    console.error('Upload error:', error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
