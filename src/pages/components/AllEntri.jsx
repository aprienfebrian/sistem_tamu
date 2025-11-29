import React, { useEffect, useState } from "react";

const AllEntri = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI search & filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Modal state
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editEntry, setEditEntry] = useState(null);

  // ==========================
  // MODAL HANDLER
  // ==========================
  const openViewModal = (entry) => setSelectedEntry(entry);
  const closeViewModal = () => setSelectedEntry(null);

  const openEditModal = (entry) => {
    setEditEntry({
      id: entry.id,
      nama: entry.nama || "",
      institusi: entry.institusi || "",
      keperluan: entry.keperluan || "",
      status: entry.status || "pending",
      // Pastikan semua field yang ingin diedit ada di sini, 
      // contohnya: identitas, jumlah_tamu, bertemu, dll., jika diperlukan.
      // Untuk saat ini, saya hanya menyertakan yang ada di modal edit.
    });
  };

  const closeEditModal = () => setEditEntry(null);

  const handleEditChange = (e) => {
    setEditEntry({ ...editEntry, [e.target.name]: e.target.value });
  };
  
  // ==========================
  // API & CRUD HANDLERS (Diperbaiki)
  // ==========================
  
  // 1. UPDATE STATUS (Digunakan untuk 'Approved' dan 'Selesai'/'Pending' dari modal edit)
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`https://backend-sistem-tamu.vercel.app/entri/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error("Gagal menyimpan status ke server");
      }

      // Update state
      setEntries((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
      alert(`Status entri ${id} berhasil diubah menjadi ${newStatus}!`);

    } catch (err) {
      console.error("Gagal update status:", err);
      alert("Gagal memperbarui status! Silakan cek koneksi atau server.");
    }
  };

  // 2. SAVE EDIT CHANGES (PUT API)
  const saveEditChanges = async () => {
    try {
      const response = await fetch(
        `https://backend-sistem-tamu.vercel.app/entri/${editEntry.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editEntry),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal menyimpan perubahan ke server");
      }

      // Update state lokal setelah berhasil
      setEntries((prev) =>
        prev.map((item) => (item.id === editEntry.id ? editEntry : item))
      );
      closeEditModal();
      alert("Data berhasil diperbarui!");
    } catch (err) {
      console.error("Gagal menyimpan perubahan:", err);
      alert("Gagal menyimpan perubahan! Silakan coba lagi.");
    }
  };

  // 3. DELETE ENTRY (DELETE API)
  const deleteEntry = async (id) => {
    if (window.confirm("Yakin ingin menghapus data ini secara permanen?")) {
      try {
        const response = await fetch(
          `https://backend-sistem-tamu.vercel.app/entri/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Gagal menghapus data dari server");
        }

        // Update state lokal setelah berhasil
        setEntries((prev) => prev.filter((item) => item.id !== id));
        alert("Data berhasil dihapus!");
      } catch (err) {
        console.error("Gagal menghapus entri:", err);
        alert("Gagal menghapus data! Silakan cek koneksi atau server.");
      }
    }
  };

  // ==========================
  // FILTER DATE RANGE
  // ==========================
  const filterByDateRange = (date) => {
    const now = new Date();
    const itemDate = new Date(date);

    if (filterDate === "today") {
      return itemDate.toDateString() === now.toDateString();
    }

    if (filterDate === "week") {
      const startWeek = new Date();
      startWeek.setDate(now.getDate() - 7);
      // Atur waktu startWeek ke 00:00:00 agar perhitungannya tepat
      startWeek.setHours(0, 0, 0, 0); 
      return itemDate >= startWeek && itemDate <= now;
    }

    if (filterDate === "month") {
      return (
        itemDate.getMonth() === now.getMonth() &&
        itemDate.getFullYear() === now.getFullYear()
      );
    }

    return true;
  };

  // ==========================
  // MAIN FILTER LOGIC
  // ==========================
  const filteredEntries = entries.filter((e) => {
    // Pastikan e.nama, e.institusi, e.keperluan tidak undefined
    const nama = e.nama || "";
    const institusi = e.institusi || "";
    const keperluan = e.keperluan || "";
    const status = e.status || "pending"; // Default status jika kosong
    const tanggal = e.tanggal;

    const matchSearch =
      nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institusi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      keperluan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === "" || status === filterStatus;
    const matchDate = filterDate === "" || filterByDateRange(tanggal);

    return matchSearch && matchStatus && matchDate;
  });

  // ==========================
  // EXPORT CSV
  // ==========================
  const exportCSV = () => {
    if (filteredEntries.length === 0)
      return alert("Tidak ada data untuk diexport!");

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

    const rows = filteredEntries.map((e) => [
      // Format tanggal agar terhindar dari koma di dalam kolom
      `"${new Date(e.tanggal).toLocaleString()}"`, 
      `"${e.nama}"`,
      `"${e.identitas}"`,
      e.jumlah_tamu,
      `"${e.institusi}"`,
      `"${e.keperluan}"`,
      `"${e.bertemu}"`,
      e.status,
    ]);

    // Menggabungkan baris, menggunakan ";" sebagai pemisah kolom untuk kompatibilitas Excel Indonesia
    const csvContent = [header.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "data_buku_tamu.csv";
    link.click();
    URL.revokeObjectURL(url); // Membersihkan object URL
  };

  // ==========================
  // EXPORT PDF
  // ==========================
  const exportPDF = () => {
    // Menghilangkan kolom Aksi dari print content
    const tableHtml = document.querySelector(".table-container table").cloneNode(true);
    // Menghapus kolom Aksi di header
    tableHtml.querySelector('thead tr th:last-child').remove();
    // Menghapus kolom Aksi di setiap baris
    tableHtml.querySelectorAll('tbody tr').forEach(row => {
        row.querySelector('td:last-child').remove();
    });

    const printContent = tableHtml.outerHTML;

    const newWindow = window.open("", "", "width=900,height=700");

    newWindow.document.write(`
      <html>
        <head>
          <title>Export PDF</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; font-size: 12px; text-align: left;}
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

  // ==========================
  // FETCH DATA (Dengan Penanganan Error)
  // ==========================
  useEffect(() => {
    fetch("https://backend-sistem-tamu.vercel.app/entri")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Gagal mengambil data, status: " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Kesalahan saat memuat data:", err);
        alert("Gagal memuat data dari server. Silakan coba lagi.");
        setLoading(false); 
      });
  }, []);

  // ==========================
  // RENDER COMPONENT
  // ==========================
  return (
    <div className="container">
      <div className="card">
        <h2 className="card-title">Semua Entri Buku Tamu</h2>

        {/* BUTTON EXPORT */}
        <div className="export-btns mb-3">
          <button onClick={exportCSV} className="btn btn-success btn-sm me-2">
            📊 Export CSV
          </button>
          <button onClick={exportPDF} className="btn btn-success btn-sm me-2">
            📄 Export PDF
          </button>
        </div>

        {/* SEARCH & FILTER */}
        <div className="search-filter d-flex gap-2 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Cari nama, institusi, atau keperluan..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="form-control"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="selesai">Selesai</option>
          </select>

          <select
            className="form-control"
            onChange={(e) => setFilterDate(e.target.value)}
          >
            <option value="">Semua Tanggal</option>
            <option value="today">Hari Ini</option>
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini</option>
          </select>
        </div>

        {/* TABLE */}
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
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((e) => (
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

                      {/* Tombol APPROVED - Memanggil updateStatus yang terhubung ke API */}
                      {e.status === "pending" && (
                        <button
                          className="btn btn-sm btn-success me-1"
                          onClick={() => updateStatus(e.id, "approved")}
                        >
                          Approved
                        </button>
                      )}
                      
                      {/* Tombol Selesai - Opsional, bisa juga menggunakan updateStatus */}
                      {e.status === "approved" && (
                        <button
                          className="btn btn-sm btn-warning me-1"
                          onClick={() => updateStatus(e.id, "selesai")}
                        >
                          Selesai
                        </button>
                      )}

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

      {/* MODAL LIHAT */}
      {selectedEntry && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Detail Entri</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeViewModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Tanggal:</strong> {new Date(selectedEntry.tanggal).toLocaleString()}</p>
                <p><strong>Nama:</strong> {selectedEntry.nama}</p>
                <p><strong>Identitas:</strong> {selectedEntry.identitas}</p>
                <p><strong>Jumlah Tamu:</strong> {selectedEntry.jumlah_tamu}</p>
                <p><strong>Institusi:</strong> {selectedEntry.institusi}</p>
                <p><strong>Keperluan:</strong> {selectedEntry.keperluan}</p>
                <p><strong>Bertemu:</strong> {selectedEntry.bertemu}</p>
                <p><strong>Status:</strong> {selectedEntry.status}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeViewModal}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {editEntry && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Edit Entri</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeEditModal}></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Nama</label>
                <input
                  className="form-control mb-2"
                  name="nama"
                  value={editEntry.nama}
                  onChange={handleEditChange}
                />

                <label className="form-label">Institusi</label>
                <input
                  className="form-control mb-2"
                  name="institusi"
                  value={editEntry.institusi}
                  onChange={handleEditChange}
                />

                <label className="form-label">Keperluan</label>
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
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary me-2" onClick={saveEditChanges}>
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

export default AllEntri;