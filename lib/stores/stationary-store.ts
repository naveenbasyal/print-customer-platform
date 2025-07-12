import { create } from "zustand";
import { api } from "@/lib/api";

interface Stationary {
  id: string;
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  isActive: boolean;
  canDeliver: boolean;
  address: string;
  collegeId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface PrintingRates {
  colorRate: number;
  bwRate: number;
  duplexExtra: number;
  hardbindRate: number;
  spiralRate: number;
}

interface StationaryState {
  stationaries: Stationary[];
  printingRates: PrintingRates | null;
  isLoading: boolean;
  fetchStationaries: () => Promise<void>;
  fetchPrintingRates: (stationaryId: string) => Promise<void>;
}

export const useStationaryStore = create<StationaryState>((set) => ({
  stationaries: [],
  printingRates: null,
  isLoading: false,

  fetchStationaries: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/student/get-stationaries");
      set({ stationaries: response.data.data });
    } catch (error: any) {
      console.error("Failed to fetch stationaries:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPrintingRates: async (stationaryId: string) => {
    try {
      try {
        const response = await api.get(
          `/student/printing-rates?stationaryId=${stationaryId}`
        );
        set({ printingRates: response.data.data });
        return;
      } catch (error: any) {
        // If GET with query params fails, try POST with body
        if (error.response?.status === 404 || error.response?.status === 405) {
          try {
            const response = await api.post("/student/printing-rates", {
              stationaryId,
            });
            set({ printingRates: response.data.data });
            return;
          } catch (postError: any) {
            // If POST also fails, try GET with body (unusual but possible)
            if (
              postError.response?.status === 404 ||
              postError.response?.status === 405
            ) {
              const response = await api.get("/student/printing-rates", {
                data: { stationaryId },
              });
              set({ printingRates: response.data.data });
              return;
            }
            throw postError;
          }
        }
        throw error;
      }
    } catch (error: any) {
      console.error("Failed to fetch printing rates:", error);
      // Set default rates if API fails
      set({
        printingRates: {
          colorRate: 10,
          bwRate: 2,
          duplexExtra: 1,
          hardbindRate: 40,
          spiralRate: 20,
        },
      });
    }
  },
}));
