import "./Register.css";
import { useState } from "react";
import { registerUser } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await registerUser(form);
      setMsg("Registrering lyckades! Du skickas till login…");
      setTimeout(() => nav("/login"), 800);
    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Något gick fel";
      setMsg(apiMsg);
      console.error("REGISTER ERROR:", err?.response || err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <h1>Registrera</h1>
      <form onSubmit={onSubmit}>
        <input
          placeholder="Användarnamn"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Lösenord"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button disabled={loading}>{loading ? "Skickar..." : "Skapa konto"}</button>
      </form>
      {msg && <p className="hint">{msg}</p>}
      <p>Har konto? <Link to="/login">Logga in</Link></p>
    </div>
  );
}
