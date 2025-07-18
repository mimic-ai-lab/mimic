'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Github,
  X,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthService } from '@/lib/auth-service';

// Simple email validation schema
const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function AuthPage() {
  const router = useRouter();
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [emailSent, setEmailSent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Use the custom auth service that handles standardized API responses
      await AuthService.signInWithMagicLink(data.email, '/');

      setMagicLinkSent(true);
      setEmailSent(data.email);
    } catch (err) {
      console.error('Auth error:', err);

      // Extract error message
      let errorMessage = 'Failed to send magic link';

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendMagicLink = async () => {
    if (!emailSent) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await AuthService.signInWithMagicLink(emailSent, '/');
      // Show success message briefly
    } catch (err) {
      console.error('Resend error:', err);

      // Extract error message
      let errorMessage = 'Failed to resend magic link';

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialAuth = (provider: 'github' | 'google') => {
    // Note: This would need to be updated when social auth is implemented
    setError('Social authentication not yet implemented');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
      {/* Notification Badge */}
      <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-2 rounded-l-lg flex items-center space-x-2 shadow-lg">
        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
          <span className="text-red-500 text-xs font-bold">N</span>
        </div>
        <span className="text-sm font-medium">1 Issue</span>
        <button className="ml-2">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        {/* Navigation - Just above the card */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Home
        </Link>

        <Card className="w-full p-0 max-h-[600px] lg:max-h-[700px] shadow-xl border border-gray-200 overflow-hidden">
          <CardContent className="p-0 h-full flex">
            {/* Left Section - Auth Form */}
            <div className="flex-1 lg:flex-[0.5] flex flex-col p-6 lg:p-8 bg-white">
              {/* Header */}
              <div className="space-y-2 mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
                  Welcome to Mimic
                </h1>
                <p className="text-sm lg:text-base text-gray-600">
                  Sign in or create your account with a magic link.
                </p>
              </div>

              {/* Auth Form */}
              {magicLinkSent ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                  {/* Success Icon */}
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>

                  {/* Success Message */}
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Check your email
                    </h2>
                    <p className="text-gray-600 max-w-sm">
                      We've sent a magic link to{' '}
                      <span className="font-medium text-gray-900">
                        {emailSent}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Click the link in your email to sign in to your account.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 w-full max-w-xs">
                    <Button
                      onClick={handleResendMagicLink}
                      disabled={isSubmitting}
                      variant="outline"
                      className="w-full h-11 bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Resending...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Resend magic link
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => {
                        setMagicLinkSent(false);
                        setEmailSent('');
                        setError(null);
                      }}
                      variant="ghost"
                      className="w-full h-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Use a different email
                    </Button>
                  </div>

                  {/* Help Text */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Didn't receive the email? Check your spam folder.</p>
                    <p>Magic links expire in 5 minutes for security.</p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 flex-1"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jane@contoso.com"
                        {...register('email')}
                        className={`h-10 border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${
                          errors.email
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500 !important'
                            : ''
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? 'Sending magic link...'
                      : 'Continue with Email'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  {/* Separator */}
                  <div className="relative">
                    <Separator className="bg-gray-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-white px-4 text-sm text-gray-500 font-medium">
                        OR CONTINUE WITH
                      </span>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-10 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
                      onClick={() => handleSocialAuth('github')}
                      disabled={isSubmitting}
                      type="button"
                    >
                      <Github className="w-5 h-5 mr-2" />
                      GitHub
                    </Button>

                    <Button
                      variant="outline"
                      className="h-10 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
                      onClick={() => handleSocialAuth('google')}
                      disabled={isSubmitting}
                      type="button"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                  </div>

                  {/* Footer */}
                  <div className="text-center space-y-2 mt-auto pt-4">
                    <p className="text-xs lg:text-sm text-gray-500">
                      © Mimic AI Lab. By continuing, you agree to our Terms of
                      Service and Privacy Policy.
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Right Section - Illustration (Hidden on small screens) */}
            <div className="hidden lg:flex lg:flex-[0.5] relative overflow-hidden">
              <Image
                src="/images/agent-swarm.png"
                alt="Astronaut interacting with computer in space environment"
                fill
                className="object-cover"
                priority
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
