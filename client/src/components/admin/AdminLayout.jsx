import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@store/useAuth';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <div className="admin-layout__brand">
          <div className="admin-layout__brand-title">JT's Admin</div>
          <div className="admin-layout__brand-sub">Rustic Cuisine Dashboard</div>
        </div>

        <nav className="admin-layout__nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `admin-layout__link ${isActive ? 'admin-layout__link--active' : ''}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `admin-layout__link ${isActive ? 'admin-layout__link--active' : ''}`
            }
          >
            Orders
          </NavLink>
          <NavLink
            to="/admin/menu"
            className={({ isActive }) =>
              `admin-layout__link ${isActive ? 'admin-layout__link--active' : ''}`
            }
          >
            Menu
          </NavLink>
          <NavLink
            to="/admin/packages"
            className={({ isActive }) =>
              `admin-layout__link ${isActive ? 'admin-layout__link--active' : ''}`
            }
          >
            Packages
          </NavLink>
          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              `admin-layout__link ${isActive ? 'admin-layout__link--active' : ''}`
            }
          >
            Customers
          </NavLink>
          <NavLink  className={({ isActive }) =>
              `admin-layout__link ${isActive ? 'admin-layout__link--active' : ''}`
            } to="/admin/site-content">Site Content</NavLink>
          <NavLink className={({ isActive }) =>
              `admin-layout__link ${isActive ? 'admin-layout__link--active' : ''}`
            } to="/admin/messages">Messages</NavLink>
        </nav>


        <div className="admin-layout__user">
          <div className="admin-layout__user-name">{user?.name || 'Admin'}</div>
          <button onClick={handleLogout} className="admin-layout__logout">
            Log out
          </button>
        </div>
      </aside>

      <main className="admin-layout__main">
        <Outlet />
      </main>
    </div>
  );
}
