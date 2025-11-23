import "../App.css";
import Header from "./layout/Header";

const App = () => {
  return (
    <>
      <div>
        <div className="container app_style">
          <div id="mainAlert" className="alert"></div>

          <div id="dashboard" className="section active">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value" id="totalEntries">
                  0
                </div>
                <div className="stat-label">Total Tamu Masuk</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" id="totalUsers">
                  0
                </div>
                <div className="stat-label">Total User</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" id="pendingEntries">
                  0
                </div>
                <div className="stat-label">Menunggu Approval</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" id="todayEntries">
                  0
                </div>
                <div className="stat-label">Tamu Hari Ini</div>
              </div>
            </div>

            <div className="card">
              <h2 className="card-title">Entri Terbaru</h2>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Nama</th>
                      <th>Institusi</th>
                      <th>Keperluan</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody id="recentEntriesTable">
                    <tr>
                      <td colspan="5" className="memuat_data">
                        Memuat data...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div id="guestbook" className="section">
            <div className="card">
              <h2 className="card-title">Tambah Entri Baru</h2>
              <form id="guestbookForm">
                <div className="form-group">
                  <label className="form-label">Nama Tamu</label>
                  <input
                    type="text"
                    className="form-control"
                    id="guestName"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Identitas</label>
                  <input
                    type="text"
                    className="form-control"
                    id="guestEmail"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nomor Telepon</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="guestPhone"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Jumlah Tamu</label>
                  <input
                    type="number"
                    className="form-control"
                    id="guestCount"
                    required
                    value="1"
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Institusi/Perusahaan</label>
                  <input
                    type="text"
                    className="form-control"
                    id="guestInstitution"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Keperluan</label>
                  <textarea
                    className="form-control"
                    id="guestPurpose"
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Bertemu Dengan</label>
                  <input
                    type="text"
                    className="form-control"
                    id="guestMeetWith"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Simpan Entri
                </button>
                <button type="reset" className="btn btn-secondary">
                  Reset
                </button>
              </form>
            </div>
          </div>

          <div id="allEntries" className="section">
            <div className="card">
              <h2 className="card-title">Semua Entri Buku Tamu</h2>

              <div className="export-btns">
                <button
                  className="btn btn-success btn-sm"
                  onclick="exportToCSV()"
                >
                  📊 Export CSV
                </button>
                <button
                  className="btn btn-success btn-sm"
                  onclick="exportToPDF()"
                >
                  📄 Export PDF
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onclick="printEntries()"
                >
                  🖨️ Print
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
                <select
                  className="form-control filter-select"
                  id="filterStatus"
                >
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
                    <tr>
                      <td colspan="9" className="memuat_data">
                        Memuat data...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div id="myEntries" className="section">
            <div className="card">
              <h2 className="card-title">Entri Saya</h2>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Nama Tamu</th>
                      <th>Institusi</th>
                      <th>Keperluan</th>
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

          <div id="users" className="section">
            <div className="card">
              <h2 className="card-title">Kelola User</h2>

              <div className="search-filter">
                <div className="search-box">
                  <input
                    type="text"
                    className="form-control"
                    id="searchUsers"
                    placeholder="🔍 Cari nama atau identitas..."
                  />
                </div>
                <select className="form-control filter-select" id="filterRole">
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
                  <tbody id="usersTable"></tbody>
                </table>
              </div>
            </div>
          </div>

          <div id="settings" className="section">
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
                  <textarea
                    className="form-control"
                    id="profileAddress"
                  ></textarea>
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
        </div>
      </div>
    </>
  );
};

export default App;
