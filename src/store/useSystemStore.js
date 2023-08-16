import { create } from "zustand";

export const useSystemStore = create((set) => ({
  alert: {
    type: "",
    message: "",
    show: false,
  },
  setAlert: (alert) => set({ alert }),
  removeAlert: () =>
    set((state) => ({
      alert: {
        ...state.alert,
        show: false,
      },
    })),
  
}));

const setAlert = useSystemStore.getState().setAlert;
const removeAlert = useSystemStore.getState().removeAlert;

export {
  setAlert,
  removeAlert,
};
