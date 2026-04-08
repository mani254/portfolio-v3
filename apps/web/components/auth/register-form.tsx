'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, ArrowLeft } from 'lucide-react';

interface RegisterFormProps {
    redirectUrl?: string;
    onSuccess?: () => void;
    onToggleLogin?: () => void;
    isModal?: boolean;
}

export const RegisterForm = ({ redirectUrl, onSuccess, onToggleLogin, isModal = false }: RegisterFormProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [screen, setScreen] = useState<'register' | 'otp'>('register');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);

    const register = useAuthStore(state => state.register);
    const verifyOtp = useAuthStore(state => state.verifyOtp);
    const resendOtp = useAuthStore(state => state.resendOtp);
    const loginWithGoogle = useAuthStore(state => state.loginWithGoogle);
    const isLoading = useUserStore(state => state.isLoading);

    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const res = await register(name, email, password);
        if (res.ok) {
            setScreen('otp');
            return;
        }
        setError(res.message ?? 'Registration failed');
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            const next = document.getElementById(`otp-${index + 1}`);
            next?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prev = document.getElementById(`otp-${index - 1}`);
            prev?.focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length !== 6) return;
        setVerifying(true);
        setError('');
        const res = await verifyOtp(email, code);
        setVerifying(false);
        if (res.verified) {
            setVerified(true);
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.push('/login');
                }
            }, 2000);
            return;
        }
        setError(res.message ?? 'Invalid code');
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            <AnimatePresence mode="wait">
                {screen === 'register' ? (
                    <motion.div
                        key="register"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-col items-center gap-2 text-center">
                            {/* <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                                <UserPlus className="w-6 h-6" />
                            </div> */}
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
                            <p className="text-sm text-muted-foreground text-pretty">
                                Sign up to save your progress and chats
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Button
                                variant="outline"
                                className="w-full h-11 flex items-center justify-center gap-2 group hover:bg-muted/50 transition-all"
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
                                        Or sign up with
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-semibold text-foreground/70 ml-1">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="h-11 bg-muted/30 border-muted-foreground/20 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl placeholder:text-muted-foreground/40"
                                    />
                                </div>
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
                                    <Label htmlFor="password" title="password" className="text-xs font-semibold text-foreground/70 ml-1">Password</Label>
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
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-medium text-destructive text-center bg-destructive/10 py-2 rounded-lg">
                                        {error}
                                    </motion.p>
                                )}

                                <Button type="submit" className="w-full h-11 text-sm font-semibold rounded-xl transition-all active:scale-[0.98]" disabled={isLoading}>
                                    {isLoading ? 'Creating account...' : 'Create Account'}
                                </Button>
                            </form>
                        </div>

                        <p className="text-center text-xs text-muted-foreground">
                            Already have an account?{' '}
                            {onToggleLogin ? (
                                <button
                                    onClick={onToggleLogin}
                                    className="font-bold text-primary hover:text-primary/80 transition-colors"
                                >
                                    Sign in
                                </button>
                            ) : (
                                <Link href="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
                                    Sign in
                                </Link>
                            )}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="otp"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-col items-center gap-2 text-center text-pretty">
                            <button
                                onClick={() => setScreen('register')}
                                className="self-start flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
                            >
                                <ArrowLeft className="w-3 h-3" />
                                Edit Info
                            </button>
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
                            <p className="text-sm text-muted-foreground">
                                We sent a 6-digit code to <span className="text-foreground font-semibold uppercase">{email}</span>
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between gap-2 px-1">
                                {otp.map((digit, i) => (
                                    <Input
                                        key={i}
                                        id={`otp-${i}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        autoComplete="one-time-code"
                                        className="h-12 w-full text-center text-lg font-bold bg-muted/30 border-muted-foreground/20 rounded-xl"
                                        disabled={verifying || verified}
                                    />
                                ))}
                            </div>

                            {error && (
                                <p className="text-xs font-medium text-destructive text-center bg-destructive/10 py-2 rounded-lg">
                                    {error}
                                </p>
                            )}

                            {verified ? (
                                <div className="text-center p-3 rounded-xl bg-green-500/10 text-green-500 font-medium text-sm border border-green-500/20 animate-in zoom-in-95 duration-300">
                                    Email verified successfully!
                                </div>
                            ) : (
                                <Button
                                    onClick={handleVerify}
                                    className="w-full h-11 text-sm font-semibold rounded-xl"
                                    disabled={otp.join('').length !== 6 || verifying}
                                >
                                    {verifying ? 'Verifying...' : 'Verify Email'}
                                </Button>
                            )}

                            <p className="text-center text-xs text-muted-foreground">
                                Didn't receive the code?{' '}
                                <button
                                    onClick={() => resendOtp(email)}
                                    className="font-bold text-primary hover:text-primary/80 transition-colors"
                                >
                                    Resend
                                </button>
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
