import React from 'react';

export default function NoProductsFound({
  title = "No Products Found",
  description = "We couldn't find any products matching your selected filters. Try clearing a filter or resetting all selections.",
  onReset
}) {
  return (
    <div className="no-products-found" style={{
      gridColumn: '1 / -1',
      textAlign: 'center',
      width: '100%',
      padding: '70px 20px',
      backgroundColor: '#fcfbf8',
      border: '1px solid #efeae1',
      borderRadius: '16px',
      margin: '20px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(0,0,0,0.03)'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #f5ebd8, #f8f1e5)',
        border: '1px solid #e2cfb3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        marginBottom: '16px',
        boxShadow: '0 4px 12px rgba(180, 142, 93, 0.15)'
      }}>
        🔍
      </div>

      <h3 style={{
        fontSize: '24px',
        color: '#141518',
        margin: '0 0 10px 0',
        fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
        fontWeight: '700'
      }}>
        {title}
      </h3>

      <p style={{
        fontSize: '15px',
        color: '#666',
        margin: '0 0 24px 0',
        maxWidth: '440px',
        lineHeight: '1.6'
      }}>
        {description}
      </p>

      {onReset && (
        <button
          onClick={onReset}
          style={{
            padding: '12px 28px',
            background: 'linear-gradient(135deg, #1e1e1e, #111111)',
            color: '#fff',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
            transition: 'all 0.25s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.22)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
          }}
        >
          <span>↻</span>
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
}
