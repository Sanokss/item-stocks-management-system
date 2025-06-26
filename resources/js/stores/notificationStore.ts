import { create } from 'zustand';

interface BarangMenipis {
    id: number;
    nama_barang: string;
    stok: number;
    satuan: string;
    minimum_stok: number; // Batas minimum stok
}

interface NotificationState {
    lowStockItems: BarangMenipis[];
    isNotificationOpen: boolean;
    unreadCount: number;

    // Actions
    setLowStockItems: (items: BarangMenipis[]) => void;
    addLowStockItem: (item: BarangMenipis) => void;
    removeLowStockItem: (id: number) => void;
    toggleNotification: () => void;
    closeNotification: () => void;
    markAsRead: () => void;
    checkStockLevel: (
        item: { id: number; nama_barang: string; stok: number; satuan: string },
        minStok?: number,
    ) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    lowStockItems: [],
    isNotificationOpen: false,
    unreadCount: 0,

    setLowStockItems: (items) =>
        set({
            lowStockItems: items,
            unreadCount: items.length,
        }),

    addLowStockItem: (item) =>
        set((state) => {
            const exists = state.lowStockItems.find(
                (existing) => existing.id === item.id,
            );
            if (!exists) {
                return {
                    lowStockItems: [...state.lowStockItems, item],
                    unreadCount: state.unreadCount + 1,
                };
            }
            return state;
        }),

    removeLowStockItem: (id) =>
        set((state) => ({
            lowStockItems: state.lowStockItems.filter((item) => item.id !== id),
            unreadCount: Math.max(0, state.unreadCount - 1),
        })),

    toggleNotification: () =>
        set((state) => ({
            isNotificationOpen: !state.isNotificationOpen,
        })),

    closeNotification: () =>
        set({
            isNotificationOpen: false,
        }),

    markAsRead: () =>
        set({
            unreadCount: 0,
        }),

    checkStockLevel: (item, minStok = 10) => {
        const { addLowStockItem, removeLowStockItem } = get();

        if (item.stok <= minStok) {
            addLowStockItem({
                id: item.id,
                nama_barang: item.nama_barang,
                stok: item.stok,
                satuan: item.satuan,
                minimum_stok: minStok,
            });
        } else {
            removeLowStockItem(item.id);
        }
    },
}));
