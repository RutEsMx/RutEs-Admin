import { create } from "zustand";

export const useParentsStore = create((set) => ({
  parents: [],
  setParents: (parents) => set({ parents }),
}));

const setParents = useParentsStore.getState().setParents;

export { setParents };
