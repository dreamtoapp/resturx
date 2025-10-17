'use server';

import { getSocialMedia } from './getSocialMedia';

export async function getProgress() {
  const result = await getSocialMedia();
  const data = result.ok ? (result.data as any) : {};
  const completed = Object.values(data).filter((v: any) => (v?.trim?.() ?? '') !== '').length;
  const total = 7;

  return {
    percent: Math.round((completed / total) * 100),
    completed,
    total,
  };
}




