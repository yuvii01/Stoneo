import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const originalItems = [
  // 'All', 'Red' , 'Black','Brown', 'Pink', 'Beige', 'Yellow' , 'Green' , 'Grey' , 'Multicolor'

  { id: "s2", name: "Red", color: "#d6d6d6", url: "https://www.royalindianstones.com/assets/img/products/sandstone/agra-red/agra-red-sawn-wet-sandstone-tiles.jpg" },
  { id: "s9", name: "Pink", color: "#d4607a", url: "https://www.royalindianstones.com/assets/img/products/sandstone/bansi-pink/bansi-pink-sandstone-honed-finish-tiles.jpg" },
  //   { id: "s3",  name: "Gold",       color: "#c9a84c", url: "/home_prod/gold.png" },
  //   { id: "s4",  name: "Blue",       color: "#2a5fa5", url: "/home_prod/blue.png" },
  { id: "s5", name: "Brown", color: "#7b4f2e", url: "https://www.royalindianstones.com/assets/img/products/sandstone/chocolate/chocolate-sandstone-natural-finish-calibrated-tiles.jpg" },
  //   { id: "s6",  name: "Red",        color: "#b52a2a", url: "/home_prod/red.png" },
  { id: "s8", name: "Yellow", color: "#d4b400", url: "https://www.royalindianstones.com/assets/img/products/sandstone/jaisalmer-yellow/jaisalmer-yellow-sandstone-honed-polished-cut-to-size-tiles.jpg" },



  { id: "s10", name: "Grey", color: "#7a7a7a", url: "https://www.royalindianstones.com/assets/img/products/sandstone/lalitpur-grey/lalitpur-grey-sandstone-natural-patio-pack-tiles.jpg" },
  { id: "s11", name: "Green", color: "#2e7d32", url: "https://www.royalindianstones.com/assets/img/products/sandstone/raj-green/raj-green-natural-sandstone-floor-covering-tiles.jpg" },
  { id: "s1", name: "Black", color: "#1a1a1a", url: "https://www.royalindianstones.com/assets/img/products/sandstone/sagar-black/sagar-black-natural-wet-sandstone-paving-exterior-tiles.jpg" },
  //   { id: "s12", name: "Orange",     color: "#e07b2a", url: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Onida-orange-granite.webp" },
  { id: "s13", name: "Beige", color: "#F5F5DC", url: "https://www.royalindianstones.com/assets/img/products/sandstone/camel-dust/camel-dust-sandstone-natural-paving-tiles.jpg" },
  { id: "s7", name: "Multicolor", color: "#9b59b6", url: "https://www.royalindianstones.com/assets/img/products/sandstone/rainbow/rainbow-sandstone-swan-finish-paving-tiles.jpg" },
];

