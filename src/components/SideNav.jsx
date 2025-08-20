import "./SideNav.css";
import { useAuth } from "../context/AuthProvider";

export default function SideNav() {
  const { auth, logout } = useAuth();

  return (
    <aside className="sidenav">
      <div className="me">
        {auth?.user?.avatar && (
          <img src={auth.user.avatar} alt="avatar" width="48" height="48" />
        )}
        <div>
          <div className="username">{auth?.user?.user}</div>
          <div className="email">{auth?.user?.email}</div>
        </div>
      </div>
      <button className="logout" onClick={logout}>Logga ut</button>
    </aside>
  );
}
