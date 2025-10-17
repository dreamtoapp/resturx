"use client";

import { useState } from 'react';

import Swal from 'sweetalert2';
import { MapPin, Navigation } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

import GoogleMapSimple from './google-maps/GoogleMapApiKey';
import { LocationData } from './google-maps/types';
import { saveLocationAction } from '../actions/saveLocationAction';

export default function AddressMapController({
  googleMapsApiKey,
  onAddressSaved
}: {
  googleMapsApiKey: string;
  onAddressSaved?: () => void;
}) {
  const [address, setAddress] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [landmark, setLandmark] = useState<string>("");
  const [deliveryNote, setDeliveryNote] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<LocationData | null>(null);
  const [mapOpen, setMapOpen] = useState(false);

  const handleSave = (data: LocationData) => {
    setMapOpen(false);
    setTitle(data.title || "");
    setAddress(data.address);
    setLandmark(data.landmark);
    setDeliveryNote(data.deliveryNote);
    setCoordinates(data.coordinates);
    setPendingData(data);
    setConfirmOpen(true);
  };

  const handleCancelConfirm = () => {
    setConfirmOpen(false);
  };

  const handleConfirmSave = async () => {
    setConfirmOpen(false);
    const payload = pendingData;

    if (!payload) {
      Swal.fire({
        icon: "error",
        title: "خطأ في البيانات",
        text: "البيانات غير متوفرة"
      });
      return;
    }

    try {
      // Show loading state
      Swal.fire({
        title: "جارٍ حفظ البيانات...",
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
      });

      // Call the server action to save the address
      const result = await saveLocationAction(payload);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "تم حفظ الموقع بنجاح",
          html: `<div style='text-align:right;direction:rtl'>
            <div>عنوان الموقع: ${payload.title || "—"}</div>
            <div>الإحداثيات: [${payload.coordinates.lat.toFixed(6)}, ${payload.coordinates.lng.toFixed(6)}]</div>
            <div>العنوان: ${payload.address || "—"}</div>
            <div>معلم قريب: ${payload.landmark || "—"}</div>
            <div>ملاحظات التوصيل: ${payload.deliveryNote || "—"}</div>
          </div>`,
          confirmButtonText: "حسناً"
        });

        // Reset form state
        setTitle("");
        setAddress("");
        setLandmark("");
        setDeliveryNote("");
        setCoordinates(null);
        setPendingData(null);

        // Trigger address list refresh
        if (onAddressSaved) {
          onAddressSaved();
        }

        // Show success toast
        toast.success('تم حفظ العنوان بنجاح!');
      } else {
        Swal.fire({
          icon: "error",
          title: "فشل في حفظ الموقع",
          text: result.message,
          confirmButtonText: "حسناً"
        });
      }
    } catch (error) {
      console.error('Error saving location:', error);
      Swal.fire({
        icon: "error",
        title: "خطأ في النظام",
        text: "حدث خطأ غير متوقع أثناء حفظ الموقع",
        confirmButtonText: "حسناً"
      });
    }
  };

  return (
    <div className="w-full bg-background">
      {/* Enhanced Button Section - Mobile First */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 w-full">
        <Button
          onClick={() => setMapOpen(true)}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium"
          size="lg"
        >
          <MapPin className="h-5 w-5" />
          <span className="hidden sm:inline">اختيار الموقع على الخريطة</span>
          <span className="sm:hidden">اختيار الموقع</span>
        </Button>
      </div>

      {/* Enhanced Map Modal - Row Layout on Desktop, Column on Mobile */}
      <Dialog open={mapOpen} onOpenChange={setMapOpen}>
        <DialogContent className="w-[95vw] max-w-6xl h-[90vh] max-h-[90vh] p-0 sm:p-6">
          <DialogHeader className="px-4 sm:px-0 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Navigation className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">  حدد موقعك ثم احفظ المتغيرات.</DialogTitle>

                </div>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 max-h-[calc(90vh-120px)]">
            <div className="px-4 sm:px-0">
              <GoogleMapSimple
                className="w-full h-[60vh] lg:h-[75vh] rounded-xl border border-border/50 shadow-lg"
                apiKey={googleMapsApiKey}
                clientTitle={title}
                clientAddress={address}
                clientLandmark={landmark}
                clientDeliveryNote={deliveryNote}
                clientLocation={coordinates ?? undefined}
                onSave={handleSave}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Enhanced Confirmation Modal - Mobile First */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
          <DialogHeader className="text-center">
            <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">تأكيد حفظ الموقع</DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-muted-foreground">
              يرجى مراجعة البيانات قبل التأكيد.
            </DialogDescription>
          </DialogHeader>

          {pendingData && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="grid gap-3 text-sm sm:text-base">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="shrink-0">العنوان</Badge>
                  <span className="font-medium text-foreground">{pendingData.title || "—"}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="shrink-0">الإحداثيات</Badge>
                  <span className="font-mono text-xs sm:text-sm text-muted-foreground">
                    [{pendingData.coordinates.lat.toFixed(6)}, {pendingData.coordinates.lng.toFixed(6)}]
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="shrink-0">العنوان</Badge>
                  <span className="text-foreground">{pendingData.address || "—"}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="shrink-0">المعلم</Badge>
                  <span className="text-foreground">{pendingData.landmark || "—"}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="shrink-0">الملاحظات</Badge>
                  <span className="text-foreground">{pendingData.deliveryNote || "—"}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancelConfirm}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleConfirmSave}
              className="w-full sm:w-auto order-1 sm:order-2 bg-primary hover:bg-primary/90"
            >
              تأكيد الحفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
