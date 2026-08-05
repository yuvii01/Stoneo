import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StaggerGroup({ 
  children, 
  staggerDelay = 0.15,
  duration = 0.8, 
  y = 50, 
  triggerOffset = 'top 85%',
  className = '',
  style = {},
  itemSelector = '.stagger-item'
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use querySelectorAll to find the items that we want to stagger
    // Or if not provided, just animate the immediate children
    const items = itemSelector 
      ? container.querySelectorAll(itemSelector) 
      : container.children;

    if (!items || items.length === 0) return;

    // Set initial state
    gsap.set(items, { y, opacity: 0 });

    // Animate to visible state on scroll with stagger
    gsap.to(items, {
      y: 0,
      opacity: 1,
      duration,
      stagger: staggerDelay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: triggerOffset,
        toggleActions: 'play none none none'
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === container) st.kill();
      });
    };
  }, [staggerDelay, duration, y, triggerOffset, itemSelector, children]);

  return (
    <div ref={containerRef} className={`stagger-group-anim ${className}`} style={style}>
      {children}
    </div>
  );
}
