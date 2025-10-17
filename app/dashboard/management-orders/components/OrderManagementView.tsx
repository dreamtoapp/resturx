'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import OrderCardView from './OrderCardView';
import SimpleStatusFilter from './SimpleStatusFilter';
import SearchDialog from './SearchDialog';
import { SearchProvider } from './SearchContext';
import { RefreshProvider, useRefresh } from './RefreshContext';
import type { Order } from '@/types/databaseTypes';
import type { OrderCounts } from '../actions/get-order-counts';

interface OrderManagementViewProps {
    initialOrders: Order[];
    statusFilter?: string;
    orderCounts: OrderCounts;
}

function OrderManagementContent({ initialOrders, statusFilter, orderCounts }: OrderManagementViewProps) {
    const { triggerRefresh, isRefreshing } = useRefresh();

    // Use the fetched order counts instead of calculating from filtered orders
    const { total, pending, assigned, inTransit, delivered, canceled } = orderCounts;

    return (
        <div className="container mx-auto py-4 space-y-4">
            {/* Enhanced Header Section with Search and Refresh - Mobile First */}
            <div className="space-y-4">
                {/* Main Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1 bg-feature-commerce rounded-full"></div>
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                            <Icon name="Package" className="h-5 w-5 sm:h-6 sm:w-6 text-feature-commerce" />
                            إدارة الطلبات
                        </h1>
                        <span className="text-sm text-muted-foreground">
                            ({total} طلب)
                        </span>
                    </div>

                    {/* Refresh Button */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={triggerRefresh}
                                disabled={isRefreshing}
                            >
                                <Icon
                                    name="RefreshCw"
                                    className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                                />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>تحديث البيانات</TooltipContent>
                    </Tooltip>
                </div>

                {/* Action Buttons Row - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    {/* Search Dialog Button */}
                    <SearchDialog
                        totalOrders={total}
                        orders={initialOrders}
                    />

                    {/* Analytics Link Button */}
                    <Link href="/dashboard/management-orders/analytics" className="flex-1 sm:flex-none">
                        <Button variant="outline" className="gap-2 w-full sm:w-auto">
                            <Icon name="BarChart3" className="h-4 w-4" />
                            <span className="hidden sm:inline">التحليلات التفصيلية</span>
                            <span className="sm:hidden">التحليلات</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Simple Status Filter */}
            <Card className="shadow-lg border-l-4 border-l-feature-commerce">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon name="Filter" className="h-5 w-5 text-feature-commerce" />
                        تصفية الطلبات
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <SimpleStatusFilter
                        currentStatus={statusFilter}
                        totalOrders={total}
                        pendingOrders={pending}
                        assignedOrders={assigned}
                        inTransitOrders={inTransit}
                        deliveredOrders={delivered}
                        canceledOrders={canceled}
                    />
                </CardContent>
            </Card>

            {/* Orders Management Card */}
            <Card className="shadow-lg border-l-4 border-l-feature-commerce">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon name="List" className="h-5 w-5 text-feature-commerce" />
                        إدارة الطلبات اليومية
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <OrderCardView initialOrders={initialOrders} status={statusFilter} />
                </CardContent>
            </Card>
        </div>
    );
}

export default function OrderManagementView(props: OrderManagementViewProps) {
    return (
        <RefreshProvider>
            <SearchProvider>
                <OrderManagementContent {...props} />
            </SearchProvider>
        </RefreshProvider>
    );
} 