import React from "react";

const Register = () => {
  return (
    <div className="container_auth">
      <div className="card login-card">
        <div className="login-header">
          <h2 className="login-title">Registrasi Akun Baru</h2>
        </div>

        <form id="registerForm">
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input type="text" className="form-control" id="regName" required />
          </div>

          <div className="form-group">
            <label className="form-label">Identitas</label>
            <input
              type="text"
              className="form-control"
              id="regEmail"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="regPassword"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nomor Telepon</label>
            <input type="tel" className="form-control" id="regPhone" required />
          </div>

          <div className="form-group">
            <label className="form-label">Alamat</label>
            <textarea
              className="form-control"
              id="regAddress"
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary btn_daftar_akun">
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
