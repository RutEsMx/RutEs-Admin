import { create } from "zustand";

export const useUnitsStore = create((set) => ({
  units: [],
  allUnits: [],
  setUnits: (units) => set({ units }),
  addUnits: (unit) =>
    set((state) => ({
      units: {
        ...state.units,
        rows: [...state.units.rows, unit],
      },
    })),
  removeUnits: (unitId) =>
    set((state) => ({
      units: {
        ...state.units,
        rows: state.units.rows.filter((unit) => unit.id !== unitId),
      },
    })),
  updateUnits: (unitId, data) =>
    set((state) => ({
      units: {
        ...state.units,
        rows: state.units.rows.map((unit) =>
          unit.id === unitId ? { ...unit, ...data } : unit,
        ),
      },
    })),
  getUnit: (unitId) =>
    set((state) => state.units.rows.find((unit) => unit.id === unitId)),
  setAllUnits: (allUnits) => set({ allUnits }),
}));

const setUnits = useUnitsStore.getState().setUnits;
const getUnit = useUnitsStore.getState().getUnit;
const addUnits = useUnitsStore.getState().addUnits;
const updateUnits = useUnitsStore.getState().updateUnits;
const removeUnits = useUnitsStore.getState().removeUnits;
const setAllUnits = useUnitsStore.getState().setAllUnits;

export { setUnits, getUnit, addUnits, updateUnits, removeUnits, setAllUnits };
