import { create } from "zustand";

export const useRoutesStore = create((set) => ({
  routes: [],
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
  stops: [],
  addStops: (stop) => set((state) => ({ stops: [...state.stops, stop] })),
  removeStop: (stopId) =>
    set((state) => ({
      stops: state.stops.filter((stop) => stop.id !== stopId),
    })),
  updateStop: (stopId) =>
    set((state) => ({
      stops: state.stops.map((stop) =>
        stop.id === stopId ? { ...stop, ...stop } : stop,
      ),
    })),
}));

const addStops = useRoutesStore.getState().addStops;
const updateStop = useRoutesStore.getState().updateStop;
const removeStop = useRoutesStore.getState().removeStop;

const addRoute = useRoutesStore.getState().addRoute;
const updateRoute = useRoutesStore.getState().updateRoute;
const removeRoute = useRoutesStore.getState().removeRoute;

export { addStops, updateStop, removeStop, addRoute, updateRoute, removeRoute };