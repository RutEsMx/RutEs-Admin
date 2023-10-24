import { create } from "zustand";

export const useAuxiliarsStore = create((set) => ({
  auxiliars: [],
  auxiliarsRoutes: [],
  setAuxiliars: (auxiliars) => set({ auxiliars }),
  setAuxiliarsRoutes: (auxiliarsRoutes) => set({ auxiliarsRoutes }),
  addAuxiliars: (auxiliar) =>
    set((state) => ({
      auxiliars: {
        ...state.auxiliars,
        rows: [...state.auxiliars.rows, auxiliar],
      },
    })),
  removeAuxiliars: (auxiliarId) =>
    set((state) => ({
      auxiliars: {
        ...state.auxiliars,
        rows: state.auxiliars.rows.filter(
          (auxiliar) => auxiliar.id !== auxiliarId,
        ),
      },
    })),
  updateAuxiliars: (auxiliarId, data) =>
    set((state) => ({
      auxiliars: {
        ...state.auxiliars,
        rows: state.auxiliars.rows.map((auxiliar) =>
          auxiliar.id === auxiliarId ? { ...auxiliar, ...data } : auxiliar,
        ),
      },
    })),
  getAuxiliar: (auxiliarId) =>
    set((state) =>
      state.auxiliars.rows.find((auxiliar) => auxiliar.id === auxiliarId),
    ),
}));

const setAuxiliars = useAuxiliarsStore.getState().setAuxiliars;
const setAuxiliarsRoutes = useAuxiliarsStore.getState().setAuxiliarsRoutes;
const getAuxiliar = useAuxiliarsStore.getState().getAuxiliar;
const addAuxiliars = useAuxiliarsStore.getState().addAuxiliars;
const updateAuxiliars = useAuxiliarsStore.getState().updateAuxiliars;
const removeAuxiliars = useAuxiliarsStore.getState().removeAuxiliars;

export {
  setAuxiliars,
  setAuxiliarsRoutes,
  getAuxiliar,
  addAuxiliars,
  updateAuxiliars,
  removeAuxiliars,
};
