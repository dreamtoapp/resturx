'use server';

import { getSocialMedia as baseGetSocialMedia } from '@/app/dashboard/management/settings/actions/getSocialMedia';

export async function getSocialMedia() {
  return await baseGetSocialMedia();
}








