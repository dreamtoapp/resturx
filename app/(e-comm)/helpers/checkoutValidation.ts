export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationRule {
  id: string;
  message: string;
  severity: ValidationSeverity;
}

interface Params {
  user: { name?: string | null; phone?: string | null; isOtp?: boolean | null };
  selectedAddress: {
    latitude?: number | null;
    longitude?: number | null;
    district?: string | null;
    street?: string | null;
    buildingNumber?: string | null;
  } | null;
  shiftId: string;
  paymentMethod: string;
  itemsCount: number;
  termsAccepted?: boolean;
  requireOtp?: boolean;
  requireLocation?: boolean;
}

export function getCheckoutValidation(params: Params) {
  const { user, selectedAddress, shiftId, paymentMethod, itemsCount, requireOtp = false, requireLocation = true } = params;

  const rules: ValidationRule[] = [];

  // User info
  if (!user?.name) rules.push({ id: 'user-name', message: 'يجب إدخال الاسم الكامل', severity: 'error' });
  if (!user?.phone) rules.push({ id: 'user-phone', message: 'يجب إدخال رقم الهاتف', severity: 'error' });
  if (requireOtp && user?.isOtp !== true) rules.push({ id: 'user-verification', message: 'يجب تفعيل الحساب قبل المتابعة', severity: 'error' });

  // Address selection / completeness
  if (requireLocation) {
    if (!selectedAddress) {
      rules.push({ id: 'address-selection', message: 'يجب اختيار عنوان للتوصيل', severity: 'error' });
    } else {
      const addressIssues: string[] = [];
      const hasValidLocation = !!(selectedAddress.latitude && selectedAddress.longitude);
      if (!hasValidLocation) addressIssues.push('إحداثيات صحيحة');
      if (!selectedAddress.district || selectedAddress.district.trim() === '') addressIssues.push('الحي/المنطقة');
      if (!selectedAddress.street || selectedAddress.street.trim() === '') addressIssues.push('اسم الشارع');
      if (!selectedAddress.buildingNumber || selectedAddress.buildingNumber.trim() === '') addressIssues.push('رقم المبنى');
      if (addressIssues.length > 0) {
        rules.push({ id: 'address-incomplete', message: `العنوان المحدد يحتاج إلى: ${addressIssues.join('، ')}`, severity: 'error' });
      }
    }
  }

  // Shift / payment / cart
  if (!shiftId) rules.push({ id: 'shift-selection', message: 'يجب اختيار وقت التوصيل', severity: 'error' });
  if (!selectedAddress) {
    // keep order same as component; payment rule still valid even if address missing
  }
  if (!paymentMethod) rules.push({ id: 'payment-method', message: 'يجب اختيار طريقة الدفع', severity: 'error' });
  if (!itemsCount || itemsCount <= 0) rules.push({ id: 'cart-items', message: 'يجب إضافة منتجات للسلة قبل المتابعة', severity: 'error' });

  // Terms: no longer enforced (informational only)
  // if (!termsAccepted) rules.push({ id: 'terms-acceptance', message: 'يجب الموافقة على الشروط والأحكام', severity: 'error' });

  const blockingErrors = rules.filter(r => r.severity === 'error');
  const isReady = blockingErrors.length === 0;
  const firstMessage = isReady ? '' : blockingErrors[0]?.message || '';

  return { rules, isReady, firstMessage };
}


