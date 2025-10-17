import { Settings as SettingsIcon, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface HubSettingsLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  progress?: {
    current: number;
    total: number;
    isComplete: boolean;
  };
}

export default function HubSettingsLayout({
  children,
  title,
  description,
  icon: Icon = SettingsIcon,
  progress,
}: HubSettingsLayoutProps) {
  const pct = progress ? Math.min(100, Math.max(0, (progress.current / Math.max(1, progress.total)) * 100)) : 0;
  const size = 56;
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const isComplete = progress ? progress.isComplete || pct === 100 : false;
  return (
    <div dir="rtl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {progress && (
          isComplete ? (
            <div className="inline-flex items-center justify-center" style={{ width: size, height: size }} aria-label="completed">
              <CheckCircle2 className="h-7 w-7 text-green-600" aria-hidden="true" />
            </div>
          ) : (
            <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-live="polite">
              <svg width={size} height={size} className="-rotate-90 transition-all duration-300 ease-out">
                <circle cx={size / 2} cy={size / 2} r={radius} className="text-muted" stroke="currentColor" strokeWidth="6" fill="transparent" />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  className="text-primary"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-[10px] font-medium text-foreground">{Math.round(pct)}%</span>
            </div>
          )
        )}
      </div>

      {/* Content */}
      <Card className="max-w-4xl">
        <CardContent className="py-6 px-4 ">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
