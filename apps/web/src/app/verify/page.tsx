'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token) {
          setStatus('error');
          setMessage('No verification token found');
          return;
        }

        // Use the Better Auth magic link verify method
        const { data, error } = await authClient.magicLink.verify({
          query: {
            token,
          },
        });

        if (error) {
          setStatus('error');
          setMessage(error.message || 'Verification failed');
        } else {
          setStatus('success');
          setMessage(
            'Email verified successfully! Redirecting to dashboard...'
          );

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/');
          }, 2000);
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <CheckCircle className="w-8 h-8 mx-auto text-green-500" />
              <p className="text-green-600">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <XCircle className="w-8 h-8 mx-auto text-red-500" />
              <p className="text-red-600">{message}</p>
              <Button onClick={() => router.push('/auth')} className="w-full">
                Go to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
