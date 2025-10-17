'use client';

import * as React from "react";
import { AlertCircle } from "lucide-react";

interface ValidationRule {
  id: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  icon: React.ReactNode;
  isResolved: boolean;
}

interface CheckoutValidationProps {
  user: any;
  selectedAddress: any;
  selectedShiftId: string;
  selectedPaymentMethod: string;
  termsAccepted: boolean;
  cart: any;
}

// Removed old banner and collapsible components for a tiny inline message

export default function CheckoutValidation({
  user,
  selectedAddress,
  selectedShiftId,
  selectedPaymentMethod,
  termsAccepted: _termsAccepted,
  cart
}: CheckoutValidationProps) {

  // Collapsible removed: we only show a tiny inline error note when rules exist

  // Generate validation rules based on current state
  const generateValidationRules = (): ValidationRule[] => {
    const rules: ValidationRule[] = [];

    // User Info Validation
    if (!user?.name) {
      rules.push({
        id: 'user-name',
        message: 'يجب إدخال الاسم الكامل',
        severity: 'error',
        icon: <AlertCircle className="h-4 w-4" />,
        isResolved: false
      });
    }

    if (!user?.phone) {
      rules.push({
        id: 'user-phone',
        message: 'يجب إدخال رقم الهاتف',
        severity: 'error',
        icon: <AlertCircle className="h-4 w-4" />,
        isResolved: false
      });
    }

    if (user?.isOtp !== true) {
      rules.push({
        id: 'user-verification',
        message: 'يجب تفعيل الحساب قبل المتابعة',
        severity: 'error',
        icon: <AlertCircle className="h-4 w-4" />,
        isResolved: false
      });
    }

    // Address Validation
    if (!selectedAddress) {
      rules.push({
        id: 'address-selection',
        message: 'يجب اختيار عنوان للتوصيل',
        severity: 'error',
        icon: <AlertCircle className="h-4 w-4" />,
        isResolved: false
      });
    } else {
      // Comprehensive address validation
      const addressIssues = [];

      if (!selectedAddress.latitude || !selectedAddress.longitude) {
        addressIssues.push('إحداثيات صحيحة');
      }
      if (!selectedAddress.district || selectedAddress.district.trim() === '') {
        addressIssues.push('الحي/المنطقة');
      }
      if (!selectedAddress.street || selectedAddress.street.trim() === '') {
        addressIssues.push('اسم الشارع');
      }
      if (!selectedAddress.buildingNumber || selectedAddress.buildingNumber.trim() === '') {
        addressIssues.push('رقم المبنى');
      }

      if (addressIssues.length > 0) {
        rules.push({
          id: 'address-incomplete',
          message: `العنوان المحدد يحتاج إلى: ${addressIssues.join('، ')}`,
          severity: 'error',
          icon: <AlertCircle className="h-4 w-4" />,
          isResolved: false
        });
      }
    }

    // Shift Validation
    if (!selectedShiftId) {
      rules.push({
        id: 'shift-selection',
        message: 'يجب اختيار وقت التوصيل',
        severity: 'error',
        icon: <AlertCircle className="h-4 w-4" />,
        isResolved: false
      });
    }

    // Payment Method Validation
    if (!selectedPaymentMethod) {
      rules.push({
        id: 'payment-method',
        message: 'يجب اختيار طريقة الدفع',
        severity: 'error',
        icon: <AlertCircle className="h-4 w-4" />,
        isResolved: false
      });
    }

    // Terms Validation: skipped per requirement (no check needed)

    // Cart Validation
    if (!cart?.items || cart.items.length === 0) {
      rules.push({
        id: 'cart-items',
        message: 'يجب إضافة منتجات للسلة قبل المتابعة',
        severity: 'error',
        icon: <AlertCircle className="h-4 w-4" />,
        isResolved: false
      });
    }

    return rules;
  };

  const validationRules = generateValidationRules();
  // Removed unused errorCount to satisfy linter

  if (validationRules.length === 0) {
    return null;
  }

  const errorRules = validationRules.filter(r => r.severity === 'error');

  return (
    <div className="space-y-1">
      {errorRules.map((rule) => (
        <div key={rule.id} className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-accent text-foreground">
            {rule.icon ?? <AlertCircle className="h-3 w-3" />}
          </span>
          <span>{rule.message}</span>
        </div>
      ))}
    </div>
  );
}
