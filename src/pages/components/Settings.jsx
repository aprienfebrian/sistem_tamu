  import React from "react";

  const Settings = () => {
    return (
      <div class="container">
        <div className="card">
          <h2 className="card-title">Pengaturan Profil</h2>
          <form id="profileForm">
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input
                type="text"
                className="form-control"
                id="profileName"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Identitas</label>

              <input
                type="text"
                className="form-control"
                id="profileEmail"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nomor Telepon</label>
              <input
                type="tel"
                className="form-control"
                id="profilePhone"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Alamat</label>
              <textarea className="form-control" id="profileAddress"></textarea>
            </div>

            <button type="submit" className="btn btn-primary">
              Simpan Perubahan
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">Ubah Password</h2>
          <form id="passwordForm">
            <div className="form-group">
              <label className="form-label">Password Lama</label>
              <input
                type="password"
                className="form-control"
                id="oldPassword"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password Baru</label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Konfirmasi Password Baru</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Ubah Password
            </button>
          </form>
        </div>
      </div>
    );
  };

  export default Settings;
