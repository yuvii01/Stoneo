import React from 'react';

export default function ProductLoader({ text = "Loading products..." }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      width: '100%',
      minHeight: '280px',
      textAlign: 'center',
      gridColumn: '1 / -1'
    }}>
      <div className="product-loader-spinner" style={{
        width: '46px',
        height: '46px',
        border: '3px solid rgba(164, 80, 64, 0.15)',
        borderTopColor: '#a45040',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        marginBottom: '20px'
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '22px',
        color: '#222',
        fontWeight: 500,
        margin: '0 0 6px 0',
        letterSpacing: '0.5px'
      }}>
        {text}
      </h3>
      <p style={{
        fontSize: '13.5px',
        color: '#888',
        margin: 0,
        letterSpacing: '0.3px'
      }}>
        Curating natural stone collection...
      </p>
    </div>
  );
}
