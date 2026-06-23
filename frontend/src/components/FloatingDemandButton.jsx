import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemand } from '../context/DemandContext';
import gsap from 'gsap';

export default function FloatingDemandButton() {
  const { demands } = useDemand();
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  useEffect(() => {
    if (demands.length > 0 && buttonRef.current) {
      // Subtle float/bounce animation to get attention
      gsap.to(buttonRef.current, {
        y: -5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, [demands.length]);

  if (demands.length === 0) return null;

  return (
    <button
      ref={buttonRef}
      className="floating-demand-btn"
      onClick={() => navigate('/get-quote?from=cart')}
    >
      Send your Demands
      <span className="floating-demand-badge">
        {demands.length}
      </span>
    </button>
  );
}
