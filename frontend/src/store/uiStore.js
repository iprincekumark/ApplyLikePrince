import { create } from 'zustand';

const useUIStore = create((set) => ({
    // Theme
    theme: 'dark',
    toggleTheme: () =>
        set((state) => ({
            theme: state.theme === 'dark' ? 'light' : 'dark',
        })),
    setTheme: (theme) => set({ theme }),

    // Sidebar
    isSidebarOpen: false,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

    // Modal state
    modals: {},
    openModal: (modalId, data = null) =>
        set((state) => ({
            modals: { ...state.modals, [modalId]: { isOpen: true, data } },
        })),
    closeModal: (modalId) =>
        set((state) => ({
            modals: { ...state.modals, [modalId]: { isOpen: false, data: null } },
        })),
    isModalOpen: (modalId) => (state) => state.modals[modalId]?.isOpen ?? false,
    getModalData: (modalId) => (state) => state.modals[modalId]?.data ?? null,
}));

export default useUIStore;
