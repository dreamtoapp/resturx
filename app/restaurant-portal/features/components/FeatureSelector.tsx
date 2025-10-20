'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/icons/Icon';
import Image from 'next/image';
import { updateRestaurantFeatures } from '../actions/updateRestaurantFeatures';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface MasterFeature {
  id: string;
  title: string;
  titleEn?: string | null;
  imageUrl?: string | null;
  description: string;
  category?: string | null;
}

interface FeatureSelectorProps {
  masterFeatures: MasterFeature[];
  initialSelected: string[];
}

export default function FeatureSelector({ masterFeatures, initialSelected }: FeatureSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelected);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleToggle = (featureId: string) => {
    setSelectedIds(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateRestaurantFeatures(selectedIds);
    setIsSaving(false);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  // Filter features based on search query
  const filteredFeatures = masterFeatures.filter(feature =>
    feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (feature.titleEn && feature.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
    feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (feature.category && feature.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group by category
  const groupedFeatures = filteredFeatures.reduce((acc, feature) => {
    const category = feature.category || 'أخرى';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feature);
    return acc;
  }, {} as Record<string, MasterFeature[]>);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Icon name="Search" className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="بحث عن ميزة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Selection Summary */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Icon name="CheckCircle2" className="h-5 w-5 text-primary" />
          <span className="font-medium">تم اختيار {selectedIds.length} ميزة</span>
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

      {/* Features Grid */}
      <div className="space-y-6">
        {Object.entries(groupedFeatures).map(([category, features]) => (
          <div key={category}>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Icon name="Tag" className="h-4 w-4" />
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature) => {
                const isSelected = selectedIds.includes(feature.id);
                return (
                  <Card
                    key={feature.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-primary border-2 bg-primary/5' : ''
                      }`}
                    onClick={() => handleToggle(feature.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggle(feature.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          {feature.imageUrl && (
                            <div className="w-12 h-12 mb-2 rounded-lg overflow-hidden bg-muted">
                              <Image
                                src={feature.imageUrl}
                                alt={feature.title}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
                          {feature.titleEn && (
                            <p className="text-xs text-muted-foreground mb-1">{feature.titleEn}</p>
                          )}
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {feature.description}
                          </p>
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

      {filteredFeatures.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">لا توجد نتائج للبحث</p>
        </div>
      )}
    </div>
  );
}




