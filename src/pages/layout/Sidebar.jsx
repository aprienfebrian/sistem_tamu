const Sidebar = ({ open, onClose }) => {
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
              <div id="navUserName">User Name</div>
              <div id="navUserRole" className="nav_top_3">
                Role
              </div>
            </div>
          </div>
        </div>

        <div className="nav-item theme-switch-container">
          <span className="nav-text" id="themeLabel">
            Mode Gelap
          </span>
          <label className="switch">
            <input type="checkbox" id="themeToggle" />
            <span className="slider round"></span>
          </label>
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
        <button
          className="nav-item"
          onClick={() => (window.location.href = "/my-entri")}
        >
          <span className="nav-icon">👀</span>
          <span className="nav-text">Entri Saya</span>
        </button>
        <button
          className="nav-item"
          onClick={() => (window.location.href = "/all-entri")}
        >
          <span className="nav-icon">📖</span>
          <span className="nav-text">Semua Entri</span>
        </button>
        <button
          className="nav-item"
          id="usersMenuItem"
          onClick={() => (window.location.href = "/users")}
        >
          <span className="nav-icon">👥</span>
          <span className="nav-text">Kelola User</span>
        </button>
        <button
          className="nav-item"
          onClick={() => (window.location.href = "/settings")}
        >
          <span className="nav-icon">⚙️</span>
          <span className="nav-text">Pengaturan</span>
        </button>

        <button className="nav-item nav-logout" onclick="logout()">
          <span className="nav-icon">🚪</span>
          <span className="nav-text">Logout</span>
        </button>
      </nav>
    )
  );
};

export default Sidebar;
