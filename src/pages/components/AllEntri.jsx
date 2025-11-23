import React, { useEffect, useState } from "react";

const AllEntri = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4001/entri")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching entries:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2 className="card-title">Semua Entri Buku Tamu</h2>

        <div className="export-btns">
          <button className="btn btn-success btn-sm">📊 Export CSV</button>
          <button className="btn btn-success btn-sm">📄 Export PDF</button>
          <button className="btn btn-primary btn-sm">🖨️ Print</button>
        </div>

        <div className="search-filter">
          <div className="search-box">
            <input
              type="text"
              className="form-control"
              id="searchEntries"
              placeholder="🔍 Cari nama, institusi, atau keperluan..."
            />
          </div>
          <select className="form-control filter-select" id="filterStatus">
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Selesai</option>
          </select>
          <select className="form-control filter-select" id="filterDate">
            <option value="">Semua Tanggal</option>
            <option value="today">Hari Ini</option>
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini</option>
          </select>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama</th>
                <th>Identitas</th>
                <th>Jumlah Tamu</th>
                <th>Institusi</th>
                <th>Keperluan</th>
                <th>Bertemu</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody id="entriesTable">
              {loading ? (
                <tr>
                  <td colSpan="9">Memuat data...</td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan="9">Tidak ada data.</td>
                </tr>
              ) : (
                entries.map((e) => (
                  <tr key={e.id}>
                    <td>{new Date(e.tanggal).toLocaleString()}</td>
                    <td>{e.nama}</td>
                    <td>{e.identitas}</td>
                    <td>{e.jumlah_tamu}</td>
                    <td>{e.institusi}</td>
                    <td>{e.keperluan}</td>
                    <td>{e.bertemu}</td>
                    <td>{e.status}</td>
                    <td>
                      <button className="btn btn-sm btn-primary">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllEntri;
