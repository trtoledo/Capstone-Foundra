import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode }from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null); // Store user info
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setUser({ id: decoded.userId });
        setRole(decoded.role);
      } catch (err) {
        console.error("Failed to decode token:", err);
        setToken(null);
        setUser(null);
        setRole("");
      }
    }
    setLoading(false);
  }, [refresh]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        refresh,
        setRefresh,
        user,
        setUser,
        loading,
        role,
        setRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
