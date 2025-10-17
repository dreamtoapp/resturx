'use server';

import db from '@/lib/prisma';

/**
 * Returns true if at least one category exists.
 * If the table is missing or any DB error occurs, returns false safely.
 */
export async function hasAnyCategory(): Promise<boolean> {
  try {
    const count = await db.category.count();
    return count > 0;
  } catch (_error) {
    return false;
  }
}


