import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '@services/authService';

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Login action
            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.login(credentials);
                    const { accessToken, refreshToken, user } = response;

                    set({
                        user,
                        accessToken,
                        refreshToken,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });

                    return { success: true };
                } catch (error) {
                    const message = error.response?.data?.message || 'Login failed';
                    set({ isLoading: false, error: message });
                    return { success: false, error: message };
                }
            },

            // Register action
            register: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.register(userData);
                    const { accessToken, refreshToken, user } = response;

                    set({
                        user,
                        accessToken,
                        refreshToken,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });

                    return { success: true };
                } catch (error) {
                    const message = error.response?.data?.message || 'Registration failed';
                    set({ isLoading: false, error: message });
                    return { success: false, error: message };
                }
            },

            // Logout action
            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            // Refresh token action
            refreshAccessToken: async () => {
                const { refreshToken } = get();
                if (!refreshToken) return false;

                try {
                    const response = await authService.refreshToken(refreshToken);
                    set({
                        accessToken: response.accessToken,
                        refreshToken: response.refreshToken,
                    });
                    return true;
                } catch (error) {
                    get().logout();
                    return false;
                }
            },

            // Update user profile
            updateUser: (userData) => {
                set((state) => ({
                    user: { ...state.user, ...userData },
                }));
            },

            // Clear error
            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;
