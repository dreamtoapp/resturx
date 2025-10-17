'use client';
import { useActionState } from 'react';
import { Eye, EyeOff, Loader2, Shield, ArrowRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { log } from '@/utils/logger';
import { userLogin } from '../action/userLogin';
import { checkPhoneExists } from '../action/checkPhoneExists';
import { sendPasswordViaWhatsApp } from '../action/sendPasswordViaWhatsApp';
import { syncCartOnLogin } from '@/app/(e-comm)/(cart-flow)/cart/helpers/cartSyncHelper';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  redirect?: string;
}

// WhatsApp Icon Component
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
    </svg>
  );
}

// Forgot Password Dialog Component
function ForgotPasswordDialog({
  isOpen,
  onClose,
  phoneNumber
}: {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    exists: boolean;
    message: string;
    user?: any;
    whatsappError?: string;
  } | null>(null);
  const [step, setStep] = useState<'validation' | 'success' | 'error' | 'sending' | 'completed'>('validation');

  // Reset dialog state every time it opens
  useEffect(() => {
    if (isOpen) {
      setStep('validation');
      setValidationResult(null);
      setIsLoading(false);
      console.log('🔄 Dialog opened - resetting state to fresh start');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Get last 2 digits of phone number with proper masking
  const lastTwoDigits = phoneNumber.slice(-2);
  const firstDigits = phoneNumber.slice(0, -2);
  const maskedNumber = `${firstDigits.replace(/\d/g, '•')}${lastTwoDigits}`;

  const handleConfirm = async () => {
    setIsLoading(true);
    setValidationResult(null);

    try {
      console.log('🔍 Validating phone number:', phoneNumber);

      // Check if phone number exists in database
      const result = await checkPhoneExists(phoneNumber);
      setValidationResult(result);

      if (result.success && result.exists) {
        setStep('success');
        console.log('✅ Phone validation successful:', result.user);

        // Now proceed to send password via WhatsApp
        setStep('sending');
        setIsLoading(true);

        try {
          console.log('📱 Sending password via WhatsApp...');
          if (!result.user?.name) {
            throw new Error('User name not found');
          }

          const whatsappResult = await sendPasswordViaWhatsApp(phoneNumber, result.user.name);

          if (whatsappResult.success) {
            setStep('completed');
            console.log('✅ Password sent successfully via WhatsApp template:', whatsappResult.message);
          } else {
            // Check if it's a WhatsApp error but password was updated
            if (whatsappResult.password && whatsappResult.user) {
              setStep('completed');
              console.log('⚠️ Password updated but WhatsApp failed:', whatsappResult.message);
              // Show warning that password was updated but WhatsApp failed
              setValidationResult({
                success: true,
                exists: true,
                message: whatsappResult.message,
                user: whatsappResult.user
              });
            } else {
              setStep('error');
              setValidationResult({
                success: false,
                exists: false,
                message: whatsappResult.message || 'فشل في إرسال كلمة المرور عبر الواتس اب'
              });
            }
          }
        } catch (whatsappError) {
          console.error('❌ WhatsApp sending error:', whatsappError);
          setStep('error');
          setValidationResult({
            success: false,
            exists: false,
            message: 'فشل في إرسال كلمة المرور عبر الواتس اب'
          });
        }

      } else {
        setStep('error');
        console.log('❌ Phone validation failed:', result.message);
      }

    } catch (error) {
      console.error('❌ Error during phone validation:', error);
      setValidationResult({
        success: false,
        exists: false,
        message: 'حدث خطأ أثناء التحقق من رقم الهاتف'
      });
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <WhatsAppIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">نسيت كلمة المرور</h3>
              <p className="text-sm text-muted-foreground">إعادة تعيين عبر الواتس اب</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-muted rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {step === 'validation' && (
            <>
              <div className="text-center">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  سنرسل كلمة المرور إلى رقم هاتفك عبر الواتس اب
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  تأكد من أن رقم الهاتف صحيح قبل المتابعة
                </p>
              </div>

              {/* Phone Number Display */}
              <div className="bg-gradient-to-br from-muted/10 to-muted/30 border border-border/50 rounded-xl p-6 text-center shadow-sm">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-muted-foreground font-medium">رقم الهاتف</p>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="bg-background/80 border border-border/30 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-2xl font-mono font-bold text-foreground tracking-wider">
                    {maskedNumber}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    آخر رقمين للتحقق
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                تأكد من أن هذا هو رقم هاتفك الصحيح
              </p>
            </>
          )}

          {step === 'success' && validationResult?.user && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">تم التحقق من رقم الهاتف</h4>
                <p className="text-sm text-muted-foreground">
                  مرحباً {validationResult.user.name}! سنرسل كلمة المرور الجديدة عبر الواتس اب
                </p>
              </div>
            </div>
          )}

          {step === 'error' && validationResult && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">خطأ في التحقق</h4>
                <p className="text-sm text-muted-foreground">
                  {validationResult.message}
                </p>
              </div>
            </div>
          )}

          {step === 'sending' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">جاري الإرسال...</h4>
                <p className="text-sm text-muted-foreground">
                  جاري إرسال رقم الاختبار عبر قالب الواتس اب (تأكيد)
                </p>
              </div>
            </div>
          )}

          {step === 'completed' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">تم الإرسال بنجاح!</h4>
                <p className="text-sm text-muted-foreground">
                  {validationResult?.message || 'تم إرسال رقم الاختبار عبر قالب الواتس اب'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  تحقق من رسائل الواتس اب الخاصة بك (قالب التأكيد - رقم الاختبار: 1234)
                </p>
                {validationResult?.whatsappError && (
                  <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-xs text-yellow-600">
                      ⚠️ تم تحديث كلمة المرور ولكن فشل في إرسالها عبر الواتس اب
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          {step === 'validation' && (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 border-2 hover:bg-muted/50 transition-all duration-200"
                disabled={isLoading}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isLoading}
                className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جارٍ التحقق...
                  </>
                ) : (
                  <>
                    <WhatsAppIcon className="h-4 w-4 ml-2" />
                    تأكيد
                  </>
                )}
              </Button>
            </>
          )}

          {step === 'success' && (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 border-2 hover:bg-muted/50 transition-all duration-200"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                <>
                  <WhatsAppIcon className="h-4 w-4 ml-2" />
                  إرسال كلمة المرور
                </>
              </Button>
            </>
          )}

          {(step === 'sending' || step === 'completed') && (
            <Button
              onClick={onClose}
              className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              إغلاق
            </Button>
          )}

          {step === 'error' && (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 border-2 hover:bg-muted/50 transition-all duration-200"
              >
                إغلاق
              </Button>
              <Button
                onClick={() => {
                  setStep('validation');
                  setValidationResult(null);
                }}
                className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                المحاولة مرة أخرى
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Login Header Component (15 lines)
function LoginHeader() {
  return (
    <div className="text-center mb-8">
      <Shield className="h-12 w-12 text-feature-users mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-foreground mb-2">مرحباً بعودتك!</h1>
      <p className="text-muted-foreground">أدخل بياناتك لتسجيل الدخول إلى حسابك</p>
    </div>
  );
}

// Form Fields Component (35 lines)
function FormFields({
  showPassword,
  setShowPassword,
  phoneNumber,
  setPhoneNumber
}: {
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Phone Input */}
      <div className="flex flex-col gap-2">
        <Label>رقم الهاتف</Label>
        <Input
          type="tel"
          name="phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="رقم الهاتف (05XXXXXXXX)"
          maxLength={10}
          className="h-12 text-base border-2 focus:border-feature-users transition-colors duration-300 text-center"
          required
          autoComplete="tel"
          pattern="05[0-9]{8}"
          dir="ltr"
        />
      </div>

      {/* Password Input */}
      <div className="relative flex flex-col gap-2">
        <Label>كلمة المرور</Label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="كلمة المرور"
            className="h-12 text-base border-2 focus:border-feature-users transition-colors duration-300 pr-12"
            required
            minLength={6}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-feature-users focus:ring-offset-2 rounded-md"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Form Actions Component (25 lines)
function FormActions({
  isPending,
  state
}: {
  isPending: boolean;
  state: { success: boolean; message: string } | null;
}) {
  return (
    <div className="space-y-4">
      {/* Status Message */}
      {state?.message && (
        <p className={cn(
          "text-sm text-center",
          state.success ? "text-green-600" : "text-destructive"
        )}>
          {state.message}
        </p>
      )}

      {/* Login Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-12 bg-feature-users hover:bg-feature-users/90 text-white font-medium text-base transition-all duration-300"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin ml-2" />
            جارٍ تسجيل الدخول ومزامنة السلة...
          </>
        ) : (
          <>
            تسجيل الدخول
            <ArrowRight className="h-4 w-4 mr-2" />
          </>
        )}
      </Button>
    </div>
  );
}

// Footer Links Component (20 lines)
function FooterLinks({
  onForgotPassword,
  phoneNumber
}: {
  onForgotPassword: () => void;
  phoneNumber: string;
}) {
  return (
    <div className="space-y-4 text-center">
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border"></div>
        <span className="text-xs text-muted-foreground">أو</span>
        <div className="flex-1 h-px bg-border"></div>
      </div>

      <div className="flex gap-4 text-sm">
        <a href="/auth/register" className="flex-1 text-feature-users hover:underline">
          إنشاء حساب جديد
        </a>
        <button
          onClick={onForgotPassword}
          disabled={!phoneNumber || phoneNumber.length < 10}
          className="flex-1 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={!phoneNumber || phoneNumber.length < 10 ? "أدخل رقم الهاتف أولاً" : "انقر لإعادة تعيين كلمة المرور"}
        >
          نسيت كلمة المرور؟
        </button>
      </div>
    </div>
  );
}

// Main Login Component (30 lines)
export default function LoginPe({ redirect = '/' }: LoginFormProps) {
  log("LoginPe redirect prop:", redirect);

  const [state, addAction, isPending] = useActionState(userLogin, { success: false, message: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  // Debug form state changes
  console.log('🔍 DEBUG: Login form state changed:', { state, isPending });

  // ✅ SILENT CART SYNC - NO NOTIFICATIONS
  useEffect(() => {
    if (state?.success) {
      // Silent cart sync - no loading toast, no success message
      syncCartOnLogin()
        .then(() => {
          // Redirect immediately - no waiting, no notifications
          router.push(redirect);
        })
        .catch((error) => {
          // Only show error if sync actually fails
          console.error('Cart sync error:', error);
          // Still redirect - don't block user experience
          router.push(redirect);
        });
    }
  }, [state, redirect, router]);

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Back Button */}


        {/* Login Form */}
        <div className="space-y-8">
          <LoginHeader />

          <form action={addAction} className="space-y-6" onSubmit={() => console.log('🚀 DEBUG: Form submitted - starting login process')}>
            {/* Hidden input for redirect */}
            <input type="hidden" name="redirect" value={redirect} />

            <FormFields
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
            />

            <FormActions
              isPending={isPending}
              state={state}
            />
          </form>

          <FooterLinks
            onForgotPassword={handleForgotPassword}
            phoneNumber={phoneNumber}
          />
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog
        isOpen={showForgotPassword}
        onClose={handleCloseForgotPassword}
        phoneNumber={phoneNumber}
      />
    </div>
  );
}
