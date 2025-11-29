import React, { useEffect, useState } from "react";

const Settings = () => {
  const [form, setForm] = useState({
    id: "",
    nama: "",
    telepon: "",
    email: "",
    alamat: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("sistem-token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const { id } = JSON.parse(token); // ambil id dari token
        const response = await fetch(
          `https://backend-sistem-tamu.vercel.app/users/${Number(id)}`
        );
        if (!response.ok) throw new Error("Gagal mengambil data user");

        const data = await response.json();
        setForm({
          id: data.id,
          nama: data.nama ?? "",
          telepon: data.telepon ?? "",
          email: data.email ?? "",
          alamat: data.alamat ?? "",
        });
      } catch (err) {
        console.error(err);
        window.location.href = "/login";
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    const { id, ...payload } = form;

    console.log("payload", payload);

    try {
      const response = await fetch(
        `https://backend-sistem-tamu.vercel.app/users/${Number(id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      console.log(response);

      if (!response.ok) {
        throw new Error("Gagal menyimpan perubahan ke server");
      }
    } catch (error) {
      console.log(error);
    }
    // TODO: panggil API update profile di sini
  };

  // console.log(user);

  return (
    <div className="container">
      {/* Card Pengaturan Profil */}
      <div className="card">
        <h2 className="card-title">Pengaturan Profil</h2>
        <form id="profileForm" onSubmit={handleSubmitProfile}>
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input
              type="text"
              className="form-control"
              id="profileName"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nomor Telepon</label>
            <input
              type="tel"
              className="form-control"
              name="telepon"
              value={form.telepon}
              onChange={handleChange}
              id="profilePhone"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Alamat</label>
            <textarea
              className="form-control"
              id="profileAddress"
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary">
            Simpan Perubahan
          </button>
        </form>
      </div>

      {/* Card Ubah Password */}
      {/* <div className="card">
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
      </div> */}
    </div>
  );
};

export default Settings;
