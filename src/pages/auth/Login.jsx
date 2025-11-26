import { useState } from "react";
import "../../App.css";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resp = await fetch(
        "https://backend-sistem-tamu.vercel.app/auth.login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: form,
        }
      );
      console.log(resp);
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <div className="container_auth">
      <div className="card login-card">
        <div className="login-header">
          <h1 className="login-title">Buku Tamu Online</h1>
          <p className="login-subtitle">Sistem Manajemen Tamu Digital</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="form-control"
              name="email"
              required
              placeholder="admin@buku.com / user@buku.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              required
              name="password"
              placeholder="admin123 / user123"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary btn_daftar_akun">
            Login
          </button>

          <a href="/register">
            <button type="button" className="btn btn-secondary btn_daftar_akun">
              Daftar Akun Baru
            </button>
          </a>
        </form>

        <div className="footer_desc">
          <p>
            <strong>Desain by Kelompok 6</strong>
          </p>
          <p>
            <strong>Nurhasan, Fariz Nurrahim, Aprien Febrian</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
