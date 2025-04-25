import { createContext, useState, useContext, useEffect } from "react";
import { fetchSingleUser } from '../../api/users';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const fetchUser = async () => {
          const userData = await fetchSingleUser(localStorage.getItem("id"));
          if (userData) {
            setUser(userData);
            setRole(userData.role);
            localStorage.setItem("id", userData.id);
            localStorage.setItem("role", userData.role);
          } else {
            setUser(null);
            setRole("");
            console.error("Failed to fetch user data.");
          }
        };

        fetchUser();
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setUser(null);
        setRole("");
      }
    } else {
      setUser(null);
      setRole("");
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