"use client";

import { create } from "zustand";

type PortfolioState = {
  selectedOrganization: string;
  setSelectedOrganization: (value: string) => void;
};

export const usePortfolioStore = create<PortfolioState>((set) => ({
  selectedOrganization: "AUREON GROUP",
  setSelectedOrganization: (selectedOrganization) => set({ selectedOrganization })
}));
