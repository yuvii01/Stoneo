import React, { useState } from 'react';

export default function StonePriceSlider({ minPrice = 50, maxPrice = 300, currentMaxPrice, onChange }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const val = currentMaxPrice !== undefined ? currentMaxPrice : maxPrice;
  const percentage = maxPrice > minPrice
    ? Math.min(100, Math.max(0, ((val - minPrice) / (maxPrice - minPrice)) * 100))
    : 100;

  return (
    <div style={{ marginBottom: '24px', padding: '4px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#111' }}>Price Filter</h4>
        <span style={{
          fontSize: '13px',
          fontWeight: '700',
          color: '#000000',
          backgroundColor: '#ffffff',
          padding: '4px 10px',
          borderRadius: '4px',
          border: '1px solid #000000',
          boxShadow: 'none'
        }}>
          ₹{val} / sq. ft.
        </span>
      </div>

      {/* Slider Track with Custom Handle */}
      <div style={{ position: 'relative', height: '36px', display: 'flex', alignItems: 'center', margin: '8px 4px 4px 4px' }}>
        {/* Background Track Line */}
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '6px',
          backgroundColor: '#e5e5e5',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          {/* Active Progress Line */}
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            background: '#000000',
            borderRadius: '3px',
            transition: 'width 0.05s linear'
          }} />
        </div>

        {/* Custom Handle (Visual Only) */}
        <div
          style={{
            position: 'absolute',
            left: `calc(${percentage}% - 14px)`,
            width: '28px',
            height: '22px',
            backgroundColor: '#000000',
            border: '2px solid #000000',
            borderRadius: '45% 55% 60% 40% / 55% 45% 50% 50%',
            boxShadow: isDragging || isHovered
              ? '0 4px 12px rgba(0,0,0,0.25)'
              : '0 2px 6px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            transform: isDragging ? 'scale(1.2)' : (isHovered ? 'scale(1.1)' : 'scale(1)'),
            zIndex: 2
          }}
        >
          {/* Subtle Stone Texture Mark inside */}
          <div style={{
            width: '12px',
            height: '2px',
            backgroundColor: 'rgba(212,175,55,0.7)',
            borderRadius: '2px',
            transform: 'rotate(-12deg)'
          }} />
        </div>

        {/* Interactive Native Range Input (Transparent Overlay) */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={val}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
            zIndex: 3,
            margin: 0
          }}
        />
      </div>

      {/* Min and Max Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#777', fontWeight: '600', padding: '0 2px' }}>
        <span>₹{minPrice}</span>
        <span>₹{maxPrice}</span>
      </div>
    </div>
  );
}
