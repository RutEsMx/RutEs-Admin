import { create } from "zustand";

export const useDriversStore = create((set) => ({
  drivers: [],
  allDrivers: [],
  setDrivers: (drivers) => set({ drivers }),
  addDrivers: (driver) =>
    set((state) => ({
      drivers: {
        ...state.drivers,
        rows: [...state.drivers.rows, driver],
      },
    })),
  removeDrivers: (driverId) =>
    set((state) => ({
      drivers: {
        ...state.drivers,
        rows: state.drivers.rows.filter((driver) => driver.id !== driverId),
      },
    })),
  updateDrivers: (driverId, data) =>
    set((state) => ({
      drivers: {
        ...state.drivers,
        rows: state.drivers.rows.map((driver) =>
          driver.id === driverId ? { ...driver, ...data } : driver,
        ),
      },
    })),
  getDriver: (driverId) =>
    set((state) => state.drivers.rows.find((driver) => driver.id === driverId)),
  setAllDrivers: (allDrivers) => set({ allDrivers }),
}));

const setDrivers = useDriversStore.getState().setDrivers;
const getDriver = useDriversStore.getState().getDriver;
const addDrivers = useDriversStore.getState().addDrivers;
const updateDrivers = useDriversStore.getState().updateDrivers;
const removeDrivers = useDriversStore.getState().removeDrivers;
const setAllDrivers = useDriversStore.getState().setAllDrivers;

export {
  setDrivers,
  getDriver,
  addDrivers,
  updateDrivers,
  removeDrivers,
  setAllDrivers,
};
