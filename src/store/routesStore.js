import { create } from "zustand";

export const useRoutesStore = create((set) => ({
  routes: [],
  setRoutes: (routes) => set({ routes }),
  addRoute: (route) => set((state) => ({ routes: [...state.routes, route] })),
  removeRoute: (routeId) =>
    set((state) => ({
      routes: state.routes.filter((route) => route.id !== routeId),
    })),
  updateRoute: (routeId, route) =>
    set((state) => ({
      routes: state.routes.map((route) =>
        route.id === routeId ? { ...route, ...route } : route,
      ),
    })),
}));
