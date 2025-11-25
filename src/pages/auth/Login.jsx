import { useState } from "react";
import "../../App.css";

const Login = () => {
  const [alertMsg, setAlertMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.loginEmail.value;
    const password = e.target.loginPassword.value;

    try {
      const res = await fetch("https://backend-sistem-tamu.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAlertMsg(data.message || "Login gagal.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setAlertMsg("Login berhasil! Mengalihkan...");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);
    } catch {
      setAlertMsg("Kesalahan server.");
    }
  };

  return (
    <div className="container_auth">
      <div className="card login-card">
        <div className="login-header">
          <h1 className="login-title">Buku Tamu Online</h1>
          <p className="login-subtitle">Sistem Manajemen Tamu Digital</p>
        </div>

        <div id="loginAlert" className="alert">{alertMsg}</div>

        <form id="loginForm" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="text" className="form-control" id="loginEmail" required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" id="loginPassword" required />
          </div>

          <button type="submit" className="btn btn-primary btn_daftar_akun">Login</button>

          <a href="/register">
            <button type="button" className="btn btn-secondary btn_daftar_akun">
              Daftar Akun Baru
            </button>
          </a>
        </form>

        <div className="footer_desc">
          <p><strong>Desain by Kelompok 6</strong></p>
          <p><strong>Nurhasan, Fariz Nurrahim, Aprien Febrian</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
