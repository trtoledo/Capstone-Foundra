import { createContext, useState, useContext, useEffect } from "react";

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
        setUser({ id: localStorage.getItem("id")});
        setRole(localStorage.getItem("role"));
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

//< suppressCustomElementsWarning={true}>

export default AuthContext;
