import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './Admin.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    document.cookie = "admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/admin/login');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="admin-dashboard-wrapper">
      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <h2 style={{ fontSize: '20px', margin: 0, fontWeight: 400, letterSpacing: '2px', textTransform: 'uppercase' }}>Stoneo</h2>
        <button className="admin-hamburger" onClick={toggleSidebar}>☰</button>
      </div>

      <div className={`admin-overlay ${sidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>

      <div className="admin-dashboard-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '0 20px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 400, letterSpacing: '2px', textTransform: 'uppercase' }}>
            Stoneo India
          </h2>
          <span style={{ fontSize: '12px', color: '#888' }}>Admin Panel</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <NavLink 
            to="/admin/blogs" 
            onClick={() => setSidebarOpen(false)}
            style={({ isActive }) => ({
              padding: '12px 20px',
              textDecoration: 'none',
              color: isActive ? '#fff' : '#aaa',
              backgroundColor: isActive ? '#333' : 'transparent',
              borderLeft: isActive ? '4px solid white' : '4px solid transparent',
              transition: 'all 0.2s'
            })}
          >
            Blogs
          </NavLink>
          <NavLink 
            to="/admin/products" 
            onClick={() => setSidebarOpen(false)}
            style={({ isActive }) => ({
              padding: '12px 20px',
              textDecoration: 'none',
              color: isActive ? '#fff' : '#aaa',
              backgroundColor: isActive ? '#333' : 'transparent',
              borderLeft: isActive ? '4px solid white' : '4px solid transparent',
              transition: 'all 0.2s'
            })}
          >
            Products
          </NavLink>
        </nav>

        <div style={{ padding: '20px' }}>
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'transparent',
              color: '#ff4444',
              border: '1px solid #ff4444',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ff4444';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ff4444';
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        <Outlet />
      </main>
      </div>
    </div>
  );
}
