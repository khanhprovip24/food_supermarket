import { createContext, useContext, useState, useCallback, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Kiểm tra xem người dùng còn đăng nhập không khi load app
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const response = await authService.getProfile();
          if (response.success) {
            setUser(response.user);
          } else {
            // Session hết hạn hoặc không hợp lệ
            setUser(null);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          setUser(null);
        }
      }
    };
    checkAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        setUser(response.user);
        return { success: true };
      } else {
        setError(response.errors);
        return { success: false, errors: response.errors };
      }
    } catch (err) {
      const errorMsg = { detail: err.message };
      setError(errorMsg);
      return { success: false, errors: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      if (response.success) {
        setUser(response.user);
        return { success: true };
      } else {
        setError(response.errors);
        return { success: false, errors: response.errors };
      }
    } catch (err) {
      const errorMsg = { detail: err.message };
      setError(errorMsg);
      return { success: false, errors: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
