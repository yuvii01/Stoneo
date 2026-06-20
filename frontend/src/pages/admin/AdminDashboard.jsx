import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie = "admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Jost', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        backgroundColor: '#111',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0'
      }}>
        <div style={{ padding: '0 20px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 400, letterSpacing: '2px', textTransform: 'uppercase' }}>
            Stoneo India
          </h2>
          <span style={{ fontSize: '12px', color: '#888' }}>Admin Panel</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <NavLink 
            to="/admin/blogs" 
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
      <main style={{ flex: 1, backgroundColor: '#f9f9f9', padding: '40px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
