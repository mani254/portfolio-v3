'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

interface LoginFormProps {
    redirectUrl?: string;
    onSuccess?: () => void;
    onToggleRegister?: () => void;
    isModal?: boolean;
}

export const LoginForm = ({ redirectUrl, onSuccess, onToggleRegister, isModal = false }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const login = useAuthStore(state => state.login);
    const loginWithGoogle = useAuthStore(state => state.loginWithGoogle);
    const isLoading = useUserStore(state => state.isLoading);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (res.ok) {
            if (onSuccess) {
                onSuccess();
            } else if (redirectUrl) {
                router.push(redirectUrl);
            } else {
                router.push('/');
            }
            return;
        }
        if (res.status === 403 && res.data?.requiresVerification) {
            setError('Please verify your email first. Check your inbox.');
        } else {
            setError(res.message ?? 'Login failed');
        }
    };

    return (
        <div className="space-y-6 w-full max-w-sm mx-auto">
            <div className="flex flex-col items-center gap-2 text-center">
                {/* <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <LogIn className="w-6 h-6" />
                </div> */}
                <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                <p className="text-sm text-muted-foreground text-pretty">
                    Sign in to your account to continue
                </p>
            </div>

            <div className="space-y-4">
                <Button
                    variant="outline"
                    className="w-full h-11 flex items-center justify-center gap-2 group hover:bg-muted/50 transition-all duration-300"
                    onClick={() => loginWithGoogle(redirectUrl)}
                    disabled={isLoading}
                >
                    <svg className="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    Continue with Google
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                        <span className="bg-card px-2 text-muted-foreground/60 tracking-widest font-medium">
                            Or continue with
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-semibold text-foreground/70 ml-1">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            className="h-11 bg-muted/30 border-muted-foreground/20 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl placeholder:text-muted-foreground/40"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <Label htmlFor="password" title="password" className="text-xs font-semibold text-foreground/70">Password</Label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            className="h-11 bg-muted/30 border-muted-foreground/20 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl placeholder:text-muted-foreground/40"
                        />
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs font-medium text-destructive text-center bg-destructive/10 py-2 rounded-lg"
                        >
                            {error}
                        </motion.p>
                    )}

                    <Button type="submit" className="w-full h-11 text-sm font-semibold rounded-xl transition-all active:scale-[0.98]" disabled={isLoading}>
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Processing...
                            </span>
                        ) : 'Sign In'}
                    </Button>
                </form>
            </div>

            <p className="text-center text-xs text-muted-foreground">
                Don't have an account?{' '}
                {onToggleRegister ? (
                    <button
                        onClick={onToggleRegister}
                        className="font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                        Create one
                    </button>
                ) : (
                    <Link href="/register" className="font-bold text-primary hover:text-primary/80 transition-colors">
                        Create one
                    </Link>
                )}
            </p>
        </div>
    );
};
