import React, { useEffect, useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");

  // FETCH DATA
  useEffect(() => {
    fetch("http://localhost:4001/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetch users:", err));
  }, []);

  // FILTER DATA
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.nama.toLowerCase().includes(search.toLowerCase()) ||
      u.identitas.toLowerCase().includes(search.toLowerCase());

    const matchRole = filterRole ? u.role === filterRole : true;

    return matchSearch && matchRole;
  });

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
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Identitas</th>
                <th>Telepon</th>
                <th>Role</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.nama}</td>
                  <td>{user.identitas}</td>
                  <td>{user.telepon}</td>
                  <td>{user.role}</td>
                  <td>{user.status ? "Aktif" : "Nonaktif"}</td>
                  <td>
                    <button className="btn btn-warning btn-sm">Edit</button>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ marginLeft: "6px" }}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Tidak ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
