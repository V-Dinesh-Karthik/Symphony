import { create } from "zustand";

interface BearState {
  token: string;
  setToken: (tk: string) => void;
  deviceId: string;
  setDevice: (deviceId: string) => void;
}

export const useBearState = create<BearState>()((set) => ({
  token: "",
  setToken: (tk) => set({ token: tk }),
  deviceId: "",
  setDevice: (deviceId) => set({ deviceId: deviceId }),
}));
