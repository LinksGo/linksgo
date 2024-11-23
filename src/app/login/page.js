'use client';

import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { checkAuthConfig } from '@/utils/auth-config-check';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [configIssues, setConfigIssues] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  
  // Initialize Supabase client
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    options: {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  });

  // Check configuration on mount
  useEffect(() => {
    const verifyConfig = async () => {
      const { valid, issues } = await checkAuthConfig();
      if (!valid) {
        setConfigIssues(issues);
        setError('Authentication configuration issues detected');
      }
    };

    verifyConfig();
  }, []);

  // Get error from URL if present and clear it
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const errorMsg = searchParams.get('error');
    if (errorMsg) {
      // Remove error from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      if (errorMsg === 'fetch failed' && retryCount < 3) {
        // Automatically retry on fetch failure
        setRetryCount(prev => prev + 1);
        handleGoogleSignIn();
        return;
      }

      let userFriendlyError = 'An error occurred during sign in. Please try again.';
      
      switch(decodeURIComponent(errorMsg).toLowerCase()) {
        case 'fetch failed':
          userFriendlyError = 'Connection issue detected. Please try signing in again.';
          break;
        case 'popup_closed_by_user':
          userFriendlyError = 'Sign in was cancelled. Please try again when you\'re ready.';
          break;
        case 'unauthorized':
          userFriendlyError = 'Sign in was unsuccessful. Please ensure you\'re using a valid Google account.';
          break;
        case 'access_denied':
          userFriendlyError = 'Access was denied. Please make sure you grant the necessary permissions to sign in.';
          break;
        case 'timeout':
          userFriendlyError = 'The sign in request timed out. Please try again.';
          break;
        case 'network_error':
          userFriendlyError = 'Network connection issue detected. Please check your internet connection and try again.';
          break;
      }
      setError(userFriendlyError);
    }
  }, [retryCount]);

  // Verify Supabase connection on mount
  useEffect(() => {
    const verifyConnection = async () => {
      try {
        const { error: connError } = await supabase.auth.getSession();
        if (connError) {
          console.error('Supabase connection error:', connError);
          setError('Unable to connect to authentication service. Please try again later.');
        }
      } catch (err) {
        console.error('Supabase initialization error:', err);
        setError('Failed to initialize authentication service. Please refresh the page and try again.');
      }
    };

    verifyConnection();
  }, []);

  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url' || 
      !supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-400">Configuration Error</CardTitle>
            <CardDescription>
              Please set up your Supabase environment variables in .env.local:
              <br />
              1. NEXT_PUBLIC_SUPABASE_URL
              <br />
              2. NEXT_PUBLIC_SUPABASE_ANON_KEY
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Show configuration issues if any
  if (configIssues.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-400">Configuration Issues Detected</CardTitle>
            <CardDescription>
              <ul className="list-disc list-inside mt-4">
                {configIssues.map((issue, index) => (
                  <li key={index} className="mt-1">{issue}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-gray-500">
                Please check your environment configuration and Supabase settings.
              </p>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      });

      if (signInError) {
        console.error('Google sign in error:', signInError);
        throw signInError;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      let errorMessage = 'Failed to sign in with Google. Please try again.';
      
      if (error.message) {
        if (error.message.includes('network')) {
          errorMessage = 'Network error detected. Please check your internet connection and try again.';
        } else if (error.message.includes('popup')) {
          errorMessage = 'Sign in popup was closed. Please try again and keep the popup window open.';
        } else if (error.message.includes('configuration')) {
          errorMessage = 'Authentication service configuration error. Please try again later.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background image */}
      <Image
        src="/login-bg.jfif?v=1"
        alt="Background"
        fill
        sizes="100vw"
        quality={100}
        className="object-cover object-center opacity-80 !fixed"
        priority
        unoptimized
      />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30 z-10"></div>
      
      <div className="w-full max-w-md space-y-8 relative z-20">
        <Card className="bg-black/50 backdrop-blur-md border-gray-800/30">
          <CardHeader className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Image
                src="/linksGo (2).png"
                alt="LinksGo Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                LinksGo
              </h1>
            </div>
            <CardTitle className="text-2xl font-semibold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-300 font-medium">
              Sign in to manage your links and customize your page
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/50 p-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
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
                  Continue with Google
                </span>
              )}
            </Button>
            <p className="text-sm text-center text-gray-400">
              If you have difficulty logging in, mail{' '}
              <a href="mailto:retr0@linksgo.app" className="text-purple-400 hover:text-purple-300">
                retr0
              </a>
              {' '}for magic link to login
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}