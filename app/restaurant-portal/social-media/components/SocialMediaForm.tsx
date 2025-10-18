'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/icons/Icon';
import FacebookIcon from '@/components/icons/FacebookIcon';
import InstagramIcon from '@/components/icons/InstagramIcon';
import SnapchatIcon from '@/components/icons/SnapchatIcon';
import TikTokIcon from '@/components/icons/TikTokIcon';
import TwitterIcon from '@/components/icons/TwitterIcon';
import { updateSocialMedia } from '../actions/updateSocialMedia';
import { toast } from 'sonner';

interface SocialMediaFormProps {
  initialData: {
    facebook?: string | null;
    instagram?: string | null;
    snapchat?: string | null;
    tiktok?: string | null;
    twitter?: string | null;
  };
}

export default function SocialMediaForm({ initialData }: SocialMediaFormProps) {
  const router = useRouter();
  const [facebook, setFacebook] = useState(initialData.facebook || '');
  const [instagram, setInstagram] = useState(initialData.instagram || '');
  const [snapchat, setSnapchat] = useState(initialData.snapchat || '');
  const [tiktok, setTiktok] = useState(initialData.tiktok || '');
  const [twitter, setTwitter] = useState(initialData.twitter || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const result = await updateSocialMedia({
      facebook: facebook.trim() || undefined,
      instagram: instagram.trim() || undefined,
      snapchat: snapchat.trim() || undefined,
      tiktok: tiktok.trim() || undefined,
      twitter: twitter.trim() || undefined,
    });

    setIsSaving(false);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const socialMediaPlatforms = [
    {
      name: 'Facebook',
      icon: FacebookIcon,
      value: facebook,
      setValue: setFacebook,
      placeholder: 'https://facebook.com/your-restaurant',
      description: 'رابط صفحة الفيسبوك الخاصة بالمطعم'
    },
    {
      name: 'Instagram',
      icon: InstagramIcon,
      value: instagram,
      setValue: setInstagram,
      placeholder: 'https://instagram.com/your-restaurant',
      description: 'رابط حساب الانستقرام الخاص بالمطعم'
    },
    {
      name: 'Snapchat',
      icon: SnapchatIcon,
      value: snapchat,
      setValue: setSnapchat,
      placeholder: 'https://snapchat.com/add/your-restaurant',
      description: 'رابط حساب السناب شات الخاص بالمطعم'
    },
    {
      name: 'TikTok',
      icon: TikTokIcon,
      value: tiktok,
      setValue: setTiktok,
      placeholder: 'https://tiktok.com/@your-restaurant',
      description: 'رابط حساب التيك توك الخاص بالمطعم'
    },
    {
      name: 'Twitter/X',
      icon: TwitterIcon,
      value: twitter,
      setValue: setTwitter,
      placeholder: 'https://twitter.com/your-restaurant',
      description: 'رابط حساب تويتر/X الخاص بالمطعم'
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>روابط وسائل التواصل</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {socialMediaPlatforms.map((platform) => (
            <div key={platform.name} className="space-y-2">
              <div className="flex items-center gap-2">
                <platform.icon className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor={platform.name.toLowerCase()}>
                  {platform.name}
                </Label>
              </div>
              <Input
                id={platform.name.toLowerCase()}
                type="url"
                placeholder={platform.placeholder}
                value={platform.value}
                onChange={(e) => platform.setValue(e.target.value)}
                className="text-left"
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground">{platform.description}</p>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={isSaving}
            >
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
        </form>
      </CardContent>
    </Card>
  );
}

