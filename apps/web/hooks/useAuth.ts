import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
    const user = useUserStore(state => state.user);
    const isLoading = useUserStore(state => state.isLoading);
    const fetchMe = useUserStore(state => state.fetchMe);
    
    const actions = useAuthStore();

    return {
        user,
        isLoading,
        isAuth: !!user,
        fetchMe,
        ...actions,
    };
}
