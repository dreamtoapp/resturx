import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';
import cloudinary from 'cloudinary';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { table, recordId, field, publicId, url, index } = body as {
      table: 'company';
      recordId: string;
      field: 'heroSlides' | 'heroImages';
      publicId?: string;
      url?: string;
      index?: number;
    };

    if (table !== 'company' || !recordId || !field) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // 1) Delete from Cloudinary if publicId provided
    if (publicId) {
      try {
        await cloudinary.v2.uploader.destroy(publicId);
      } catch (err) {
        return NextResponse.json({ error: 'Cloudinary delete failed' }, { status: 502 });
      }
    }

    // 2) Update DB array field
    if (field === 'heroSlides') {
      // Remove by publicId if provided, else by URL, else by index
      const company = await db.company.findUnique({ where: { id: recordId } });
      if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 });
      const slides = Array.isArray((company as any).heroSlides) ? ((company as any).heroSlides as any[]) : [];
      let nextSlides = slides;
      if (publicId) nextSlides = slides.filter((s) => s?.publicId !== publicId);
      else if (url) nextSlides = slides.filter((s) => s?.url !== url);
      else if (typeof index === 'number') nextSlides = slides.filter((_, i) => i !== index);

      await db.company.update({ where: { id: recordId }, data: { heroSlides: nextSlides as any } });
    } else if (field === 'heroImages') {
      const company = await db.company.findUnique({ where: { id: recordId } });
      if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 });
      const images = Array.isArray((company as any).heroImages) ? ((company as any).heroImages as string[]) : [];
      let nextImages = images;
      if (url) nextImages = images.filter((u) => u !== url);
      else if (typeof index === 'number') nextImages = images.filter((_, i) => i !== index);

      await db.company.update({ where: { id: recordId }, data: { heroImages: nextImages } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


