import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const originalItems = [
    // 'All', 'Red' , 'Black','Brown', 'Pink', 'Beige', 'Yellow' , 'Green' , 'Grey' , 'Multicolor'
    { name: "Rahul Sharma", date: "2 weeks ago", rating: 5, text: "Absolutely outstanding work. The team was professional, on time, and the quality exceeded our expectations. Highly recommend to anyone looking for reliable contractors.", initials: "RS", bg: "#E6F1FB", color: "#185FA5" },
    { name: "Priya Mehra", date: "1 month ago", rating: 5, text: "Very satisfied with the renovation work at our home. Clean execution, no delays, and the workers were respectful of our space throughout the project.", initials: "PM", bg: "#E1F5EE", color: "#0F6E56" },
    { name: "Amit Kumar", date: "2 months ago", rating: 5, text: "Used their services for a commercial project. Timely delivery, transparent pricing, and excellent finishing. Will definitely work with them again.", initials: "AK", bg: "#FAEEDA", color: "#854F0B" },
    { name: "Sunita Jain", date: "3 months ago", rating: 5, text: "The team handled our entire house construction from scratch. Reliable, skilled, and communicative at every step. Best decision we made.", initials: "SJ", bg: "#FBEAF0", color: "#993556" },
    { name: "Vikram Gupta", date: "4 months ago", rating: 5, text: "Great experience overall. Top notch quality and very easy to coordinate with. Prices are fair and fully justified by the results.", initials: "VG", bg: "#EEEDFE", color: "#534AB7" },];

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
    width: 80%;
    margin : auto ;
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
export default function ReviewsCorousal() {
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
    const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 375);
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
        const check = () => {
            setVw(window.innerWidth);
            setIsMobile(window.innerWidth < 640);
        };
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // ── Layout constants ──
    const CARD_W = isMobile ? vw * 0.82 : Math.min(vw * 0.35, 520);
    const CARD_H = isMobile ? 320 : 340;
    const SIDE_SCALE = isMobile ? 0.85 : 0.80;
    const SIDE_OPACITY = isMobile ? 0.65 : 0.60;
    const GAP = isMobile ? 14 : 24;
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
        // Only show 3 cards at a time (center + 1 left + 1 right)
        const opacity = isActive ? 1 : (absDiff === 1 ? SIDE_OPACITY : 0);
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
            pointerEvents: absDiff > 1 ? "none" : "auto",
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
                    <h2 className="gc-title" style={{ marginBottom: "16px" }}>What Our Clients Say</h2>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                        <GoogleIcon />
                        <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-dark)" }}>Google reviews</span>
                        <span style={{ fontSize: "14px", color: "var(--text-mid)" }}>4.9 ★ · {total} reviews</span>
                    </div>
                </div>

                {/* Carousel track & Nav */}
                <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
                    <button className="gc-arrow" onClick={prev} aria-label="Previous" style={{ position: "absolute", left: "5%", zIndex: 20, width: "44px", height: "44px", background: "#fff" }}>
                        <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

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
                                        key={`review-clone-${clonedIdx}`}
                                        className={`gc-card${isActive ? " gc-active" : ""}`}
                                        style={cardStyle(clonedIdx)}
                                        onClick={() => {
                                            pausedRef.current = true;
                                            goTo(virtualIdx + diff);
                                            scheduleResume();
                                        }}
                                    >
                                        <div className="gc-card-inner" style={{ background: "#fff", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", border: "0.5px solid rgba(0,0,0,0.08)" }}>
                                            <div>
                                                <div style={{ color: "#F59E0B", fontSize: "16px", letterSpacing: "1px", marginBottom: "12px" }}>
                                                    {"★".repeat(item.rating || 5)}
                                                </div>
                                                <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.6, margin: "0 0 1rem 0", fontStyle: "italic" }}>
                                                    "{item.text}"
                                                </p>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: item.bg, color: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600, flexShrink: 0 }}>
                                                    {item.initials}
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>{item.name}</p>
                                                    <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{item.date}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <button className="gc-arrow" onClick={next} aria-label="Next" style={{ position: "absolute", right: "5%", zIndex: 20, width: "44px", height: "44px", background: "#fff" }}>
                        <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                            <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </section>
        </>
    );
}
function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}











// export default function ReviewsCarousel() {
//     const total = reviews.length;
//     const [current, setCurrent] = useState(0);
//     const [animated, setAnimated] = useState(true);
//     const viewportRef = useRef(null);
//     const trackRef = useRef(null);
//     const autoplayRef = useRef(null);
//     const isAnimating = useRef(false);

//     // Build the infinite list: 2 clones before + originals + 2 clones after
//     const infiniteList = [
//         ...reviews.slice(total - CLONES),
//         ...reviews,
//         ...reviews.slice(0, CLONES),
//     ];

//     const getCardWidth = useCallback(() => {
//         if (!viewportRef.current) return 0;
//         return (viewportRef.current.offsetWidth - GAP * 2) / 3;
//     }, []);

