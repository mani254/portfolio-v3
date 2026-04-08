'use client';

import { RegisterForm } from '@/components/auth/register-form';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function RegisterPage() {
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/';

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-8 p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm shadow-2xl relative"
            >
                <Link 
                    href="/" 
                    className="absolute top-8 left-8 flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors group"
                >
                    <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                    Back
                </Link>

                <div className="pt-4">
                    <RegisterForm redirectUrl={redirectUrl} />
                </div>
            </motion.div>
        </div>
    );
}
