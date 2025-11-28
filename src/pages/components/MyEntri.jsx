import React, { useEffect } from "react";

const MyEntri = () => {
  useEffect(() => {
    const token = localStorage.getItem("sistem-token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);
  return (
    <div class="container">
      <div class="card">
        <h2 class="card-title">Entri Saya</h2>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama Tamu</th>
                <th>Institusi</th>
                <th>keperluan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="myEntriesTable">
              <tr>
                <td colspan="6" className="memuat_data">
                  Memuat data...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyEntri;