/* ─── Styles ─────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .gc-root {
    --bg: #f5f0e8;
    --text-dark: #3d2b0f;
    --text-mid: #7a6a52;
    --accent: #c8a84c;
    --badge-bg: #1a1a0e;
    --badge-txt: #d4b400;
    --card-radius: 18px;
   
    font-family: 'Jost', sans-serif;
    width: 100%;
    padding: 40px 0 48px;
    overflow: hidden;
    user-select: none;
  }

  /* ── Header ── */
  .gc-header {
    text-align: center;
    margin-bottom: 32px;
    padding: 0 16px;
  }
  .gc-eyebrow {
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.18em;
    color: var(--text-dark);
    text-transform: uppercase;
    margin-bottom: 8px;
    opacity: 0.7;
  }
  .gc-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 5vw, 52px);
    font-weight: 600;
    color: var(--text-dark);
    line-height: 1.1;
  }

  /* ── Track wrapper ── */
  .gc-track-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  /* ── Track ── */
  .gc-track {
    display: flex;
    align-items: center;
    will-change: transform;
    transition: transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    touch-action: pan-y;
  }
  .gc-track.gc-no-transition {
    transition: none !important;
  }

  /* ── Card ── */
  .gc-card {
    flex: 0 0 auto;
    position: relative;
    cursor: pointer;
    transition:
      transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      opacity 0.45s ease;
  }
  .gc-card-inner {
    width: 100%;
    height: 100%;
    border-radius: var(--card-radius);
    overflow: hidden;
    background: #ccc;
    box-shadow: 0 8px 32px rgba(0,0,0,0.13);
    transition: box-shadow 0.45s ease;
  }
  .gc-card.gc-active .gc-card-inner {
    box-shadow: 0 16px 48px rgba(0,0,0,0.22);
  }
  .gc-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;
    background: #d8d0c8;
  }

  .marble-view-all-btn{
      margin-top: 50px;
    padding: 10px 10px;
    width: 250px;
    border: solid;
    border-radius: 50px;
    }
  /* ── Badge ── */
  .gc-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    background: var(--badge-bg);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: var(--badge-txt);
    font-weight: 700;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    pointer-events: none;
  }

  /* ── Label ── */
  .gc-label {
    text-align: center;
    margin-top: 20px;
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-dark);
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.35s ease, transform 0.35s ease;
    min-height: 20px;
  }
  .gc-label.gc-label-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Nav row ── */
  .gc-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 24px;
    padding: 0 10px;
  }

  /* ── Arrow buttons ── */
  .gc-arrow {
    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 50%;
    border: 1.5px solid rgba(61,43,15,0.30);
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-dark);
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
    flex-shrink: 0;
  }
  .gc-arrow:hover {
    background: rgba(61,43,15,0.08);
    border-color: var(--text-dark);
    transform: scale(1.08);
  }
  .gc-arrow:active { transform: scale(0.94); }
  .gc-arrow svg { pointer-events: none; }

  /* ── Dots strip — ALL 13 always visible, wrapping allowed ── */
  .gc-dots {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    flex-wrap: wrap;
    flex: 1;
    max-width: 320px;
  }

  .gc-dot {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
    transition: transform 0.25s ease, outline 0.2s ease, opacity 0.25s ease;
    outline: 2.5px solid transparent;
    outline-offset: 2.5px;
    opacity: 0.72;
  }
  .gc-dot.gc-dot-active {
    transform: scale(1.3);
    outline: 2.5px solid var(--text-dark);
    opacity: 1;
  }
  .gc-dot:hover:not(.gc-dot-active) {
    transform: scale(1.15);
    opacity: 1;
  }

  /* Mobile: tighter dots */
  @media (max-width: 480px) {
    .gc-dot { width: 18px; height: 18px; }
    .gc-dots { gap: 5px; max-width: 240px; }
    .gc-nav  { gap: 6px; padding: 0 6px; }
  }
