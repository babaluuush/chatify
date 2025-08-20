import "./Login.css";
import { useState } from "react";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const { token } = await loginUser(form);
      login(token);
      nav("/");
    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Invalid credentials";
      setMsg(apiMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <h1>Logga in</h1>
      <form onSubmit={onSubmit}>
        <input
          placeholder="Användarnamn"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        <input
          placeholder="Lösenord"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button disabled={loading}>{loading ? "Loggar in..." : "Logga in"}</button>
      </form>
      {msg && <p className="error">{msg}</p>}
      <p>Ny här? <Link to="/register">Skapa konto</Link></p>
    </div>
  );
}
