'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Mail, Github, X } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '@/lib/validations';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export default function SignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Use Better Auth client for magic link signup
      // The magic link plugin automatically handles both sign-in and sign-up
      // Note: organisation is handled by the backend with a default value
      await authClient.signIn.magicLink({
        email: data.email,
        name: data.name,
        callbackURL: '/', // Redirect to dashboard after successful signup
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialAuth = (provider: 'github' | 'google') => {
    // Use Better Auth client for social auth
    try {
      authClient.signIn.social({ provider });
    } catch (err) {
      setError('Social authentication failed');
    }
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
            {/* Left Section - Signup Form */}
            <div className="flex-1 lg:flex-[0.5] flex flex-col p-6 lg:p-8 bg-white">
              {/* Header */}
              <div className="space-y-2 mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
                  Hello there.
                </h1>
                <p className="text-sm lg:text-base text-gray-600">
                  Let's get you onboarded.
                </p>
              </div>

              {/* Signup Form */}
              {success ? (
                <div className="text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
                  Account created! Please check your email to verify your
                  account and sign in.
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 flex-1"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        {...register('name')}
                        className={`h-10 border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${
                          errors.name
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500 !important'
                            : ''
                        }`}
                        disabled={isSubmitting}
                      />
                    </div>

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
                    {isSubmitting ? 'Signing up...' : 'Sign Up'}
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
                      © Mimic AI Lab. By signing up, you agree to our Terms of
                      Service and Privacy Policy.
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/login"
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Already have an account?{' '}
                        <span className="font-medium underline">Login</span>
                      </Link>
                    </div>
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
