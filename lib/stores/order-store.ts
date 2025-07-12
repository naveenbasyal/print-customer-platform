import { create } from "zustand";
import { api } from "@/lib/api";

interface OrderItem {
  id: string;
  name: string;
  fileUrl: string;
  coloured: boolean;
  duplex: boolean;
  spiral: boolean;
  hardbind: boolean;
  quantity: number;
  price: number;
  fileType: string;
  orderId: string;
  cartItemId: string | null;
  createdAt: string;
  updatedAt: string;
}

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

interface Order {
  id: string;
  userId: string;
  collegeId: string;
  stationaryId: string;
  status: string;
  totalPrice: number;
  paymentId: string | null;
  otp: string;
  orderType: "DELIVERY" | "TAKEAWAY";
  deliveryAddress: string | null;
  deliveryFee: number;
  cartId: string;
  createdAt: string;
  updatedAt: string;
  platformFee: number;
  OrderItem?: OrderItem[];
  stationary: Stationary;
}

interface CreateOrderData {
  stationaryId: string;
  orderType: "DELIVERY" | "TAKEAWAY";
  deliveryAddress?: string;
}

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  createOrder: (data: CreateOrderData) => Promise<any>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,

  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/student/orders");
      set({ orders: response.data.data });
    } catch (error: any) {
      console.error("Failed to fetch orders:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  createOrder: async (data: CreateOrderData) => {
    try {
      const response = await api.post("/student/create-order", data);
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to create order"
      );
    }
  },
}));
