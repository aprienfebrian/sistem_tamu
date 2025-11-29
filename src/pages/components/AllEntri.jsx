import React, { useEffect, useState } from "react";

const AllEntri = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editEntry, setEditEntry] = useState(null);

  const openViewModal = (entry) => setSelectedEntry(entry);
  const closeViewModal = () => setSelectedEntry(null);

  const openEditModal = (entry) => {
    setEditEntry({
      id: entry.id,
      nama: entry.nama,
      institusi: entry.institusi,
      keperluan: entry.keperluan,
      status: entry.status || "pending",
    });
  };

  const closeEditModal = () => setEditEntry(null);

  const handleEditChange = (e) => {
    setEditEntry({ ...editEntry, [e.target.name]: e.target.value });
  };

  const saveEditChanges = () => {
    setEntries((prev) =>
      prev.map((item) => (item.id === editEntry.id ? editEntry : item))
    );
    closeEditModal();
  };

  const deleteEntry = (id) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      setEntries(entries.filter((item) => item.id !== id));
    }
  };

  // EXPORT CSV
  const exportCSV = () => {
    if (entries.length === 0) return alert("Tidak ada data untuk diexport!");

    const header = [
      "Tanggal",
      "Nama",
      "Identitas",
      "Jumlah Tamu",
      "Institusi",
      "Keperluan",
      "Bertemu",
      "Status",
    ];

    const rows = entries.map((e) => [
      new Date(e.tanggal).toLocaleString(),
      e.nama,
      e.identitas,
      e.jumlah_tamu,
      e.institusi,
      e.keperluan,
      e.bertemu,
      e.status,
    ]);

    const csvContent = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "data_buku_tamu.csv";
    link.click();
  };

  // EXPORT PDF
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
            th { background: #f2f2f2; }
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

  // FETCH DATA
  useEffect(() => {
    fetch("https://backend-sistem-tamu.vercel.app/entri")
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA FROM API:", data);
        setEntries(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2 className="card-title">Semua Entri Buku Tamu</h2>

        <div className="export-btns mb-3">
          <button onClick={exportCSV} className="btn btn-success btn-sm me-2">
            📊 Export CSV
          </button>
          <button onClick={exportPDF} className="btn btn-success btn-sm">
            📄 Export PDF
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama</th>
                <th>Identitas</th>
                <th>Jumlah</th>
                <th>Institusi</th>
                <th>Keperluan</th>
                <th>Bertemu</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9">Memuat data...</td>
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
                      <button
                        className="btn btn-sm btn-info me-1"
                        onClick={() => openViewModal(e)}
                      >
                        Lihat
                      </button>

                      <button
                        className="btn btn-sm btn-primary me-1"
                        onClick={() => openEditModal(e)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteEntry(e.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* == MODAL LIHAT == */}
      {selectedEntry && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h4>Detail Entri</h4>

              <p><strong>Nama:</strong> {selectedEntry.nama}</p>
              <p><strong>Institusi:</strong> {selectedEntry.institusi}</p>
              <p><strong>Keperluan:</strong> {selectedEntry.keperluan}</p>

              <button className="btn btn-secondary" onClick={closeViewModal}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* == MODAL EDIT == */}
      {editEntry && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h4>Edit Entri</h4>

              <input
                className="form-control mb-2"
                name="nama"
                value={editEntry.nama}
                onChange={handleEditChange}
              />

              <input
                className="form-control mb-2"
                name="institusi"
                value={editEntry.institusi}
                onChange={handleEditChange}
              />

              <textarea
                className="form-control mb-2"
                name="keperluan"
                value={editEntry.keperluan}
                onChange={handleEditChange}
              />

              <label className="form-label">Status</label>
              <select
                className="form-control mb-3"
                name="status"
                value={editEntry.status}
                onChange={handleEditChange}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="selesai">Selesai</option>
              </select>

              <button className="btn btn-primary me-2" onClick={saveEditChanges}>
                Simpan
              </button>

              <button className="btn btn-secondary" onClick={closeEditModal}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEntri;
