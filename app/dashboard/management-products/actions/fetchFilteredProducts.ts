'use server';
import db from '@/lib/prisma';
// Define the type for Product including the supplier relation
import { Product } from '@/types/databaseTypes';;
import { Prisma } from '@prisma/client'; // Import Prisma

interface FilterParams {
  name?: string;
  supplierId?: string | null;
  status?: string; // "published", "unpublished", "all"
  type?: string; // "company", "offer", "all"
  stock?: string; // "all", "in", "out"
  page?: number;
  pageSize?: number;
}

export async function fetchFilteredProducts( // Update return type
  filters: FilterParams,
): Promise<{ products: Product[]; total: number }> {
  const where: Prisma.DishWhereInput = {}; // Use correct type
  if (filters.name) {
    where.name = { contains: filters.name, mode: 'insensitive' };
  }
  if (filters.supplierId) {
    where.supplierId = filters.supplierId;
  }
  if (filters.status && filters.status !== 'all') {
    where.published = filters.status === 'published';
  }
  // Note: type filter removed as Restaurant doesn't have type field like old Supplier
  // Can add country filter if needed in the future
  if (filters.stock && filters.stock !== 'all') {
    where.outOfStock = filters.stock === 'out';
  }

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 10;

  const [allProducts, total, allSuppliers] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.product.count({ where }),
    db.supplier.findMany({ select: { id: true, name: true } }),
  ]);

  // Create supplier map and filter products with valid suppliers
  const supplierMap = new Map(allSuppliers.map(s => [s.id, s]));
  const products = allProducts
    .filter(product => {
      const supplier = supplierMap.get(product.supplierId);
      if (!supplier) {
        console.warn(`Product ${product.id} (${product.name}) has invalid supplierId: ${product.supplierId}`);
      }
      return supplier !== undefined;
    })
    .map(product => ({
      ...product,
      supplier: supplierMap.get(product.supplierId)!
    }));

  return {
    products: products.map(p => ({ ...p, categorySlug: p.categorySlug ?? null })),
    total
  };
}
