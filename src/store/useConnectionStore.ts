import { create } from "zustand";

interface OpenStore {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const useOpenStore = create<OpenStore>((set) => ({
  open: false,
  setOpen: (value: boolean) => set({ open: value }),
}));
