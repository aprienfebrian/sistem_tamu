import React, { useEffect, useState, useMemo } from 'react';

// CATATAN PENTING: Import jspdf dan jspdf-autotable dihapus 
// karena library dimuat via CDN (<script>) dan harus diakses dari objek global (window).

// Dummy API Key (biarkan kosong untuk Canvas environment)
const apiKey = "";
const API_URL = "https://backend-sistem-tamu.vercel.app/entri";

// Fungsi untuk membuat Promise dengan backoff
const fetchWithRetry = async (url, options = {}, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`Fetch attempt ${i + 1} failed: ${error.message}. Retrying...`);
      if (i === retries - 1) throw error;
      // Exponential backoff: 1s, 2s, 4s delay
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};


const AllEntri = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState(''); // 'today', 'week', 'month'

  // --- Data Fetching Effect (Menggunakan fetchWithRetry) ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchWithRetry(API_URL);
        // Data diterima. Kita asumsikan data adalah array objek.
        setEntries(data || []); 
      } catch (err) {
        console.error("Error fetching entries:", err);
        // Menampilkan pesan error kepada user akan lebih baik di aplikasi nyata
        setEntries([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Computed Filtered Entries ---
  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      // 1. Filter Pencarian (Search Term)
      const matchesSearch = searchTerm
        ? [e.nama, e.institusi, e.keperluan].some(field =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;

      // 2. Filter Status
      const matchesStatus = filterStatus
        ? e.status.toLowerCase() === filterStatus.toLowerCase()
        : true;

      // 3. Filter Tanggal
      const matchesDate = (() => {
        if (!filterDate) return true;
        const entryDate = new Date(e.tanggal);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (filterDate === 'today') {
          return entryDate.toDateString() === now.toDateString();
        }

        if (filterDate === 'week') {
          const firstDayOfWeek = new Date(now);
          firstDayOfWeek.setDate(now.getDate() - now.getDay());
          return entryDate >= firstDayOfWeek;
        }

        if (filterDate === 'month') {
          return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
        }

        return true;
      })();
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [entries, searchTerm, filterStatus, filterDate]);


  // --- Helper: Format Status untuk Tampilan ---
  const formatStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <span className="text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded-full text-xs">Approved</span>;
      case 'pending':
        return <span className="text-yellow-600 font-semibold bg-yellow-100 px-2 py-0.5 rounded-full text-xs">Pending</span>;
      case 'completed':
        return <span className="text-blue-600 font-semibold bg-blue-100 px-2 py-0.5 rounded-full text-xs">Selesai</span>;
      default:
        return <span className="text-gray-600 font-semibold bg-gray-100 px-2 py-0.5 rounded-full text-xs">{status}</span>;
    }
  };

  // --- Fungsi Export CSV (Dari kode asli, dipertahankan) ---
  const exportCSV = () => {
    // Menggunakan window.alert() sebagai pengganti alert() bawaan, tetapi disarankan menggunakan modal custom di aplikasi sungguhan.
    if (filteredEntries.length === 0) return window.alert('Tidak ada data untuk diexport!');

    const header = [
      'Tanggal',
      'Nama',
      'Identitas',
      'Jumlah Tamu',
      'Institusi',
      'Keperluan',
      'Bertemu',
      'Status'
    ];

    // Convert array entries → CSV rows
    const rows = filteredEntries.map(e => [
      new Date(e.tanggal).toLocaleString('id-ID'), // Format tanggal agar lebih lokal
      `"${e.nama.replace(/"/g, '""')}"`, // Handle koma dan kutipan di dalam teks
      `"${e.identitas.replace(/"/g, '""')}"`,
      e.jumlah_tamu,
      `"${e.institusi.replace(/"/g, '""')}"`,
      `"${e.keperluan.replace(/"/g, '""')}"`,
      `"${e.bertemu.replace(/"/g, '""')}"`,
      `"${e.status.replace(/"/g, '""')}"`,
    ]);

    // Gabung header + rows
    const csvContent = [header.join(','), ...rows.map(row => row.join(','))].join('\n');
    
    // Gunakan BOM (Byte Order Mark) untuk memastikan Excel/program lain membaca UTF-8 dengan benar
    const BOM = "\uFEFF"; 
    const csvWithBOM = BOM + csvContent;

    // Buat blob file
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Buat link download
    const link = document.createElement('a');
    link.href = url;
    link.download = `data_buku_tamu_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url); // Bersihkan URL objek
  };
  
  // --- Fungsi Export PDF (BARU, diperbaiki) ---
  const exportPDF = () => {
    // Menggunakan window.alert() sebagai pengganti alert() bawaan
    if (filteredEntries.length === 0) return window.alert('Tidak ada data untuk diexport!');

    // Akses jsPDF dari global scope (window)
    if (!window.jsPDF || !window.jsPDF.jsPDF) {
        return window.alert('Library PDF belum dimuat. Coba muat ulang halaman.');
    }
    const doc = new window.jsPDF.jsPDF();
    
    // Header Kolom
    const head = [
      [
        'No',
        'Tanggal',
        'Nama',
        'Identitas',
        'Jml. Tamu',
        'Institusi',
        'Keperluan',
        'Bertemu',
        'Status',
      ],
    ];

    // Isi Tabel
    const body = filteredEntries.map((e, index) => [
      index + 1,
      new Date(e.tanggal).toLocaleString('id-ID'),
      e.nama,
      e.identitas,
      e.jumlah_tamu,
      e.institusi,
      e.keperluan,
      e.bertemu,
      e.status,
    ]);

    // Tambahkan Tabel ke PDF
    doc.autoTable({
      head: head,
      body: body,
      startY: 20, // Mulai setelah margin
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138] }, // Warna biru tua Tailwind (blue-800)
      styles: { fontSize: 8 },
      didDrawPage: function (data) {
        // Header Halaman
        doc.setFontSize(14);
        doc.text('Laporan Entri Buku Tamu', 14, 15);
        
        // Footer Halaman
        doc.setFontSize(8);
        const pageCount = doc.internal.getNumberOfPages();
        doc.text(`Halaman ${data.pageNumber} dari ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      },
    });

    doc.save(`laporan_buku_tamu_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // --- Fungsi Print (BARU) ---
  const handlePrint = () => {
    // Sembunyikan elemen non-tabel saat mencetak
    // Catatan: Mengakses dan memanipulasi innerHTML dokumen dapat berisiko. Ini adalah solusi 
    // cepat untuk single-file app di lingkungan Canvas.
    const originalBody = document.body.innerHTML;
    const printContent = document.getElementById('print-table-content')?.outerHTML;

    if (!printContent) return window.alert('Gagal menemukan konten tabel untuk dicetak.');

    document.body.innerHTML = `
      <style>
        @page { size: A4 landscape; margin: 1cm; }
        h1 { margin-bottom: 20px; font-size: 18pt; }
        .table { width: 100%; border-collapse: collapse; font-size: 10pt; }
        .table th, .table td { border: 1px solid #000; padding: 8px; text-align: left; }
        .table th { background-color: #f2f2f2; }
      </style>
      <div style="padding: 20px;">
        <h1>Laporan Entri Buku Tamu</h1>
        ${printContent}
      </div>
    `;

    window.print();
    
    // Kembalikan konten body setelah mencetak (memerlukan timeout agar cetak selesai)
    setTimeout(() => {
        document.body.innerHTML = originalBody;
        // Reload komponen untuk memastikan state React kembali normal (di lingkungan iframe/canvas ini lebih aman)
        // Solusi yang lebih bersih adalah menggunakan state React untuk menyembunyikan/menampilkan tombol
        window.location.reload(); 
    }, 100); 
  };
  
  // --- Tampilan Render ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-[Inter]">
      {/* Header Tailwind CSS & Global Styling (Simulasi Tailwind) */}
      <style>{`
        .card { 
          background-color: white; 
          border-radius: 12px; 
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); 
          padding: 24px; 
          margin-bottom: 24px;
        }
        .card-title { 
          font-size: 1.5rem; 
          font-weight: 700; 
          color: #1f2937; /* gray-800 */
          margin-bottom: 1rem;
          border-bottom: 2px solid #eff6ff; /* blue-50 */
          padding-bottom: 0.5rem;
        }
        .btn {
          padding: 8px 16px; 
          border-radius: 8px; 
          font-weight: 600; 
          transition: background-color 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-success {
          background-color: #10b981; /* emerald-500 */
          color: white;
        }
        .btn-success:hover {
          background-color: #059669; /* emerald-600 */
        }
        .btn-primary {
          background-color: #3b82f6; /* blue-500 */
          color: white;
        }
        .btn-primary:hover {
          background-color: #2563eb; /* blue-600 */
        }
        .btn-sm {
          padding: 6px 12px; 
          font-size: 0.875rem;
        }
        .form-control {
          border: 1px solid #d1d5db; /* gray-300 */
          border-radius: 6px;
          padding: 8px 12px;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .form-control:focus {
          border-color: #3b82f6; /* blue-500 */
          box-shadow: 0 0 0 1px #3b82f6;
        }
        .table-container { 
          overflow-x: auto; 
          margin-top: 1rem;
        }
        .table { 
          width: 100%; 
          border-collapse: separate; 
          border-spacing: 0; 
          font-size: 0.875rem;
        }
        .table th { 
          background-color: #f3f4f6; /* gray-100 */
          padding: 12px; 
          text-align: left; 
          font-weight: 600; 
          color: #4b5563; /* gray-600 */
        }
        .table td { 
          padding: 12px; 
          border-bottom: 1px solid #e5e7eb; /* gray-200 */
        }
        .table tr:last-child td {
          border-bottom: none;
        }
        .table tbody tr:hover {
          background-color: #f9fafb; /* gray-50 */
        }
        
        .export-btns {
          display: flex; 
          gap: 12px; 
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        
        .search-filter {
            display: grid;
            gap: 12px;
            grid-template-columns: 1fr;
            margin-bottom: 20px;
        }
        @media (min-width: 640px) {
             .search-filter {
                grid-template-columns: 1fr auto auto;
             }
        }

      `}</style>
      
      <div className="max-w-7xl mx-auto">
        <div className="card">
          <h2 className="card-title">Semua Entri Buku Tamu</h2>

          {/* Export Buttons */}
          <div className="export-btns">
            <button onClick={exportCSV} className="btn btn-success btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 9a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" /></svg>
              Export CSV
            </button>
            
            <button onClick={exportPDF} className="btn btn-primary btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2-2a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V3a1 1 0 00-1-1H6zM10 8a1 1 0 00-1 1v3a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              Export PDF
            </button>
            
            <button onClick={handlePrint} className="btn btn-primary btn-sm bg-gray-600 hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5 2a2 2 0 00-2 2v3a1 1 0 002 0V4h10v12H5v-3a1 1 0 00-2 0v3a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H5zm0 14h10v-3H5v3zm-2-6h14a1 1 0 000-2H3a1 1 0 000 2z" /></svg>
              Print
            </button>
          </div>

          {/* Search and Filter */}
          <div className="search-filter">
            <div className="search-box">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Cari nama, institusi, atau keperluan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="form-control filter-select" 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Selesai</option>
            </select>
            
            <select 
              className="form-control filter-select" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="">Semua Tanggal</option>
              <option value="today">Hari Ini</option>
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
            </select>
          </div>

          {/* Table Container */}
          <div className="table-container">
            <table className="table" id="print-table-content"> 
              <thead>
                <tr>
                  <th className="w-1/12">Tanggal</th>
                  <th className="w-2/12">Nama</th>
                  <th className="w-1/12 hidden sm:table-cell">Identitas</th>
                  <th className="w-1/12">Jml Tamu</th>
                  <th className="w-2/12 hidden md:table-cell">Institusi</th>
                  <th className="w-2/12">Keperluan</th>
                  <th className="w-1/12 hidden sm:table-cell">Bertemu</th>
                  <th className="w-1/12">Status</th>
                  <th className="w-1/12">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {/* Memastikan tidak ada text node yang tidak valid di antara tag <tr> */}
                {loading ? (
                  <tr><td colSpan="9" className="text-center text-gray-500">Memuat data...</td></tr>
                ) : filteredEntries.length === 0 ? (
                  <tr><td colSpan="9" className="text-center text-gray-500">Tidak ada data yang cocok dengan kriteria filter.</td></tr>
                ) : (
                  filteredEntries.map((e) => (
                    <tr key={e.id || e.nama + e.tanggal}> {/* Fallback key jika id tidak ada */}
                      <td className="whitespace-nowrap">{new Date(e.tanggal).toLocaleString('id-ID')}</td>
                      <td>{e.nama}</td>
                      <td className="hidden sm:table-cell">{e.identitas}</td>
                      <td className="text-center">{e.jumlah_tamu}</td>
                      <td className="hidden md:table-cell">{e.institusi}</td>
                      <td>{e.keperluan}</td>
                      <td className="hidden sm:table-cell">{e.bertemu}</td>
                      <td>{formatStatus(e.status)}</td>
                      <td className="whitespace-nowrap">
                        <button className="btn btn-sm btn-primary bg-indigo-500 hover:bg-indigo-600">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Tampilkan total data yang difilter */}
          <div className="mt-4 text-sm text-gray-600">
            Menampilkan {filteredEntries.length} dari {entries.length} total entri.
          </div>
        </div>
      </div>
      
      {/* Script untuk jspdf dan jspdf-autotable (diperlukan di lingkungan single-file) */}
      {/* CATATAN: Pastikan jspdf dimuat sebelum jspdf-autotable */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      <script src="https://unpkg.com/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.js"></script>
    </div>
  );
};

export default AllEntri;