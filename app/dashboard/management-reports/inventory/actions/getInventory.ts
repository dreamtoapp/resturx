import db from '@/lib/prisma';

export async function getInventory() {
  // First, get all products without the supplier relationship to avoid the Prisma error
  const allProducts = await db.product.findMany({
    orderBy: [{ outOfStock: 'desc' }, { name: 'asc' }],
  });

  // Then, get all valid suppliers to check which products have valid supplier relationships
  const allSuppliers = await db.supplier.findMany();
  const supplierMap = new Map(allSuppliers.map(s => [s.id, s]));

  // Filter products that have valid suppliers and add supplier data
  const productsRaw = allProducts
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

  console.log(`Found ${productsRaw.length} products with valid suppliers out of ${allProducts.length} total products`);

  return productsRaw.map((p) => ({
    ...p,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
    supplier: {
      ...p.supplier,
      createdAt:
        p.supplier.createdAt instanceof Date
          ? p.supplier.createdAt.toISOString()
          : p.supplier.createdAt,
      updatedAt:
        p.supplier.updatedAt instanceof Date
          ? p.supplier.updatedAt.toISOString()
          : p.supplier.updatedAt,
    },
  }));
}
