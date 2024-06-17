import { create } from 'zustand'

interface useProModalStore {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

export const useProModal = create<useProModalStore>((set) => {
    return {
        isOpen: false,
        onOpen: () => set({ isOpen: true }),
        onClose: () => set({ isOpen: false }),
    }
});

