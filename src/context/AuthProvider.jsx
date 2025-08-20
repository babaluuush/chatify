import { createContext, useContext, useState } from "react";
import { loadAuth, saveAuth, clearAuth } from "../services/authService";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadAuth());

  function login(token) {
    const next = saveAuth(token);
    setAuth(next);
  }
  function logout() {
    clearAuth();
    setAuth(null);
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
