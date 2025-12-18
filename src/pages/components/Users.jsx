import React, { useEffect, useState } from "react";
import LoadingDots from "../../utils/Loading";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [editEntry, setEditEntry] = useState(null);

  const openEditModal = ({ id, role }) => {
    setEditEntry({ id, role });
    console.log(editEntry);
  };
  const deleteUser = async (id) => {
    if (window.confirm("Yakin ingin menghapus data ini secara permanen?")) {
      try {
        const response = await fetch(
          `https://backend-sistem-tamu.vercel.app/users/${Number(id)}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Gagal menghapus data dari server");
        }

        // Update state lokal setelah berhasil
        alert("Data berhasil dihapus!");
      } catch (err) {
        console.error("Gagal menghapus entri:", err);
        alert("Gagal menghapus data! Silakan cek koneksi atau server.");
      }
    }
  };
  const closeEditModal = () => setEditEntry(null);

  const handleEditChange = (e) => {
    setEditEntry({ ...editEntry, [e.target.name]: e.target.value });
  };
  const saveEditChanges = async (e) => {
    e.preventDefault();
    const { id, ...payload } = editEntry;
    console.log(payload);

    try {
      const response = await fetch(
        `https://backend-sistem-tamu.vercel.app/users/${Number(id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal menyimpan perubahan ke server");
      }

      // Update state lokal setelah berhasil
      closeEditModal();
      alert("Data berhasil diperbarui!");
    } catch (err) {
      console.error("Gagal menyimpan perubahan:", err);
      alert("Gagal menyimpan perubahan! Silakan coba lagi.");
    }
  };

  // FETCH DATA
  useEffect(() => {
    fetch("https://backend-sistem-tamu.vercel.app/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
        // ← matikan loading ketika data sudah ada
      })
      .catch((err) => console.error("Error fetch users:", err));
  }, []);

  // FILTER DATA
  const filteredUsers = users.filter((u) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      u.nama?.toLowerCase().includes(keyword) ||
      u.email?.toLowerCase().includes(keyword) ||
      u.telepon?.toLowerCase().includes(keyword);

    const matchRole = filterRole === "" || u.role === filterRole;

    return matchSearch && matchRole;
  });

  useEffect(() => {
    const token = localStorage.getItem("sistem-token");

    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2 className="card-title">Kelola User</h2>

        <div className="search-filter">
          <div className="search-box">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Cari nama atau identitas..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="form-control filter-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">Semua Role</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th
                  colSpan="5"
                  className="memuat_data"
                  style={{ textAlign: "start" }}
                >
                  Nama
                </th>
                <th
                  colSpan="5"
                  className="memuat_data"
                  style={{ textAlign: "start" }}
                >
                  Telepon
                </th>
                <th
                  colSpan="5"
                  className="memuat_data"
                  style={{ textAlign: "start" }}
                >
                  Role
                </th>
                <th
                  colSpan="5"
                  className="memuat_data"
                  style={{ textAlign: "start" }}
                >
                  Status
                </th>
                <th
                  colSpan="5"
                  className="memuat_data"
                  style={{ textAlign: "start" }}
                >
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td
                    colSpan="5"
                    className="memuat_data"
                    style={{ textAlign: "start" }}
                  >
                    {user.nama}
                  </td>
                  <td
                    colSpan="5"
                    className="memuat_data"
                    style={{ textAlign: "start" }}
                  >
                    {user.telepon}
                  </td>
                  <td
                    colSpan="5"
                    className="memuat_data"
                    style={{ textAlign: "start" }}
                  >
                    {user.role}
                  </td>
                  <td
                    colSpan="5"
                    className="memuat_data"
                    style={{ textAlign: "start" }}
                  >
                    {user.status ? "Aktif" : "Nonaktif"}
                  </td>
                  <td
                    colSpan="5"
                    className="memuat_data"
                    style={{ textAlign: "start" }}
                  >
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() =>
                        openEditModal({ id: user.id, role: user.role })
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteUser(user.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && loading && (
                <tr>
                  <td colSpan="25" style={{ textAlign: "center" }}>
                    <LoadingDots size={12} color="#fff" />
                  </td>
                </tr>
              )}

              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="25" style={{ textAlign: "center" }}>
                    Data tidak ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editEntry && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-centered">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Edit Entri</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeEditModal}
                >
                  X
                </button>
              </div>

              <div className="modal-body">
                <label className="form-label">Role</label>
                <select
                  className="form-control mb-3"
                  name="role"
                  value={editEntry.role}
                  onChange={handleEditChange}
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-primary me-2"
                  onClick={saveEditChanges}
                >
                  Simpan Perubahan
                </button>
                <button className="btn btn-secondary" onClick={closeEditModal}>
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
