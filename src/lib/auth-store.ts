import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    name: string;
    role: 'admin' | 'staff';
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (id: string, name: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (id, name) => {
                // 간단한 Mock 로그인 로직
                set({
                    user: { id, name, role: 'admin' },
                    isAuthenticated: true
                });
            },
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage', // 로컬 스토리지에 저장될 이름
        }
    )
);
