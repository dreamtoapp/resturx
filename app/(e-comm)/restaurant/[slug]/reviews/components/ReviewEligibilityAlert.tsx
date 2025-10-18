import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icon } from '@/components/icons/Icon';

interface ReviewEligibilityAlertProps {
  canReview: boolean;
  reason: string;
}

export default function ReviewEligibilityAlert({ canReview, reason }: ReviewEligibilityAlertProps) {
  if (canReview) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <Icon name="CheckCircle2" className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-900">يمكنك كتابة تقييم</AlertTitle>
        <AlertDescription className="text-green-700">
          {reason}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-yellow-50 border-yellow-200">
      <Icon name="AlertCircle" className="h-5 w-5 text-yellow-600" />
      <AlertTitle className="text-yellow-900">لا يمكنك كتابة تقييم حالياً</AlertTitle>
      <AlertDescription className="text-yellow-700">
        <p>{reason}</p>
      </AlertDescription>
    </Alert>
  );
}

