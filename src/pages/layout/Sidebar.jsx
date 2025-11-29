import { useState } from "react";
import { useEffect } from "react";

const Sidebar = ({ open, onClose }) => {
  const logout = () => {
    localStorage.removeItem("sistem-token"); // hapus token
    window.location.href = "/login"; // arahkan ke login
  };

  const [user, setUser] = useState({});
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("sistem-token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      if (token) {
        try {
          const parsed = JSON.parse(token);
          setUser(parsed);
        } catch (err) {
          console.error("Token tidak valid", err);
          window.location.href = "/login";
        }
      }
    };

    checkToken();
  }, []);
  return (
    open && (
      <nav className="container nav-menu">
        <span className="sidebar_close " onClick={onClose}>
          X
        </span>

        <div className="nav_top">
          <div className="user-info nav_top_1" clas>
            <div className="user-avatar nav_top_2" id="navUserAvatar">
              A
            </div>
            <div>
              <div id="navUserName">{user.nama}</div>
              <div id="navUserRole" className="nav_top_3">
                {user.role}
              </div>
            </div>
          </div>
        </div>

        <button
          className="nav-item active"
          onClick={() => (window.location.href = "/")}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </button>

        <button
          className="nav-item"
          onClick={() => (window.location.href = "/new-entri")}
        >
          <span className="nav-icon">📝</span>
          <span className="nav-text">Entri Baru</span>
        </button>
        {user.role === "Admin" && (
          <button
            className="nav-item"
            onClick={() => (window.location.href = "/all-entri")}
          >
            <span className="nav-icon">📖</span>
            <span className="nav-text">Semua Entri</span>
          </button>
        )}

        {user.role === "Admin" && (
          <button
            className="nav-item"
            id="usersMenuItem"
            onClick={() => (window.location.href = "/users")}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">Kelola User</span>
          </button>
        )}

        <button
          className="nav-item"
          onClick={() => (window.location.href = "/settings")}
        >
          <span className="nav-icon">⚙️</span>
          <span className="nav-text">Pengaturan</span>
        </button>

        <button className="nav-item nav-logout" onClick={logout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-text">Logout</span>
        </button>
      </nav>
    )
  );
};

export default Sidebar;
