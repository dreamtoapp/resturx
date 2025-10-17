'use client';

import Link from 'next/link';
import { Icon } from '@/components/icons/Icon';
import NavigationMenu from './NavigationMenu';
import MobileNavigation from './MobileNavigation';
import DashboardIconWithNotification from '@/components/DashboardIconWithNotification';
import AppHealthIconServer from '@/components/AppHealthIconServer';
import DashboardClientHeader from '../management-dashboard/components/DashboardClientHeader';
import { CompanyDataStatus } from '@/helpers/companyDataValidator';

interface DashboardNavProps {
    pendingOrdersCount?: number;
    companyStatus: CompanyDataStatus;
}

export default function DashboardNav({ pendingOrdersCount = 0, companyStatus }: DashboardNavProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 shadow-sm overflow-visible">
            <LeftNavigation pendingOrdersCount={pendingOrdersCount} />
            <RightIcons companyStatus={companyStatus} />
        </header>
    );
}

function LeftNavigation({ pendingOrdersCount }: { pendingOrdersCount: number }) {
    return (
        <div className="flex items-center gap-4 md:gap-6">
            <NavigationMenu pendingOrdersCount={pendingOrdersCount} />
            <MobileNavigation pendingOrdersCount={pendingOrdersCount} />
        </div>
    );
}

function RightIcons({ companyStatus }: { companyStatus: CompanyDataStatus }) {
    return (
        <div className="flex items-center overflow-visible">
            <div className="flex items-center gap-2 md:gap-3 rounded-lg px-2.5 py-1.5 bg-background/60 overflow-visible">
                <DashboardIconWithNotification companyStatus={companyStatus} />
                <AppHealthIconServer status={companyStatus} />
                <div>
                    <DashboardClientHeader />
                </div>
                <Link href="/" className="flex items-center">
                    <Icon name="Store" className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                </Link>
            </div>
        </div>
    );
}