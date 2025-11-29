import React, { useState } from "react";
import LoadingDots from "../../utils/Loading";

const Register = () => {
  const [login, setLogin] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    telepon: "",
    role: "",
    alamat: "",
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
    console.log(form);
    setLogin(true);

    try {
      const resp = await fetch(
        "https://backend-sistem-tamu.vercel.app/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await resp.json();
      console.log(data);

      if (data) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLogin(false);
    }
  };

  return (
    <div className="container_auth">
      <div className="card login-card">
        <div className="login-header">
          <h2 className="login-title">Registrasi Akun Baru</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input
              type="text"
              className="form-control"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-control"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">-- Pilih Role --</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Nomor Telepon</label>
            <input
              type="tel"
              className="form-control"
              name="telepon"
              value={form.telepon}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Alamat</label>
            <textarea
              className="form-control"
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={`btn btn-${
              login ? "secondary" : "primary"
            } btn_daftar_akun`}
          >
            {login ? <LoadingDots size={12} color="#fff" /> : "Daftar"}
          </button>
          <a href="/login">
            <button type="button" className="btn btn-secondary btn_daftar_akun">
              Sudah Punya Akun
            </button>
          </a>
        </form>
      </div>
    </div>
  );
};

export default Register;
