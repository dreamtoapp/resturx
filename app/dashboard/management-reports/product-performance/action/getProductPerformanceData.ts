import db from '@/lib/prisma';

// Define a specific type for the product performance data structure
interface ProductPerformanceData {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null; // Align with mapped data
  supplierName: string | null; // Align with mapped data
  published: boolean;
  outOfStock: boolean;
  quantitySold: number;
  revenue: number;
  orderCount: number;
}

export async function getProductPerformanceData({ from, to }: { from?: string; to?: string }) {
  // Note: Date filtering (from/to) is applied *after* fetching, within the map below

  // Get all products with their suppliers and order items
  // First, get all products without the supplier relationship to avoid the Prisma error
  const allProducts = await db.product.findMany({
    include: {
      orderItems: {
        include: {
          order: true,
        },
      },
    },
  });

  // Then, get all valid suppliers to check which products have valid supplier relationships
  const allSuppliers = await db.supplier.findMany({
    select: { id: true, name: true },
  });
  const supplierMap = new Map(allSuppliers.map(s => [s.id, s]));

  // Filter products that have valid suppliers and add supplier data
  const validProducts = allProducts
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

  console.log(`Found ${validProducts.length} products with valid suppliers out of ${allProducts.length} total products`);

  // Aggregate sales data per product
  const productPerformance = validProducts.map((product) => {
    // Filter orderItems by date (if provided)
    const filteredOrderItems = product.orderItems.filter((item) => {
      if (!item.order) return false;
      const createdAt = new Date(item.order.createdAt);
      if (from && createdAt < new Date(from)) return false;
      if (to && createdAt > new Date(to)) return false;
      return true;
    });
    const quantitySold = filteredOrderItems.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
    const revenue = filteredOrderItems.reduce(
      (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0),
      0,
    );
    const orderCount = new Set(filteredOrderItems.map((item) => item.orderId)).size;
    return {
      id: product.id,
      name: product.name, // Ensure this matches ProductPerformanceData
      price: product.price,
      imageUrl: product.imageUrl, // Keep as string | null
      supplierName: product.supplier.name, // Safe since we filtered out null suppliers
      published: product.published,
      outOfStock: product.outOfStock,
      quantitySold,
      revenue,
      orderCount,
    };
  });

  // KPIs (Arabic labels, 2 decimal for revenue)
  const totalProductsSold = productPerformance.reduce((sum, p) => sum + p.quantitySold, 0);
  const totalRevenue = productPerformance.reduce((sum, p) => sum + p.revenue, 0);
  const bestSeller = productPerformance.reduce(
    (best: ProductPerformanceData | undefined, p) => (p.quantitySold > (best?.quantitySold ?? 0) ? p : best),
    undefined, // Correctly typed initial value
  );

  const kpis = [
    { label: 'إجمالي المنتجات المباعة', value: totalProductsSold },
    { label: 'إجمالي الإيرادات', value: totalRevenue.toFixed(2) },
    { label: 'الأكثر مبيعًا', value: bestSeller ? bestSeller.name : '-' },
    { label: 'إجمالي المنتجات', value: validProducts.length },
  ];

  // Chart Data
  const chartData = productPerformance.map((p) => ({
    name: p.name,
    quantitySold: p.quantitySold,
    revenue: p.revenue,
  }));

  return {
    products: productPerformance,
    kpis,
    chartData,
    initialFrom: from, // Add initialFrom
    initialTo: to,     // Add initialTo
  };
}
