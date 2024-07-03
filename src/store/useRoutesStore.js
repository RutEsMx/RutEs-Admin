import { DAYS_OPTIONS } from "@/utils/options";
import { create } from "zustand";

const SELECT_DAY = DAYS_OPTIONS.slice(1);

export const useRoutesStore = create((set) => ({
  routes: [],
  typeTravel: "toHome",
  setRoutes: (routes) => set({ routes }),
  addRoute: (route) => set((state) => ({ routes: [...state.routes, route] })),
  removeRoute: (routeId) =>
    set((state) => ({
      routes: state.routes.filter((route) => route.id !== routeId),
    })),
  updateRoute: (routeId) =>
    set((state) => ({
      routes: state.routes.map((route) =>
        route.id === routeId ? { ...route, ...route } : route,
      ),
    })),
  selectedDayEdit: SELECT_DAY[new Date().getDay() - 1]?.value || "monday",
  setSelectedDayEdit: (day) => set({ selectedDayEdit: day }),
  setTypeTravel: (type) => set({ typeTravel: type }),
}));

const addRoute = useRoutesStore.getState().addRoute;
const updateRoute = useRoutesStore.getState().updateRoute;
const removeRoute = useRoutesStore.getState().removeRoute;
const setRoutes = useRoutesStore.getState().setRoutes;
const selectedDayEdit = useRoutesStore.getState().selectedDayEdit;

export { addRoute, updateRoute, removeRoute, setRoutes, selectedDayEdit };
