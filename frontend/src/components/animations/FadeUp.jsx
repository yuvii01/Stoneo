import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FadeUp({ 
  children, 
  delay = 0, 
  duration = 0.8, 
  y = 50, 
  triggerOffset = 'top 85%',
  className = '',
  style = {}
}) {
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    
    // Set initial state
    gsap.set(el, { y, opacity: 0 });

    // Animate to visible state on scroll
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: triggerOffset,
        toggleActions: 'play none none none'
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [delay, duration, y, triggerOffset]);

  return (
    <div ref={elementRef} className={`fade-up-anim ${className}`} style={style}>
      {children}
    </div>
  );
}
