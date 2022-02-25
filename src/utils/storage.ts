import { get, set, del } from "idb-keyval"; // can use anything: IndexedDB, Ionic Storage, etc.
import { StateStorage } from "zustand/middleware";

export const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};
