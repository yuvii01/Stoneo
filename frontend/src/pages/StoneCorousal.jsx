import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const StoneCarousel = () => {
    const navigate = useNavigate();
  const originalItems = [
    { id: 's1', name: "Black Granite", url: "https://marmogranite.com/wp-content/uploads/2022/06/1-scaled.jpg" },
    { id: 's2', name: "White Granite", url: "https://marmogranite.com/wp-content/uploads/2022/06/14-scaled.jpg" },
    { id: 's3', name: "Gold & Yellow", url: "https://marmogranite.com/wp-content/uploads/2022/06/2-1-scaled.jpg" },
    { id: 's4', name: "Blue Granite", url: "https://marmogranite.com/wp-content/uploads/2022/06/12-1-scaled.jpg" },
    { id: 's5', name: "Brown Granite", url: "https://marmogranite.com/wp-content/uploads/2022/08/1-300x167.jpg" },
    { id: 's6', name: "Red & Pink", url: "https://marmogranite.com/wp-content/uploads/2022/08/4-min-300x167.jpg" },
    { id: 's7', name: "Green Granite", url: "https://marmogranite.com/wp-content/uploads/2022/06/32-scaled.jpg" },
  ];

  // We clone items for the loop: [Clones of End] [Real Items] [Clones of Start]
  const items = useMemo(() => [
    ...originalItems.slice(-3).map(item => ({ ...item, id: `pre-${item.id}` })),
    ...originalItems,
    ...originalItems.slice(0, 3).map(item => ({ ...item, id: `post-${item.id}` })),
  ], []);

  const [currentIndex, setCurrentIndex] = useState(3); // Start at the first real item
  const [isTransitioning, setIsTransitioning] = useState(true);
  const trackRef = useRef(null);

  const ITEM_WIDTH = 300;
  const GAP = 30;

  const handleItemClick = (index, category) => {
    if (index === currentIndex) {
      // If clicking the active (centered) stone, GO TO PRODUCTS
      navigate(`/products?category=${category}`);
    } else {
      // If clicking a side stone, just move the carousel to it
      setCurrentIndex(index);
    }
  };

  // The Jump Logic: Resets the position without animation
  const handleTransitionEnd = () => {
    if (currentIndex <= 1) {
      setIsTransitioning(false);
      setCurrentIndex(items.length - 5);
    } else if (currentIndex >= items.length - 2) {
      setIsTransitioning(false);
      setCurrentIndex(4);
    }
  };

  // Re-enable transition after the jump
  useEffect(() => {
    if (!isTransitioning) {
      // Smallest possible delay to let the browser process the jump
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  }, [isTransitioning]);

  const moveSlide = (dir) => {
    if (!isTransitioning) return;
    setCurrentIndex(prev => prev + dir);
  };

  const getOffset = () => {
    if (!trackRef.current) return 0;
    const containerWidth = trackRef.current.parentElement.offsetWidth;
    const center = (containerWidth / 2) - (ITEM_WIDTH / 2);
    return center - (currentIndex * (ITEM_WIDTH + GAP));
  };

  const styles = {
    section: { backgroundColor: '#fdfbf8', padding: '100px 0', textAlign: 'center', overflow: 'hidden' },
    track: {
      display: 'flex',
      gap: `${GAP}px`,
      transform: `translateX(${getOffset()}px)`,
      transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.2, 0, 0.2, 1)' : 'none',
      padding: '40px 0',
      willChange: 'transform',
    },
    item: (active) => ({
      minWidth: `${ITEM_WIDTH}px`,
      transition: 'all 0.5s ease',
      transform: active ? 'scale(1.1)' : 'scale(0.85)',
      opacity: active ? 1 : 0.35,
      cursor: 'pointer',
      userSelect: 'none',
    }),
    image: { 
        width: '100%', 
        height: '450px', 
        objectFit: 'cover', 
        borderRadius: '24px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        pointerEvents: 'none' // Prevents ghost dragging
    },
    btn: (side) => ({
      position: 'absolute', top: '50%', [side]: '5%', zIndex: 10,
      width: '54px', height: '54px', borderRadius: '50%', backgroundColor: 'white',
      border: 'none', cursor: 'pointer', boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
    })
  };

  return (
    <section style={styles.section}>
      <p style={{ color: '#a45040', letterSpacing: '4px', fontWeight: 'bold', fontSize: '13px' }}>[ OUR PREMIUM SELECTION ]</p>
      <h2 style={{ fontSize: '40px', fontWeight: '300', marginBottom: '20px' }}>Exquisite Granite Collection</h2>

      <div style={{ position: 'relative' }}>
        <button style={styles.btn('left')} onClick={() => moveSlide(-1)}>❮</button>
        
        <div 
          ref={trackRef} 
          style={styles.track} 
          onTransitionEnd={handleTransitionEnd}
        >
          {items.map((item, index) => {
            const isActive = index === currentIndex;
            return (
              <div 
                key={item.id} 
                style={styles.item(isActive)} 
                onClick={() => isTransitioning && setCurrentIndex(index)}
              >
                <img src={item.url} alt={item.name} style={styles.image} draggable="false" />
                <div style={{ 
                    marginTop: '20px', 
                    fontWeight: '600', 
                    opacity: isActive ? 1 : 0, 
                    transform: isActive ? 'translateY(0)' : 'translateY(10px)',
                    transition: '0.4s'
                }}>
                  {item.name}
                </div>
              </div>
            );
          })}
        </div>

        <button style={styles.btn('right')} onClick={() => moveSlide(1)}>❯</button>
      </div>
    </section>
  );
};

export default StoneCarousel;