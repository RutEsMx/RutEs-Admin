import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useParentsStore = create(
  persist(
    (set) => ({
      parents: [],
      isLoading: false, // 👈 agregado
      setParents: (parents) => set({ parents }),
      setLoading: (loading) => set({ isLoading: loading }), // 👈 agregado
    }),
    {
      name: "parents-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

const setParents = useParentsStore.getState().setParents;

export { setParents };
