"use client";

import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import CloudinarySettingsForm from './forms/CloudinarySettingsForm';
import WhatsAppSettingsForm from './forms/WhatsAppSettingsForm';
import EmailSmtpSettingsForm from './forms/EmailSmtpSettingsForm';
import AnalyticsSettingsForm from './forms/AnalyticsSettingsForm';
import AuthSettingsForm from './forms/AuthSettingsForm';
import LocationSettingsForm from './forms/LocationSettingsForm';

interface AdvancedSettingsClientProps {
  company: any;
}

export default function AdvancedSettingsClient({ company }: AdvancedSettingsClientProps) {
  return (
    <div className="grid gap-6">
      <Collapsible defaultOpen={false}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">إعدادات الوسائط</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="group gap-2">
              <span className="group-data-[state=open]:hidden">عرض</span>
              <span className="hidden group-data-[state=open]:inline">إخفاء</span>
              <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-4">
          <CloudinarySettingsForm company={company} />
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen={false}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">إعدادات التفعيل عن طريق واتس اب</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="group gap-2">
              <span className="group-data-[state=open]:hidden">عرض</span>
              <span className="hidden group-data-[state=open]:inline">إخفاء</span>
              <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-4">
          <WhatsAppSettingsForm company={company} />
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen={false}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">إعدادات البريد / SMTP</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="group gap-2">
              <span className="group-data-[state=open]:hidden">عرض</span>
              <span className="hidden group-data-[state=open]:inline">إخفاء</span>
              <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-4">
          <EmailSmtpSettingsForm company={company} />
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen={false}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">إعدادات جوجل</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="group gap-2">
              <span className="group-data-[state=open]:hidden">عرض</span>
              <span className="hidden group-data-[state=open]:inline">إخفاء</span>
              <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-4">
          <AnalyticsSettingsForm company={company} />
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen={false}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">إعدادات الموقع عند اتمام الطلب</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="group gap-2">
              <span className="group-data-[state=open]:hidden">عرض</span>
              <span className="hidden group-data-[state=open]:inline">إخفاء</span>
              <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-4">
          <LocationSettingsForm company={company} />
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen={false}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">إعدادات المصادقة</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="group gap-2">
              <span className="group-data-[state=open]:hidden">عرض</span>
              <span className="hidden group-data-[state=open]:inline">إخفاء</span>
              <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-4">
          <AuthSettingsForm company={company} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
