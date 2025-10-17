'use client';

import { Users, Package, BarChart3, Zap, ClipboardList, Truck, Bell } from 'lucide-react';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const quickActions = [
    {
        id: 'notifications',
        title: 'التنبيهات',
        href: '/dashboard/management-notification',
        icon: Bell,
        color: 'text-cyan-600',
    },
    {
        id: 'products',
        title: 'إدارة المنتجات',
        href: '/dashboard/management-products',
        icon: Package,
        color: 'text-green-600',
    },
    {
        id: 'orders',
        title: 'إدارة الطلبات',
        href: '/dashboard/management-orders',
        icon: ClipboardList,
        color: 'text-blue-600',
    },
    {
        id: 'reports',
        title: 'التقارير',
        href: '/dashboard/management-reports',
        icon: BarChart3,
        color: 'text-purple-600',
    },
    {
        id: 'customers',
        title: 'إدارة العملاء',
        href: '/dashboard/management-users/customer',
        icon: Users,
        color: 'text-orange-600',
    },
    {
        id: 'track-driver',
        title: 'تتبع السائق',
        href: '/dashboard/management-tracking',
        icon: Truck,
        color: 'text-red-600',
    },
];

export default function QuickActions() {
    return (
        <div className="flex items-center gap-2">
            {/* Notifications Bell beside quick action */}
            <Link href="/dashboard/management-notification" aria-label="التنبيهات">
                <Button variant="ghost" size="icon" className="hover:bg-accent">
                    <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                </Button>
            </Link>
            {/* Quick Actions Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="group hover:bg-accent transition-colors duration-200">
                        <Zap className="h-5 w-5 text-muted-foreground group-hover:text-primary icon-enhanced transition-colors" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-2">
                    <DropdownMenuLabel className="text-base font-bold mb-2">
                        الإجراءات السريعة
                    </DropdownMenuLabel>

                    <div className="grid grid-cols-2 gap-2">
                        {quickActions.map((action) => (
                            <Link key={action.id} href={action.href}>
                                <Card className="cursor-pointer card-hover-effect">
                                    <CardContent className="p-3">
                                        <div className="flex items-center gap-2">
                                            <action.icon className={`h-4 w-4 ${action.color} icon-enhanced`} />
                                            <span className="text-sm font-semibold">{action.title}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
} 