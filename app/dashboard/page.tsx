import { getDashboardSummary } from '@/lib/dashboardSummary';
import { getCompanyDataStatus } from './actions/validateCompanyData';

import DashboardHomePage from './management-dashboard/components/DashboardHomePage';

export default async function DashboardHome() {
  const [summary, companyDataStatus] = await Promise.all([
    getDashboardSummary(),
    getCompanyDataStatus()
  ]);

  return <DashboardHomePage summary={summary} companyDataStatus={companyDataStatus} />;
}
