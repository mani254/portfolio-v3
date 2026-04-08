'use client';

import { useUserStore } from '@/store/userStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GoogleCallbackPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const getCurrentUser = useUserStore(state => state.getCurrentUser);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const code = searchParams.get('code');
                const state = searchParams.get('state');
                const errorParam = searchParams.get('error');
                const success = searchParams.get('success');
                const redirect = searchParams.get('redirect');

                if (errorParam) {
                    const errorMessages: { [key: string]: string } = {
                        'access_denied': 'Google authentication was cancelled',
                        'no_code': 'No authorization code received from Google',
                        'token_exchange_failed': 'Failed to exchange authorization code',
                        'profile_fetch_failed': 'Failed to fetch user profile from Google',
                        'email_not_verified': 'Google email is not verified. Please verify your email with Google first.',
                        'auth_failed': 'Google authentication failed',
                    };
                    setError(errorMessages[errorParam] || 'Google authentication failed');
                    setLoading(false);
                    return;
                }

                // If backend redirected with success flag
                if (success) {
                    await getCurrentUser();
                    // Respect the redirect parameter if present
                    router.replace(redirect || '/');
                    return;
                }

                // If Google redirected here (unexpected), forward code to backend callback
                if (code) {
                    const backendBase = process.env.NEXT_PUBLIC_API_BACKEND_URL;
                    if (backendBase) {
                        const redirectUrl = `${backendBase}/api/auth/google/callback?code=${encodeURIComponent(code)}${state ? `&state=${encodeURIComponent(state)}` : ''}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''}`;
                        window.location.replace(redirectUrl);
                        return;
                    }
                }

                // Fallback: no flags present
                setError('No authorization code received from Google');
                setLoading(false);
            } catch (err) {
                console.error('Google callback error:', err);
                setError('Failed to complete Google authentication');
                setLoading(false);
            }
        };

        handleCallback();
    }, [searchParams, router, getCurrentUser]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm shadow-2xl text-center flex flex-col items-center gap-6"
            >
                {loading ? (
                    <>
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                            <Loader2 className="h-12 w-12 text-primary animate-spin relative" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-xl font-bold tracking-tight">Authenticating</h1>
                            <p className="text-sm text-muted-foreground">Completing your secure sign-in with Google...</p>
                        </div>
                    </>
                ) : error ? (
                    <>
                        <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mb-2">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-xl font-bold tracking-tight">Authentication Failed</h1>
                            <p className="text-sm text-destructive font-medium bg-destructive/10 py-2 px-4 rounded-lg">{error}</p>
                        </div>
                        <Button 
                            onClick={() => router.push('/login')}
                            className="h-11 px-8 rounded-xl font-semibold transition-all group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                            Return to Login
                        </Button>
                    </>
                ) : null}
            </motion.div>
        </div>
    );
};

export default GoogleCallbackPage;