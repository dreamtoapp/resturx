import { Button } from '@/components/ui/button';

interface SaveButtonProps {
  isSaving: boolean;
}

export function SaveButton({ isSaving }: SaveButtonProps) {
  return (
    <div className="flex justify-end pt-6 border-t">
      <Button
        type="submit"
        disabled={isSaving}
        className="min-w-[120px]"
      >
        {isSaving ? 'جاري الحفظ...' : 'حفظ جميع الإعدادات'}
      </Button>
    </div>
  );
}








