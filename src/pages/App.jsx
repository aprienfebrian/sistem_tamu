import { useEffect, useState } from "react";
import "../App.css";

const App = () => {
  const [entri, setEntri] = useState(0);
  const [user, setUser] = useState(0);
  const [pending, setPending] = useState(0);
  const [todayCount, setTodayCount] = useState([]);

  const [now, setNow] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil 2 API secara paralel (lebih cepat)
        const [entriRes, userRes] = await Promise.all([
          fetch("https://backend-sistem-tamu.vercel.app/entri"),
          fetch("https://backend-sistem-tamu.vercel.app/users"),
        ]);

        const entriData = await entriRes.json();
        const userData = await userRes.json();

        setEntri(entriData);
        setUser(userData);

        const pendingCount = entriData.filter(
          (e) => e.status === "Pending"
        ).length;
        setPending(pendingCount);

        const today = new Date();
        const todayStr = today.toDateString();

        const todayEntries = entriData.filter(
          (e) => new Date(e.tanggal).toDateString() === todayStr
        );

        setTodayCount(todayEntries);

        setNow(todayEntries.length);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);
  console.log(entri);

  useEffect(() => {
    const token = localStorage.getItem("sistem-token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <>
      <div>
        <div className="container app_style">
          <div id="mainAlert" className="alert"></div>

          <div id="dashboard" className="section active">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value" id="totalEntries">
                  {entri.length}
                </div>
                <div className="stat-label">Total Tamu Masuk</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" id="totalUsers">
                  {user.length}
                </div>
                <div className="stat-label">Total User</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" id="pendingEntries">
                  {pending}
                </div>
                <div className="stat-label">Menunggu Approval</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" id="todayEntries">
                  {now}
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
                      <th
                        colSpan="5"
                        className="memuat_data"
                        style={{ textAlign: "start" }}
                      >
                        Tanggal
                      </th>
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
                        Institusi
                      </th>
                      <th
                        colSpan="5"
                        className="memuat_data"
                        style={{ textAlign: "start" }}
                      >
                        Keperluan
                      </th>
                      <th
                        colSpan="5"
                        className="memuat_data"
                        style={{ textAlign: "start" }}
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody id="recentEntriesTable">
                    {todayCount.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="memuat_data"
                          style={{ textAlign: "start" }}
                        >
                          Tidak ada tamu hari ini
                        </td>
                      </tr>
                    ) : (
                      todayCount.map((e) => (
                        <tr key={e.id}>
                          <td
                            colSpan="5"
                            className="memuat_data"
                            style={{ textAlign: "start" }}
                          >
                            {new Date(e.tanggal).toLocaleString()}
                          </td>
                          <td
                            colSpan="5"
                            className="memuat_data"
                            style={{ textAlign: "start" }}
                          >
                            {e.nama}
                          </td>
                          <td
                            colSpan="5"
                            className="memuat_data"
                            style={{ textAlign: "start" }}
                          >
                            {e.institusi}
                          </td>
                          <td
                            colSpan="5"
                            className="memuat_data"
                            style={{ textAlign: "start" }}
                          >
                            {e.keperluan}
                          </td>
                          <td
                            colSpan="5"
                            className="memuat_data"
                            style={{ textAlign: "start" }}
                          >
                            {e.status}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
