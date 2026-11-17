import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          SmartStay
        </NavLink>
        <nav aria-label="Main Navigation">
          <ul className="nav-links">
            <li>
              <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Trang chủ
              </NavLink>
            </li>
            <li>
              <NavLink to="/about-us" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Giới thiệu
              </NavLink>
            </li>
            <li>
              <NavLink to="/manage-rooms" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Quản lý phòng
              </NavLink>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <span className="user-pill">{user.fullName} ({user.email})</span>
                </li>
                <li>
                  <button type="button" className="btn btn-secondary" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Đăng nhập
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Đăng ký
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
