import { Suspense } from 'react';
import { SimpleErrorLog } from './components/SimpleErrorLog';
import { ErrorPageSkeleton } from './components/ErrorPageSkeleton';
import LogTestIssueButton from './components/LogTestIssueButton';
import EmailTestButton from './components/EmailTestButton';

export const metadata = {
  title: 'System Log - Dashboard',
  description: 'System monitoring and issue tracking'
};

export default function ErrorsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">System Log</h1>
        <p className="text-muted-foreground mt-2">
          Monitor system health and resolve issues
        </p>

        {/* Test buttons for different error scenarios */}
        <div className="mt-4 space-y-3">
          <LogTestIssueButton />
          <EmailTestButton />
        </div>
      </div>

      <Suspense fallback={<ErrorPageSkeleton />}>
        <SimpleErrorLog />
      </Suspense>
    </div>
  );
}
