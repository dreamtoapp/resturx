'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/icons/Icon';
import Image from 'next/image';
import { updateRestaurantServices } from '../actions/updateRestaurantServices';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface MasterService {
  id: string;
  name: string;
  nameEn?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  category?: string | null;
}

interface ServiceSelectorProps {
  masterServices: MasterService[];
  initialSelected: string[];
}

export default function ServiceSelector({ masterServices, initialSelected }: ServiceSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelected);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleToggle = (serviceId: string) => {
    setSelectedIds(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateRestaurantServices(selectedIds);
    setIsSaving(false);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  // Filter services based on search query
  const filteredServices = masterServices.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (service.nameEn && service.nameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (service.category && service.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group by category
  const groupedServices = filteredServices.reduce((acc, service) => {
    const category = service.category || 'أخرى';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, MasterService[]>);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Icon name="Search" className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="بحث عن خدمة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Selection Summary */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Icon name="CheckCircle2" className="h-5 w-5 text-primary" />
          <span className="font-medium">تم اختيار {selectedIds.length} خدمة</span>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Icon name="Loader2" className="h-4 w-4 ml-2 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Icon name="Save" className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </>
          )}
        </Button>
      </div>

      {/* Services Grid */}
      <div className="space-y-6">
        {Object.entries(groupedServices).map(([category, services]) => (
          <div key={category}>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Icon name="Tag" className="h-4 w-4" />
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => {
                const isSelected = selectedIds.includes(service.id);
                return (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-primary border-2 bg-primary/5' : ''
                      }`}
                    onClick={() => handleToggle(service.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggle(service.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          {service.imageUrl && (
                            <div className="w-12 h-12 mb-2 rounded-lg overflow-hidden bg-muted">
                              <Image
                                src={service.imageUrl}
                                alt={service.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <h4 className="font-semibold text-sm mb-1">{service.name}</h4>
                          {service.nameEn && (
                            <p className="text-xs text-muted-foreground mb-1">{service.nameEn}</p>
                          )}
                          {service.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {service.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">لا توجد نتائج للبحث</p>
        </div>
      )}
    </div>
  );
}




