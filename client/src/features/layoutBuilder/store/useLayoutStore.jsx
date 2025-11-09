import { create } from "zustand";

export const useLayoutStore = create((set) => ({
    widgets: [],
    widgetsLayout: [],
    placeholder: null,
    overlay: null,
    setPlaceholder: (type, position) => set({ placeholder: { id: 'virtual', type, position } }),
    setOverlay: (overlay) => set({ overlay: overlay }),
    clearPlaceholder: () => set({ placeholder: null }),
    setWidgetsSchemas: (widgets) => set({ widgets: widgets }),
    setWidgetsLayout: (widgets) => set({ widgetsLayout: widgets })
}));