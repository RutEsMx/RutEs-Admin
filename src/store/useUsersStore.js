import { create } from "zustand";

export const useUsersStore = create((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
}));

const setUsers = useUsersStore.getState().setUsers;

export { setUsers };
