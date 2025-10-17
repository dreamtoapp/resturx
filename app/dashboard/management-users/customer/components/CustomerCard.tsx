'use client';

import { toast } from 'sonner';
import { useState } from 'react';

import AddImage from '@/components/AddImage';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import { UserRole } from '@prisma/client';

import DeleteCustomerAlert from './DeleteCustomerAlert';
import CustomerUpsert from './CustomerUpsert';
import AddressBook from './AddressBook';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppDialog from '@/components/app-dialog';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Optimized status badge with business logic
function StatusBadge({ orderCount }: { orderCount: number }) {
    const isActive = orderCount > 0;
    return (
        <Badge
            variant={isActive ? "default" : "secondary"}
            className={`text-xs px-2 py-1 ${isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
            {isActive ? 'نشط' : 'غير نشط'}
        </Badge>
    );
}

// Compact info display for business-critical data
function BusinessInfo({ icon, label, value, isClickable = false }: {
    icon: string;
    label: string;
    value: string;
    isClickable?: boolean;
}) {
    const content = (
        <div className='flex items-center gap-2 py-1'>
            <Icon name={icon} size="xs" className="text-muted-foreground w-3 h-3 flex-shrink-0" />
            <span className='text-xs text-muted-foreground'>{label}:</span>
            <span className='text-sm font-medium text-foreground truncate'>{value}</span>
        </div>
    );

    return isClickable ? (
        <a href={`tel:${value}`} className="hover:text-primary transition-colors">
            {content}
        </a>
    ) : content;
}

type ImageDialogTriggerProps = {
    name: string;
    imageUrl?: string | null;
    recordId: string;
    onUploaded: () => void;
};

// Optimized image dialog with business focus
function ImageDialogTrigger({ name, imageUrl, recordId, onUploaded }: ImageDialogTriggerProps) {
    return (
        <AppDialog
            trigger={
                <div className='w-10 h-10 cursor-pointer hover:scale-105 transition-transform duration-200 border-2 border-transparent hover:border-primary/20 rounded-full'>
                    <Avatar className="w-full h-full rounded-full overflow-hidden">
                        {imageUrl ? (
                            <AvatarImage className="w-full h-full object-cover" src={imageUrl} alt={name} />
                        ) : null}
                        <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
                            {name?.trim()?.charAt(0)?.toUpperCase() || '?'}
                        </AvatarFallback>
                    </Avatar>
                </div>
            }
            title="تحديث صورة العميل"
            description={name}
            mode="update"
            size="sm"
            footer={null}
        >
            <div className="p-4">
                <div className="w-[280px] h-[280px] aspect-square overflow-hidden mx-auto border border-border rounded-lg">
                    <AddImage
                        className="relative w-full h-full"
                        url={imageUrl || undefined}
                        alt={`${name}'s profile`}
                        recordId={recordId}
                        table="user"
                        tableField='image'
                        onUploadComplete={onUploaded}
                    />
                </div>
            </div>
        </AppDialog>
    );
}

type CustomerCardProps = {
    customer: {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        role: UserRole;
        createdAt: Date | string;
        addresses?: Array<{
            id: string;
            label: string;
            district: string;
            street: string;
            buildingNumber: string;
            floor?: string | null;
            apartmentNumber?: string | null;
            landmark?: string | null;
            deliveryInstructions?: string | null;
            latitude?: string | null;
            longitude?: string | null;
            isDefault: boolean;
        }> | null;
        password?: string | null;
        sharedLocationLink?: string | null;
        image?: string | null;
        latitude?: string | null;
        longitude?: string | null;
        // Customer-specific fields
        preferredPaymentMethod?: string | null;
        deliveryPreferences?: string | null;
        orderCount: number;
        vipLevel?: number | null;
    };
};

export default function CustomerCard({ customer }: CustomerCardProps) {
    const router = useRouter();
    const [imageVersion, setImageVersion] = useState(0);

    // Business logic optimization
    const safeCustomer = {
        ...customer,
        name: customer.name || 'غير محدد',
        email: customer.email || '',
        imageUrl: customer.image || undefined,
    };

    const getPaymentMethodLabel = (method: string | null) => {
        const methods = {
            'CASH': 'نقداً',
            'CARD': 'بطاقة ائتمان',
            'WALLET': 'محفظة إلكترونية'
        };
        return methods[method as keyof typeof methods] || 'غير محدد';
    };

    const formatCreatedAt = (date: Date | string) => {
        const createdDate = new Date(date);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return 'اليوم';
        } else if (diffInDays === 1) {
            return 'أمس';
        } else if (diffInDays < 7) {
            return `منذ ${diffInDays} أيام`;
        } else if (diffInDays < 30) {
            const weeks = Math.floor(diffInDays / 7);
            return `منذ ${weeks} ${weeks === 1 ? 'أسبوع' : 'أسابيع'}`;
        } else {
            return createdDate.toLocaleDateString('ar-SA');
        }
    };

    const isActiveCustomer = customer.orderCount > 0;
    const hasAddresses = customer.addresses && customer.addresses.length > 0;

    return (
        <Card className='overflow-hidden rounded-xl border border-border/50 bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 min-h-[280px] max-h-[400px] flex flex-col'>
            {/* ===== ROW LAYOUT HEADER ===== */}
            <CardHeader className='border-b border-border/30 p-3 flex-shrink-0'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <ImageDialogTrigger
                            name={safeCustomer.name}
                            imageUrl={safeCustomer.imageUrl ? `${safeCustomer.imageUrl}?v=${imageVersion}` : null}
                            recordId={safeCustomer.id}
                            onUploaded={() => {
                                toast.success('تم رفع الصورة بنجاح');
                                setImageVersion(v => v + 1);
                                router.refresh();
                            }}
                        />
                        <CardTitle className='line-clamp-1 text-lg font-semibold text-foreground'>
                            {safeCustomer.name}
                        </CardTitle>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Icon name="Phone" size="xs" className="text-muted-foreground w-3 h-3" />
                        {customer.phone ? (
                            <a
                                href={`tel:${customer.phone}`}
                                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                {customer.phone}
                            </a>
                        ) : (
                            <span className='text-sm text-muted-foreground'>غير محدد</span>
                        )}
                    </div>
                </div>
            </CardHeader>

            {/* ===== COMPACT BUSINESS BODY ===== */}
            <CardContent className='p-0 flex-1 overflow-hidden'>
                <div className='p-3 space-y-2'>
                    {/* Essential Business Info */}
                    <div className='space-y-1'>
                        <BusinessInfo icon="Mail" label="البريد" value={safeCustomer.email || 'غير محدد'} />

                        <BusinessInfo
                            icon="Calendar"
                            label="تاريخ الإنشاء"
                            value={formatCreatedAt(customer.createdAt)}
                        />

                        {customer.preferredPaymentMethod && (
                            <BusinessInfo
                                icon="CreditCard"
                                label="طريقة الدفع"
                                value={getPaymentMethodLabel(customer.preferredPaymentMethod)}
                            />
                        )}

                        {/* Business Metrics */}
                        <div className='pt-2'>
                            <div className='bg-muted/30 rounded-lg p-2 text-center'>
                                <div className='text-lg font-bold text-primary'>{customer.orderCount}</div>
                                <div className='text-xs text-muted-foreground'>إجمالي الطلبات</div>
                            </div>
                        </div>

                        {/* Customer Status Summary */}
                        <div className='bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-2 mt-2'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                    <Icon name="User" size="xs" className="text-primary w-3 h-3" />
                                    <span className='text-xs text-muted-foreground'>حالة العميل:</span>
                                </div>
                                <StatusBadge orderCount={customer.orderCount} />
                            </div>
                            <div className='text-xs text-muted-foreground mt-1'>
                                {isActiveCustomer ? 'عميل نشط - يطلب بانتظام' : 'عميل غير نشط - لم يطلب بعد'}
                            </div>
                        </div>

                        {customer.deliveryPreferences && (
                            <div className='py-1'>
                                <div className='flex items-start gap-2'>
                                    <Icon name="Truck" size="xs" className="text-muted-foreground w-3 h-3 flex-shrink-0 mt-0.5" />
                                    <div className='min-w-0'>
                                        <span className='text-xs text-muted-foreground'>تفضيلات التوصيل:</span>
                                        <p className='text-sm font-medium text-foreground line-clamp-1 mt-0.5'>
                                            {customer.deliveryPreferences}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                    {/* Address Section - Only show if addresses exist */}
                    {hasAddresses && (
                        <div className='pt-2 border-t border-border/20'>
                            <AddressBook
                                addresses={customer.addresses || []}
                                onAddressUpdate={() => router.refresh()}
                            />
                        </div>
                    )}
                </div>
            </CardContent>

            {/* ===== OPTIMIZED FOOTER ===== */}
            <CardFooter className='flex justify-between items-center border-t border-border/30 bg-muted/30 p-3 flex-shrink-0'>
                {/* More Details - Left Side */}
                <Link
                    href={`/dashboard/management-users/customer/${customer.id}`}
                    className='flex items-center gap-1.5 px-3 py-1.5 rounded-md text-primary hover:bg-primary/10 transition-colors text-sm font-medium'
                >
                    <Icon name="Eye" size="xs" className="w-3 h-3" />
                    <span>تفاصيل أكثر</span>
                </Link>

                {/* Edit and Delete - Right Side */}
                <div className='flex items-center gap-2'>
                    <CustomerUpsert
                        mode='update'
                        title="تعديل بيانات العميل"
                        description="يرجى إدخال البيانات المحدثة"
                        defaultValues={{
                            name: customer.name || '',
                            phone: customer.phone || '',
                            password: customer.password || '',
                        }}
                        userId={customer.id}
                    />

                    <DeleteCustomerAlert customerId={safeCustomer.id}>
                        <button className='flex items-center gap-1.5 px-3 py-1.5 rounded-md text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium'>
                            <Icon name="Trash2" size="xs" className="w-3 h-3" />
                            <span>حذف</span>
                        </button>
                    </DeleteCustomerAlert>
                </div>
            </CardFooter>
        </Card>
    );
} 