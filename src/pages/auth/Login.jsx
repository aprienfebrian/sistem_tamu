import { useState } from "react";
import "../../App.css";
import Loading from "../../utils/Loading";

const Login = () => {
  const [login, setLogin] = useState(false);
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
    setLogin(true);
    try {
      const resp = await fetch(
        "https://backend-sistem-tamu.vercel.app/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await resp.json();
      console.log(data);

      if (data) {
        if (typeof data === "string") {
          alert(data);
          return;
        }
        localStorage.setItem("sistem-token", JSON.stringify(data));

        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLogin(false);
    }
  };

  return (
    <>
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
                placeholder=""
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
                placeholder=""
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className={`btn btn-${
                login ? "secondary" : "primary"
              } btn_daftar_akun`}
            >
              {login ? <Loading size={12} color="#fff" /> : "Login"}
            </button>

            <a href="/register">
              <button
                type="button"
                className="btn btn-secondary btn_daftar_akun"
              >
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
    </>
  );
};

export default Login;
