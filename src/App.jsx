import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import SideNav from "./components/SideNav";

export default function App() {
  const { auth } = useAuth();
  const isLoggedIn = !!auth;

  return (
    <div className="app">
      {isLoggedIn ? (
        <div className="layout">
          <SideNav />
          <main><Outlet /></main>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}

export function PrivateRoute({ children }) {
  const { auth } = useAuth();
  return auth ? children : <Navigate to="/login" replace />;
}
