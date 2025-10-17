'use server';

import { saveSocialMedia as baseSaveSocialMedia } from '@/app/dashboard/management/settings/actions/saveSocialMedia';
import { revalidatePath } from 'next/cache';

export async function saveSocialMedia(input: Record<string, string>) {
  const res = await baseSaveSocialMedia(input);
  revalidatePath('/dashboard/management/health-status');
  return res;
}








