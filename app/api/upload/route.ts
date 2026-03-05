import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];
    
    if (!files || files.length === 0) {
      return Response.json({ success: false, message: 'No files uploaded' }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      const filepath = join(uploadDir, filename);
      
      await writeFile(filepath, buffer);
      urls.push(`/uploads/${filename}`);
    }

    return Response.json({ success: true, urls });
  } catch (error: any) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
