import CustomerCard from './CustomerCard';
import CustomerSorting from './CustomerSorting';
import { Icon } from '@/components/icons/Icon';
import { sortCustomers } from '../helpers/sortCustomers';
import type { Customer } from '../helpers/types';

type CustomerListProps = { customers: Customer[]; sortBy: string };

export default function CustomerList({ customers, sortBy }: CustomerListProps) {
    const sortedCustomers = sortCustomers(customers, sortBy);

    return (
        <div className='space-y-6'>
            <CustomerSorting customers={customers} currentSort={sortBy} />
            <div className='flex-1 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 items-start'>
                {sortedCustomers.length > 0 ? (
                    sortedCustomers.map((customer) => (
                        <CustomerCard key={customer.id} customer={{
                            ...customer,
                            name: customer.name || '',
                        }} />
                    ))
                ) : (
                    <div className='col-span-full flex flex-col items-center justify-center py-12 text-center'>
                        <div className='w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4'>
                            <Icon name="Users" size="lg" className="text-muted-foreground" />
                        </div>
                        <h3 className='text-lg font-semibold text-muted-foreground mb-2'>لا يوجد عملاء</h3>
                        <p className='text-sm text-muted-foreground'>لم يتم العثور على عملاء يطابقون المعايير المحددة</p>
                    </div>
                )}
            </div>
        </div>
    );
} 