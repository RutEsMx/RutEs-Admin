import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useParentsStore = create(
  persist(
    (set) => ({
      parents: [],
      setParents: (parents) => set({ parents }),
    }),
    {
      name: "parents-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

const setParents = useParentsStore.getState().setParents;

export { setParents };
