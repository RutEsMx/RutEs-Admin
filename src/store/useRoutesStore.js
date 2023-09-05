import { create } from "zustand";

export const useRoutesStore = create((set) => ({
  routes: [],
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
}));

const addRoute = useRoutesStore.getState().addRoute;
const updateRoute = useRoutesStore.getState().updateRoute;
const removeRoute = useRoutesStore.getState().removeRoute;
const setRoutes = useRoutesStore.getState().setRoutes;

export { addRoute, updateRoute, removeRoute, setRoutes };
