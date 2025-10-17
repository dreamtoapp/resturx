export type SortKey = 'all' | 'active' | 'inactive' | 'most-orders' | 'least-orders' | 'newest' | 'oldest';

type WithSortKeys = { orderCount: number; createdAt: Date | string };

export function sortCustomers<T extends WithSortKeys>(customers: T[], sortBy: string | undefined): T[] {
  const key = (sortBy as SortKey) || 'all';
  const base = [...customers];
  switch (key) {
    case 'active':
      return base.filter(c => c.orderCount >= 1 && c.orderCount < 6);
    case 'inactive':
      return base.filter(c => c.orderCount === 0);
    case 'most-orders':
      return base.sort((a, b) => b.orderCount - a.orderCount);
    case 'least-orders':
      return base.sort((a, b) => a.orderCount - b.orderCount);
    case 'newest':
      return base.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'oldest':
      return base.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    default:
      return base;
  }
}


