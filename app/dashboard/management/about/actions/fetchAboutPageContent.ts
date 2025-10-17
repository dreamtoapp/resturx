'use server';

import db from '@/lib/prisma';

export async function fetchAboutPageContent() {
  try {
    const aboutPage = await db.aboutPageContent.findFirst();
    return aboutPage;
  } catch (error) {
    console.error('Error fetching about page content:', error);
    return null;
  }
}














