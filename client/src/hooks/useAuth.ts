import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function useAuth() {
  const { setAuth, logout: logoutStore, user, isAuthenticated } = useAuthStore();

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post("/auth/register", { name, email, password });
      setAuth(response.data.user, response.data.token);
      toast.success("Account created successfully!");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed");
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      setAuth(response.data.user, response.data.token);
      toast.success("Logged in successfully!");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Continue with logout even if API call fails
    }
    logoutStore();
    toast.success("Logged out successfully");
  };

  const getCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data.user;
    } catch (error) {
      logoutStore();
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    register,
    login,
    logout,
    getCurrentUser,
  };
}
