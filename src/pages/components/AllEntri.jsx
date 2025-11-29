import React, { useEffect, useState } from "react";

const AllEntri = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const exportCSV = () => {
  if (entries.length === 0) return alert("Tidak ada data untuk diexport!");

  // Buat header CSV
  const header = [
    "Tanggal",
    "Nama",
    "Identitas",
    "Jumlah Tamu",
    "Institusi",
    "Keperluan",
    "Bertemu",
    "Status"
  ];

  // Convert array entries → CSV rows
  const rows = entries.map(e => [
    new Date(e.tanggal).toLocaleString(),
    e.nama,
    e.identitas,
    e.jumlah_tamu,
    e.institusi,
    e.keperluan,
    e.bertemu,
    e.status
  ]);

  // Gabung header + rows
  const csvContent =
    [header, ...rows].map(row => row.join(",")).join("\n");

  // Buat blob file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // Buat link download
  const link = document.createElement("a");
  link.href = url;
  link.download = "data_buku_tamu.csv";
  link.click();
};

const exportPDF = () => {
  const printContent = document.querySelector(".table-container").innerHTML;
  const newWindow = window.open("", "", "width=900,height=700");

  newWindow.document.write(`
    <html>
      <head>
        <title>Export PDF</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 8px; font-size: 12px; }
          th { background: #f2f2f2ff; }
        </style>
      </head>
      <body>
        <h3>Data Buku Tamu</h3>
        ${printContent}
      </body>
    </html>
  `);

  newWindow.document.close();
  newWindow.print();
};

  useEffect(() => {
    fetch("https://backend-sistem-tamu.vercel.app/entri")
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
<button onClick={exportCSV} className="btn btn-success btn-sm">
  📊 Export CSV
</button>
          <button onClick={exportPDF} className="btn btn-success btn-sm">
  📄 Export PDF
</button>
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



