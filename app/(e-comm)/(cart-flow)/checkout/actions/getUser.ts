import db from "@/lib/prisma";
import { unstable_noStore as noStore } from 'next/cache';

export async function getUser(userId: string) {
  noStore();
  return db.user.findUnique({ where: { id: userId } });
} 