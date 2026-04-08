'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

/**
 * AuthHydrator handles initial session fetching on application load.
 * It ensures that if the user has valid httpOnly session cookies,
 * their profile is fetched and the global state is populated.
 */
export const AuthHydrator = () => {
    const getCurrentUser = useUserStore((state) => state.getCurrentUser);
    const isInitialized = useUserStore((state) => state.isInitialized);

    useEffect(() => {
        // Only fetch if not already initialized
        if (!isInitialized) {
            getCurrentUser();
        }
    }, [getCurrentUser, isInitialized]);

    return null;
};
