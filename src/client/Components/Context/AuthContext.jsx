import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ token, setToken, refresh, setRefresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;