//     const getOffset = useCallback((index) => {
//         const cw = getCardWidth();
//         const vw = viewportRef.current?.offsetWidth || 0;
//         const realIndex = index + CLONES;
//         const centerOffset = (vw - cw) / 2;
//         return realIndex * (cw + GAP) - centerOffset;
//     }, [getCardWidth]);

//     // Apply transform
//     useEffect(() => {
//         if (!trackRef.current) return;
//         trackRef.current.style.transition = animated ? "transform 0.4s cubic-bezier(.4,0,.2,1)" : "none";
//         trackRef.current.style.transform = `translateX(-${getOffset(current)}px)`;
//     }, [current, animated, getOffset]);

//     const goTo = useCallback((n, anim = true) => {
//         if (isAnimating.current) return;
//         isAnimating.current = true;
//         setAnimated(anim);
//         setCurrent(((n % total) + total) % total);
//         setTimeout(() => { isAnimating.current = false; }, 420);
//     }, [total]);

//     // After transition ends, silently snap if we slid into a clone
//     const handleTransitionEnd = useCallback(() => {
//         setAnimated(false);
//         // current is already normalized — just re-apply position without animation
//         if (!trackRef.current) return;
//         trackRef.current.style.transition = "none";
//         trackRef.current.style.transform = `translateX(-${getOffset(current)}px)`;
//     }, [current, getOffset]);

//     const startAutoplay = useCallback(() => {
//         autoplayRef.current = setInterval(() => goTo(current + 1), 4000);
//     }, [current, goTo]);

//     const stopAutoplay = useCallback(() => clearInterval(autoplayRef.current), []);

//     useEffect(() => {
//         startAutoplay();
//         return () => stopAutoplay();
//     }, [current]);

//     return (
//         <section style={{ padding: "3rem 1rem", maxWidth: "900px", margin: "0 auto" }}>

//             {/* Header */}
//             <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
//                 <GoogleIcon />
//                 <span style={{ fontSize: "15px", fontWeight: 500 }}>Google reviews</span>
//                 <span style={{ fontSize: "13px", color: "#888" }}>4.9 ★ · {total} reviews</span>
//             </div>

//             {/* Viewport */}
//             <div
//                 ref={viewportRef}
//                 onMouseEnter={stopAutoplay}
//                 onMouseLeave={startAutoplay}
//                 style={{ overflow: "hidden", borderRadius: "12px" }}
//             >
//                 <div
//                     ref={trackRef}
//                     onTransitionEnd={handleTransitionEnd}
//                     style={{ display: "flex" }}
//                 >
//                     {infiniteList.map((r, i) => {
//                         const realIndex = i - CLONES;
//                         const isActive = realIndex === current;
//                         const cw = `calc((100% - ${GAP * 2}px) / 3)`;
//                         return (
//                             <div
//                                 key={i}
//                                 style={{
//                                     flexShrink: 0,
//                                     width: cw,
//                                     marginRight: `${GAP}px`,
//                                     background: "#fff",
//                                     border: `0.5px solid ${isActive ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.08)"}`,
//                                     borderRadius: "12px",
//                                     padding: "1.25rem",
//                                     boxSizing: "border-box",
//                                     opacity: isActive ? 1 : 0.38,
//                                     transform: isActive ? "scale(1)" : "scale(0.94)",
//                                     transition: "opacity 0.4s, transform 0.4s, border-color 0.4s",
//                                     cursor: "pointer",
//                                 }}
//                             >
//                                 <div style={{ color: "#F59E0B", fontSize: "15px", letterSpacing: "1px", marginBottom: "10px" }}>
//                                     {"★".repeat(r.rating)}
//                                 </div>
//                                 <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, margin: "0 0 1rem 0" }}>
//                                     "{r.text}"
//                                 </p>
//                                 <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                                     <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: r.bg, color: r.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 500, flexShrink: 0 }}>
//                                         {r.initials}
//                                     </div>
//                                     <div>
//                                         <p style={{ margin: 0, fontSize: "13px", fontWeight: 500 }}>{r.name}</p>
//                                         <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{r.date}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             {/* Controls */}
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem" }}>
//                 <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
//                     {reviews.map((_, i) => (
//                         <button
//                             key={i}
//                             onClick={() => goTo(i)}
//                             aria-label={`Review ${i + 1}`}
//                             style={{
//                                 height: "6px",
//                                 width: i === current ? "18px" : "6px",
//                                 borderRadius: i === current ? "3px" : "50%",
//                                 border: "none", padding: 0, cursor: "pointer",
//                                 background: i === current ? "#111" : "#ccc",
//                                 transition: "all 0.2s",
//                             }}
//                         />
//                     ))}
//                 </div>
//                 <div style={{ display: "flex", gap: "8px" }}>
//                     <NavBtn onClick={() => goTo(current - 1)} label="Previous">&#8592;</NavBtn>
//                     <NavBtn onClick={() => goTo(current + 1)} label="Next">&#8594;</NavBtn>
//                 </div>
//             </div>

//         </section>
//     );
// }

// function NavBtn({ onClick, label, children }) {
//     return (
//         <button onClick={onClick} aria-label={label} style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.2)", borderRadius: "8px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "18px" }}>
//             {children}
//         </button>
//     );
// }

