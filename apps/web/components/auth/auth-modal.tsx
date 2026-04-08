'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useAuthModalStore } from '@/store/auth-modal-store';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';
import { AnimatePresence, motion } from 'framer-motion';

export const AuthModal = () => {
    const { isOpen, view, redirectUrl, closeModal, setView } = useAuthModalStore();

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent className="sm:max-w-[440px] p-0 border-none shadow-none overflow-hidden">
                <DialogTitle className="sr-only">
                    {view === 'login' ? 'Sign In' : 'Create Account'}
                </DialogTitle>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="bg-card/80 py-8 px-4"
                >
                    <AnimatePresence mode="wait">
                        {view === 'login' ? (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <LoginForm
                                    isModal
                                    redirectUrl={redirectUrl || undefined}
                                    onSuccess={closeModal}
                                    onToggleRegister={() => setView('register')}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="register"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <RegisterForm
                                    isModal
                                    redirectUrl={redirectUrl || undefined}
                                    onSuccess={closeModal}
                                    onToggleLogin={() => setView('login')}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};