`;

/* ─── Helper: image with colour fallback ─────────────────── */
function GraniteImage({ url, name, color }) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <div style={{
        width: "100%", height: "100%",
        background: color,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ color: "#fff", fontSize: 11, opacity: 0.75, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {name}
        </span>
      </div>
    );
  }
  return <img src={url} alt={name} onError={() => setErrored(true)} draggable={false} />;
}



/* ─── Main Component ─────────────────────────────────────── */
export default function SandStoneCarousel() {
  const total = originalItems.length;
  const navigate = useNavigate();
  /*
   * INFINITE LOOP STRATEGY
   * We render 3 full copies: [copy-A][copy-B][copy-C]
   * virtualIdx is the index into this 3×total array.
   * We always start in the middle copy (copy-B, offset = total).
   * When virtualIdx drifts into copy-A or copy-C after a transition,
   * we silently (no-transition) jump back to the equivalent position in copy-B.
   * This means the user can swipe/advance in either direction forever.
   */
  const MID = total; // start offset into the cloned array (= copy-B index 0)
  const clonedItems = [...originalItems, ...originalItems, ...originalItems];

  const [virtualIdx, setVirtualIdx] = useState(MID + 10); // start at Green
  const [noTransition, setNoTransition] = useState(false);
  const [labelVisible, setLabelVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  // Autoplay & pause management via refs (avoids stale closure in setInterval)
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef(null);
  const virtualIdxRef = useRef(MID + 10);

  // Sync ref with state
  useEffect(() => { virtualIdxRef.current = virtualIdx; }, [virtualIdx]);

  // Touch
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isDragging = useRef(false);
  const trackRef = useRef(null);

  // Resize detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Layout constants ──
  const vw = typeof window !== "undefined" ? window.innerWidth : 375;
  const CARD_W = isMobile ? Math.min(vw * 0.72, 280) : 260;
  const CARD_H = isMobile ? CARD_W * 1.18 : 360;
  const SIDE_SCALE = isMobile ? 0.78 : 0.75;
  const SIDE_OPACITY = isMobile ? 0.65 : 0.60;
  const GAP = isMobile ? 14 : 20;
  const CARD_SLOT = CARD_W + GAP;

  // Real item index (0..total-1) from virtualIdx
  const realIdx = ((virtualIdx % total) + total) % total;

  /* ── Navigate ─────────────────────────────────────────── */
  const goTo = useCallback((newVirtual, skipTransition = false) => {
    setLabelVisible(false);
    if (skipTransition) {
      setNoTransition(true);
      setVirtualIdx(newVirtual);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setNoTransition(false);
          setLabelVisible(true);
        });
      });
    } else {
      setVirtualIdx(newVirtual);
      setTimeout(() => setLabelVisible(true), 320);
    }
  }, []);

  // After CSS transition ends: jump back into middle copy if we've drifted
  const handleTransitionEnd = useCallback(() => {
    const v = virtualIdxRef.current;
    if (v < MID) {
      goTo(v + total, true);
    } else if (v >= MID + total) {
      goTo(v - total, true);
    }
  }, [MID, total, goTo]);

  const scheduleResume = useCallback(() => {
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 2000);
  }, []);

  const prev = useCallback(() => {
    pausedRef.current = true;
    goTo(virtualIdxRef.current - 1);
    scheduleResume();
  }, [goTo, scheduleResume]);

  const next = useCallback(() => {
    pausedRef.current = true;
    goTo(virtualIdxRef.current + 1);
    scheduleResume();
  }, [goTo, scheduleResume]);

  /* ── Autoplay — 5 second interval ── */
  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setLabelVisible(false);
      setVirtualIdx((v) => {
        const next = v + 1;
        virtualIdxRef.current = next;
        return next;
      });
      setTimeout(() => setLabelVisible(true), 320);
    }, 3000);
    return () => clearInterval(id);
  }, []); // mount-only — reads pausedRef via ref, uses functional updater

  /* ── Hover pause/resume ── */
  const onMouseEnter = useCallback(() => {
    pausedRef.current = true;
    clearTimeout(resumeTimerRef.current);
  }, []);
  const onMouseLeave = useCallback(() => {
    scheduleResume();
  }, [scheduleResume]);

  /* ── Touch handlers ── */
  // ADD this ref near your other refs
  const dragOffset = useRef(0);
  const [, forceRender] = useState(0); // for drag visual feedback

  const onTouchStart = useCallback((e) => {
    pausedRef.current = true;
    clearTimeout(resumeTimerRef.current);
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
    dragOffset.current = 0;
  }, []);

  const onTouchMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    if (Math.abs(dy) > Math.abs(dx) + 5) {
      isDragging.current = false;
      dragOffset.current = 0;
      forceRender(n => n + 1);
      return;
    }

    e.preventDefault();
    dragOffset.current = dx;
    forceRender(n => n + 1);
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const dx = dragOffset.current;
    dragOffset.current = 0;

    const threshold = CARD_W * 0.18;
    if (dx < -threshold) goTo(virtualIdxRef.current + 1);
    else if (dx > threshold) goTo(virtualIdxRef.current - 1);
    else goTo(virtualIdxRef.current);

    scheduleResume();
  }, [CARD_W, goTo, scheduleResume]);


  /* ── Track translate ── */
  const trackTranslate = -(virtualIdx * CARD_SLOT) + dragOffset.current;
  const trackTransform = `translateX(calc(50% + ${trackTranslate}px - ${CARD_W / 2 + GAP / 2}px))`;

  /* ── Per-card style ── */
  const cardStyle = (clonedIdx) => {
    const diff = clonedIdx - virtualIdx;
    const absDiff = Math.abs(diff);
    const isActive = diff === 0;
    const scale = isActive ? 1 : Math.max(SIDE_SCALE - (absDiff - 1) * 0.06, 0.45);
    const opacity = isActive ? 1 : Math.max(SIDE_OPACITY - (absDiff - 1) * 0.12, 0.08);
    const zIndex = isActive ? 10 : Math.max(10 - absDiff * 2, 0);
    return {
      width: CARD_W,
      height: CARD_H,
      transform: `scale(${scale})`,
      opacity,
      zIndex,
      marginLeft: GAP / 2,
      marginRight: GAP / 2,
      transformOrigin: "center center",
    };
  };

  return (
    <>
      <style>{css}</style>
      <section
        className="gc-root"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Header */}
        <div className="gc-header">
          {<p className="gc-eyebrow">[ Our Premium Selection ]</p>}
          <h2 className="gc-title">Premium Sandstone Collection</h2>
          <p className="gc-eyebrow">[ Click any color to view its patterns ]</p>
        </div>

        {/* Carousel track */}
        <div className="gc-track-wrapper">
          <div
            ref={trackRef}
            className={`gc-track${noTransition ? " gc-no-transition" : ""}`}
            style={{ transform: trackTransform }}
            onTransitionEnd={handleTransitionEnd}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {clonedItems.map((item, clonedIdx) => {
              const diff = clonedIdx - virtualIdx;
              const isActive = diff === 0;
              return (
                <div
                  key={`${item.id}-clone-${clonedIdx}`}
                  className={`gc-card${isActive ? " gc-active" : ""}`}
                  style={cardStyle(clonedIdx)}
                  onClick={() => {

                    navigate(`/category/sandstone?category=${encodeURIComponent(item.name.trim())}`)
                    pausedRef.current = true;
                    goTo(virtualIdx + diff);
                    scheduleResume();
                  }}
                >
                  <div className="gc-card-inner">
                    <GraniteImage url={item.url} name={item.name} color={item.color} />
                  </div>
                  {/* {isActive && <div className="gc-badge">✦</div>} */}
                </div>
              );
            })}
          </div>
        </div>

        {/* Label */}
        <div className={`gc-label${labelVisible ? " gc-label-visible" : ""}`}>
          {originalItems[realIdx]?.name}
        </div>

        {/* Nav: arrow — ALL 13 colour dots — arrow */}
        <div className="gc-nav">
          <button className="gc-arrow" onClick={prev} aria-label="Previous">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="gc-dots">
            {originalItems.map((item, i) => (
              <button
                key={item.id}
                className={`gc-dot${i === realIdx ? " gc-dot-active" : ""}`}
                style={{ background: item.color }}
                onClick={() => {
                  pausedRef.current = true;
                  // Jump via shortest path from current real position
                  let delta = i - realIdx;
                  if (delta > total / 2) delta -= total;
                  if (delta < -total / 2) delta += total;
                  goTo(virtualIdx + delta);
                  scheduleResume();
                }}
                aria-label={item.name}
                title={item.name}
              />
            ))}
          </div>

          <button className="gc-arrow" onClick={next} aria-label="Next">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>


        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            className="marble-view-all-btn"
            onClick={() => navigate("/category/sandstone")}
          >
            View All Sandstones
          </button>
        </div>
      </section>
    </>
  );
}