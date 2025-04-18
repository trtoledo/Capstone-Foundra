import { createContext, useState, useContext, useEffect } from "react";

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
    setToken(storedToken);
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
