'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function EmailTestButton() {
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const testEmail = async () => {
    setIsTesting(true);
    setResult(null);
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(`✅ Email test successful! Check your inbox: ${data.config.adminEmail}`);
      } else {
        setResult(`❌ Email test failed: ${data.message}`);
      }
      
      console.log('Email test result:', data);
    } catch (err) {
      setResult('❌ Failed to test email endpoint');
      console.error('Email test error:', err);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={testEmail}
        disabled={isTesting}
        variant="outline"
        className="border-orange-500 text-orange-600 hover:bg-orange-50"
      >
        {isTesting ? 'Testing...' : '🧪 Test Email Config'}
      </Button>
      {result && (
        <span className="text-sm text-muted-foreground">{result}</span>
      )}
    </div>
  );
}
