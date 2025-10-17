// Route-scoped Customer type derived from the server action output
// Avoids duplication and stays in sync with getCustomers select/map
import type { getCustomers } from '../actions/getCustomers';

type RawCustomer = Awaited<ReturnType<typeof getCustomers>>[number];
export type Customer = Omit<RawCustomer, 'name'> & { name: string | null };


