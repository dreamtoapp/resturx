import { buttonVariants } from '@/components/ui/button';
import Link from '@/components/link';
import { Icon } from '@/components/icons/Icon';
import AddressMapController from './AddressMapController';

interface AddressHeaderProps {
  googleMapsApiKey: string;
  onAddressSaved?: () => void; // Callback to refresh addresses
}

export default function AddressHeader({ googleMapsApiKey, onAddressSaved }: AddressHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="text-center sm:text-right">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">إدارة العناوين</h1>
        <p className="text-sm sm:text-base text-muted-foreground">أضف أو عدّل عناوين التوصيل الخاصة بك</p>
      </div>
      <div className="flex items-center gap-2 justify-center sm:justify-end">
        <Link href="/" className={buttonVariants({ variant: "default" })}>
          <Icon name='ShoppingBag' className="h-4 w-4 ml-2" />
          تسوق الان
        </Link>
        {/* <Button onClick={onAddAddress} className="btn-add">
          <Plus className="h-4 w-4 ml-2" />
          إضافة عنوان
        </Button> */}


        <div className="flex justify-center sm:justify-end">
          <AddressMapController
            googleMapsApiKey={googleMapsApiKey}
            onAddressSaved={onAddressSaved}
          />
        </div>
      </div>
    </div>
  );
}














