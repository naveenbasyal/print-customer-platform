import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";

interface CartItem {
  id: string;
  name: string;
  fileUrl: string;
  fileId: string;
  coloured: boolean;
  duplex: boolean;
  spiral: boolean;
  hardbind: boolean;
  quantity: number;
  price: number;
  fileType: string;
  cartId: string;
  createdAt: string;
  updatedAt: string;
}

interface FileConfig {
  file: File;
  name: string;
  coloured: boolean;
  duplex: boolean;
  spiral: boolean;
  hardbind: boolean;
  quantity: number;
  price: number;
  fileType: string;
}

interface CartState {
  items: CartItem[];
  selectedStationaryId: string | null;
  isLoading: boolean;
  fetchCartItems: () => Promise<void>;
  uploadFiles: (files: File[], configs: FileConfig[]) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
  setSelectedStationary: (stationaryId: string) => void;
  recalculateCartPrices: (newRates: any) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedStationaryId: null,
      isLoading: false,

      fetchCartItems: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get("/cart");
          set({ items: response.data.data });
        } catch (error: any) {
          console.error("Failed to fetch cart items:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      uploadFiles: async (files: File[], configs: FileConfig[]) => {
        try {
          const formData = new FormData();

          files.forEach((file) => {
            formData.append("files", file);
          });

          const metadata = configs.map((config) => ({
            name: config.name,
            coloured: config.coloured,
            duplex: config.duplex,
            spiral: config.spiral,
            hardbind: config.hardbind,
            quantity: config.quantity,
            price: config.price,
            fileType: config.fileType,
          }));

          formData.append("metadata", JSON.stringify(metadata));

          await api.post("/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          await get().fetchCartItems();
        } catch (error: any) {
          console.error("Upload error:", error);
          throw new Error(error.response?.data?.message || "Upload failed");
        }
      },

      removeItem: async (itemId: string) => {
        try {
          await api.delete(`/cart/${itemId}`);
          set({ items: get().items.filter((item) => item.id !== itemId) });
        } catch (error: any) {
          throw new Error(
            error.response?.data?.message || "Failed to remove item"
          );
        }
      },

      setSelectedStationary: (stationaryId: string) => {
        set({ selectedStationaryId: stationaryId });
      },

      recalculateCartPrices: (newRates: any) => {
        const { items } = get();
        const updatedItems = items.map((item) => {
          let basePrice = item.coloured ? newRates.colorRate : newRates.bwRate;
          if (item.duplex) basePrice += newRates.duplexExtra;
          if (item.spiral) basePrice += newRates.spiralRate;
          if (item.hardbind) basePrice += newRates.hardbindRate;

          return {
            ...item,
            price: basePrice * item.quantity,
          };
        });
        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [], selectedStationaryId: null });
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        selectedStationaryId: state.selectedStationaryId,
      }),
    }
  )
);
