import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      setUser(response.data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const isAdmin = () => {
    return user?.role?.name === "TrivixamCrmAdmin";
  };

  const isChildAdmin = () => {
    return user?.role?.name === "TrivixamCrmChildAdmin";
  };

  const hasRole = (roleName) => {
    return user?.role?.name === roleName;
  };

  const hasPermission = (permission) => {
    return user?.role?.permissions?.includes(permission) || false;
  };

  const getRoleLevel = () => {
    return user?.role?.level || 0;
  };

  const getRoleDisplayName = () => {
    return user?.role?.displayName || "Unknown Role";
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin,
    isChildAdmin,
    hasRole,
    hasPermission,
    getRoleLevel,
    getRoleDisplayName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
