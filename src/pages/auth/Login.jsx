import "../../App.css";

const Login = () => {
  return (
    <div className="container_auth">
      <div className="card login-card">
        <div className="login-header">
          <h1 className="login-title">Buku Tamu Online</h1>
          <p className="login-subtitle">Sistem Manajemen Tamu Digital</p>
        </div>

        <div id="loginAlert" className="alert"></div>

        <form id="loginForm">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="form-control"
              id="loginEmail"
              required
              placeholder="admin@buku.com / user@buku.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="loginPassword"
              required
              placeholder="admin123 / user123"
            />
          </div>

          <button type="submit" className="btn btn-primary btn_daftar_akun">
            Login
          </button>

          <a href="/register">
            <button type="button" className="btn btn-secondary btn_daftar_akun">
              Daftar Akun Baru
            </button>
          </a>
        </form>

        <div className="footer_desc">
          <p>
            <strong>Desain by Kelompok 6</strong>
          </p>
          <p>
            <strong>Nurhasan, Fariz Nurrahim, Aprien Febrian</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
