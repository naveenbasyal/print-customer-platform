import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  countryCode?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    collegeId: string;
  }) => Promise<{
    userId: string;
    email: string;
  }>;
  verifyOTP: (userId: string, otp: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      initialize: () => {
        // This will be called after hydration
        const { token } = get();
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          set({ isAuthenticated: true });
          // Fetch profile if we have a token but no user
          if (!get().user) {
            get()
              .fetchProfile()
              .catch(() => {
                // If profile fetch fails, logout
                get().logout();
              });
          }
        }
        set({ isLoading: false });
      },

      login: async (email: string, password: string) => {
        try {
          const response = await api.post("/login", {
            email,
            password,
          });
          const { token } = response.data.data;

          // Set token for future requests
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          set({ token, isAuthenticated: true });

          // Fetch user profile
          await get().fetchProfile();
        } catch (error: any) {
          throw new Error(error.response?.data?.message || "Login failed");
        }
      },

      register: async (data) => {
        try {
          const response = await api.post("/register", data);
          return response.data.data;
        } catch (error: any) {
          throw new Error(
            error.response?.data?.message || "Registration failed"
          );
        }
      },

      verifyOTP: async (userId: string, otp: string) => {
        try {
          const response = await api.post("/verify-otp", {
            userId,
            otp,
          });
          const { token } = response.data.data;

          // Set token for future requests
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          set({ token, isAuthenticated: true });

          // Fetch user profile
          await get().fetchProfile();
        } catch (error: any) {
          throw new Error(
            error.response?.data?.message || "OTP verification failed"
          );
        }
      },

      fetchProfile: async () => {
        try {
          const response = await api.get("/profile");
          set({ user: response.data.data });
        } catch (error: any) {
          throw new Error(
            error.response?.data?.message || "Failed to fetch profile"
          );
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          await api.patch("/change-password", {
            currentPassword,
            newPassword,
          });
        } catch (error: any) {
          throw new Error(
            error.response?.data?.message || "Failed to change password"
          );
        }
      },

      logout: () => {
        delete api.defaults.headers.common["Authorization"];
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        // Called after the persisted state is restored
        if (state) {
          state.initialize();
        }
      },
    }
  )
);

// Set token on app initialization
const token = useAuthStore.getState().token;
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
