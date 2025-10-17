'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function LogTestIssueButton() {
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const sendTestLog = async () => {
    setIsSending(true);
    setResult(null);
    try {
      const response = await fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: '🧪 Test System Log (no crash) - Email & DB verification',
          stack: 'SimulatedStack:TestButton -> handler',
          digest: 'TEST-DIGEST-' + Date.now(),
          url: typeof window !== 'undefined' ? window.location.href : 'Unknown'
        })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to log test issue');
      }

      const data = await response.json();
      setResult(`Logged. ID: ${data.errorId || 'N/A'}`);
    } catch (err) {
      setResult('Failed to log test issue');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={sendTestLog}
        disabled={isSending}
        variant="default"
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isSending ? 'Sending…' : '🧪 Simulate Issue (DB + Email)'}
      </Button>
      {result && (
        <span className="text-sm text-muted-foreground">{result}</span>
      )}
    </div>
  );
}


