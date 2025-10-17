"use client";

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { saveSocialMedia } from '../actions/saveSocialMedia';
import { Facebook, Instagram, Twitter, Linkedin, Loader2, Globe } from 'lucide-react';
import TikTokIcon from '@/components/icons/TikTokIcon';
import SnapchatIcon from '@/components/icons/SnapchatIcon';

type SocialKey = 'website' | 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'snapchat';
type SocialMediaLinks = Partial<Record<SocialKey, string>>;

interface SocialMediaFormProps {
  initialValues: SocialMediaLinks;
}

export default function SocialMediaForm({ initialValues }: SocialMediaFormProps) {
  const [values, setValues] = useState<SocialMediaLinks>(initialValues ?? {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const platforms: Array<{
    key: SocialKey;
    label: string;
    placeholder: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = useMemo(
    () => [
      {
        key: 'website',
        label: 'الموقع الإلكتروني',
        placeholder: 'https://your-website.com',
        icon: Globe,
      },
      {
        key: 'facebook',
        label: 'فيسبوك',
        placeholder: 'https://facebook.com/your-page',
        icon: Facebook,
      },
      {
        key: 'instagram',
        label: 'إنستغرام',
        placeholder: 'https://instagram.com/your-account',
        icon: Instagram,
      },
      {
        key: 'twitter',
        label: 'تويتر',
        placeholder: 'https://twitter.com/your-account',
        icon: Twitter,
      },
      {
        key: 'linkedin',
        label: 'لينكد إن',
        placeholder: 'https://linkedin.com/company/your-company',
        icon: Linkedin,
      },
      {
        key: 'tiktok',
        label: 'تيك توك',
        placeholder: 'https://tiktok.com/@your-account',
        icon: TikTokIcon,
      },
      {
        key: 'snapchat',
        label: 'سناب شات',
        placeholder: 'https://snapchat.com/add/your-username',
        icon: SnapchatIcon,
      },
    ],
    []
  );

  const handleChange = (key: SocialKey, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await saveSocialMedia(values as Record<SocialKey, string>);
      if (result.ok) {
        toast.success('تم حفظ الروابط بنجاح');
      } else {
        toast.error('فشل في حفظ الروابط');
      }
    } catch (_e) {
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Social Media Platforms */}
      <div className="grid gap-4">
        {platforms.map(({ key, label, placeholder, icon: Icon }) => {
          const hasValue = values[key]?.trim();
          return (
            <div key={key} className={`rounded-lg border p-4 transition-colors ${hasValue ? 'bg-primary/5 border-primary' : 'bg-muted/20 border-destructive'}`}>
              <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
              <div className="relative">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <Input
                  value={values[key] ?? ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="text-right pr-12"
                  dir="rtl"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جارٍ الحفظ...
            </>
          ) : (
            'حفظ الروابط'
          )}
        </Button>
      </div>
    </div>
  );
}


