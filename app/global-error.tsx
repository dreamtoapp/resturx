'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from '@/components/link';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const [errorId, setErrorId] = useState<string>('');
  const [isLogging, setIsLogging] = useState(true);

  useEffect(() => {
    // Generate a unique error ID
    const generateErrorId = () => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      return `Ticket-${timestamp}-${random}`;
    };

    const newErrorId = generateErrorId();
    setErrorId(newErrorId);

    // Log error to backend
    const logError = async () => {
      try {
        const errorData = {
          errorId: newErrorId,
          message: error.message || 'Unknown error occurred',
          stack: error.stack || '',
          digest: error.digest || '',
          url: typeof window !== 'undefined' ? window.location.href : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          severity: 'MEDIUM' as const,
        };

        // Send to backend API
        await fetch('/api/log-error', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(errorData),
        });

        console.log('✅ Error logged successfully:', newErrorId);
      } catch (logError) {
        console.error('❌ Failed to log error:', logError);
      } finally {
        setIsLogging(false);
      }
    };

    logError();
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'Cairo, sans-serif',
      textAlign: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)',
      color: 'hsl(var(--foreground))',
      position: 'relative'
    }}>
      {/* 🏢 Company Logo - Avatar Style Right Top */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        right: '2rem',
        textAlign: 'center',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Image
          src="/fallback/dreamToApp2-dark.png"
          alt="DreamToApp Logo"
          width={60}
          height={60}
          style={{
            borderRadius: '12px',
            objectFit: 'cover',
            filter: 'drop-shadow(0 4px 8px hsl(var(--foreground) / 0.15))',
            border: '2px solid hsl(var(--border))',
            background: 'hsl(var(--card))'
          }}
        />
        <div style={{
          fontSize: '0.75rem',
          color: 'hsl(var(--muted-foreground))',
          marginTop: '0.5rem',
          fontWeight: '500'
        }}>
          مدعوم بواسطة
        </div>
        <a
          href="https://www.dreamto.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.85rem',
            fontWeight: '600',
            color: 'hsl(var(--primary))',
            textDecoration: 'none'
          }}
        >
          www.dreamto.app
        </a>
      </div>

      {/* 🎯 Main Content Container */}
      <div style={{
        maxWidth: '600px',
        width: '100%',
        marginTop: '2rem'
      }}>
        {/* 🔧 Enhanced Icon with Animation */}
        <div style={{
          fontSize: '4rem',
          marginBottom: '2rem',
          color: 'hsl(var(--muted-foreground))',
          animation: 'pulse 2s infinite',
          filter: 'drop-shadow(0 4px 8px hsl(var(--foreground) / 0.1))'
        }}>
          ⚠️
        </div>

        {/* 📱 Loading State - Enhanced */}
        {isLogging && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '0.75rem 1.5rem',
            background: 'hsl(var(--primary) / 0.1)',
            border: '1px solid hsl(var(--primary) / 0.2)',
            borderRadius: '8px',
            color: 'hsl(var(--primary))',
            fontSize: '0.9rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              border: '2px solid hsl(var(--primary))',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            جاري تسجيل المشكلة...
          </div>
        )}

        {/* 🎯 Enhanced Main Title */}
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: '800',
          marginBottom: '1rem',
          color: 'hsl(var(--foreground))',
          lineHeight: '1.2',
          textShadow: '0 2px 4px hsl(var(--foreground) / 0.1)'
        }}>
          تحسينات قيد التنفيذ ✨
        </h1>

        <h2 style={{
          fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
          marginBottom: '2.5rem',
          color: 'hsl(var(--muted-foreground))',
          fontWeight: '500',
          lineHeight: '1.4',
          maxWidth: '500px',
          margin: '0 auto 2.5rem auto'
        }}>
          نقوم بتطوير تجربتك لتصبح أفضل من قبل! 🚀
        </h2>

        {/* 🎯 Enhanced Reassuring Message */}
        <div style={{
          maxWidth: '600px',
          marginBottom: '2.5rem',
          padding: '2rem',
          background: 'hsl(var(--card))',
          borderRadius: '16px',
          border: '1px solid hsl(var(--border))',
          boxShadow: '0 10px 25px -5px hsl(var(--foreground) / 0.1), 0 4px 6px -2px hsl(var(--foreground) / 0.05)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '4px',
            background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))',
            borderRadius: '2px'
          }}></div>

          <p style={{
            fontSize: '1.2rem',
            marginBottom: '1rem',
            lineHeight: '1.6',
            color: 'hsl(var(--foreground))',
            fontWeight: '600'
          }}>
            <strong>أهلاً وسهلاً! 🌟</strong> نحن نعمل على تحسين تجربتك
          </p>
          <p style={{
            fontSize: '1rem',
            color: 'hsl(var(--muted-foreground))',
            lineHeight: '1.6',
            margin: 0
          }}>
            فريقنا يعمل بجد لجعل كل شيء يعمل بشكل مثالي! سيتم الانتهاء قريباً 🎯
          </p>
        </div>

        {/* 🆔 Enhanced Error Reference ID */}
        <div style={{
          marginBottom: '2.5rem',
          padding: '1.5rem',
          background: 'hsl(var(--card))',
          borderRadius: '12px',
          border: '1px solid hsl(var(--border))',
          minWidth: '300px',
          boxShadow: '0 4px 6px -1px hsl(var(--foreground) / 0.1)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'hsl(var(--primary))',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            رقم التذكرة
          </div>

          <p style={{
            fontSize: '0.9rem',
            marginBottom: '0.75rem',
            color: 'hsl(var(--muted-foreground))',
            marginTop: '0.5rem'
          }}>
            للمساعدة السريعة، اذكر هذا الرقم:
          </p>
          <div style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            fontFamily: 'monospace',
            background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)',
            padding: '1rem',
            borderRadius: '8px',
            letterSpacing: '2px',
            border: '2px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
            textAlign: 'center',
            userSelect: 'all'
          }}>
            {errorId}
          </div>

          {/* 📱 WhatsApp Share Button */}
          <div style={{
            marginTop: '1rem',
            textAlign: 'center'
          }}>
            <button
              onClick={() => {
                // Using the TECHNICAL_WHATSAPP from .env
                const technicalWhatsApp = process.env.TECHNICAL_WHATSAPP || '966554113107';
                const currentTime = new Date().toLocaleString('ar-SA');
                const userAgent = navigator.userAgent;
                const screenInfo = `${screen.width}x${screen.height}`;

                const message = `🚀 تقرير دعم فني - Technical Support Report
 
🔍 رقم التذكرة / Ticket ID: ${errorId}
🌐 الموقع / URL: ${window.location.href}
⏰ التوقيت / Timestamp: ${currentTime}
📱 المتصفح / Browser: ${userAgent}
🖥️ دقة الشاشة / Screen: ${screenInfo}

📋 تفاصيل الطلب / Request Details:
- نوع الطلب / Request Type: System Improvement
- الحالة / Status: Active
- الأولوية / Priority: Medium

💬 رسالة المستخدم / User Message:
مرحباً! أحتاج مساعدة فنية مع تحسين النظام.
Hello! I need technical assistance with system improvement.

🙏 شكراً لكم / Thank you!`;

                const whatsappUrl = `https://wa.me/${technicalWhatsApp}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: '#25D366',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ flexShrink: 0 }}
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.87 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.87 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.87 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.87 0 0020.885 3.488" />
              </svg>
              إرسال للدعم الفني
            </button>
          </div>
        </div>

        {/* 🔄 Enhanced Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '2.5rem'
        }}>
          <Link
            href="/dashboard"
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1rem',
              background: 'hsl(var(--card))',
              border: '2px solid hsl(var(--border))',
              borderRadius: '12px',
              color: 'hsl(var(--muted-foreground))',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block',
              fontWeight: '600',
              minWidth: '160px'
            }}
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>

      {/* 🎨 CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
