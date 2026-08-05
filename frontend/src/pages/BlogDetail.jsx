import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CSV_PRODUCTS } from '../utils/constants';
import '../styles/BlogDetail.css';
import FadeUp from '../components/animations/FadeUp';
import StaggerGroup from '../components/animations/StaggerGroup';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const resolveProductPreview = (url) => {
    if (!url || !url.trim()) return null;
    const cleanStr = url.trim();
    let param = cleanStr;
    if (cleanStr.includes('/products/')) {
        param = cleanStr.split('/products/').pop();
    }
    param = decodeURIComponent(param.split('?')[0].split('#')[0]).trim();

    const found = CSV_PRODUCTS.find(p =>
        p.name.toLowerCase() === param.toLowerCase() ||
        String(p.id) === String(param)
    );
    if (found) {
        return {
            name: found.name,
            image: found.image,
            url: `/products/${encodeURIComponent(found.name)}`
        };
    }
    const prettyName = param.charAt(0).toUpperCase() + param.slice(1);
    return {
        name: prettyName,
        image: '/indian_marble_images/Black Forest.jpg',
        url: cleanStr.startsWith('http') || cleanStr.startsWith('/') ? cleanStr : `/products/${encodeURIComponent(param)}`
    };
};

export default function BlogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [copiedLink, setCopiedLink] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    // Interactive reactions state
    const [reactions, setReactions] = useState({
        helpful: { count: 24, active: false },
        insightful: { count: 18, active: false },
        inspiring: { count: 32, active: false }
    });

    const [recentBlogsList, setRecentBlogsList] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        resolveBlogPost();
        fetchRecentBlogs();
    }, [id]);

    // Handle scroll progress bar calculation
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setScrollProgress(Math.min(100, Math.max(0, percent)));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

const DEFAULT_BLOGS = [
    {
        id: 'blog-1',
        title: 'Complete Guide to Selecting Natural Marble for Luxury Homes',
        excerpt: 'Discover essential guidelines for selecting premium Italian, Statuario, and Indian marble for architectural projects.',
        content: 'Marble has been the crowning jewel of architectural design for millennia. From the legendary quarries of Carrara to the white stone of Makrana, natural marble brings unparalleled sophistication to residential and commercial sanctuaries.\n\n1. GEOLOGICAL ORIGINS & ELEGANCE\nEvery slab of natural marble carries a unique geological history etched in delicate veining patterns. When specifying marble for interior flooring or wall cladding, understanding porosity and finish options is crucial.',
        category: 'Design Guide',
        author: 'Stoneo Editorial',
        readTime: '5 Min Read',
        tags: ['marble', 'interior', 'tiles'],
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        date: 'August 2026'
    },
    {
        id: 'blog-2',
        title: 'Granite vs Quartz: The Ultimate Kitchen Countertop Comparison',
        excerpt: 'An in-depth breakdown comparing natural granite durability against engineered quartz performance.',
        content: 'Choosing the right kitchen countertop material comes down to balancing natural aesthetic appeal with daily maintenance requirements.\n\n1. DURABILITY & HEAT RESISTANCE\nGranite is an igneous rock formed under extreme subterranean heat and pressure, giving it unmatched thermal resistance. Engineered quartz, composed of natural quartz crystals bound with resin, provides a non-porous surface impervious to acidic stains.',
        category: 'Material Comparison',
        author: 'Stoneo Editorial',
        readTime: '6 Min Read',
        tags: ['granite', 'quartz', 'countertops'],
        image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
        date: 'August 2026'
    },
    {
        id: 'blog-3',
        title: 'Mastering Paving Stones for High-Traffic Outdoor Landscapes',
        excerpt: 'How cobbles, granite pavers, and sandstone transform driveways, walkways, and garden sanctuaries.',
        content: 'Paving stones provide structural integrity and timeless curb appeal for exterior landscapes.\n\n1. LOAD BEARING & DRAINAGE\nDriveways subject to vehicular load demand thick granite cobbles or high-density sandstone pavers. Proper sub-base compaction and permeable joint sand prevent shifting and erosion over decades of weather exposure.',
        category: 'Landscaping',
        author: 'Stoneo Editorial',
        readTime: '4 Min Read',
        tags: ['cobbles', 'paving', 'granite'],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        date: 'July 2026'
    },
    {
        id: 'blog-4',
        title: 'Care & Maintenance Monograph for Translucent Onyx Slabs',
        excerpt: 'Proactive sealing techniques and backlit installation practices for luxury onyx features.',
        content: 'Onyx is one of nature’s most exquisite translucent gemstones, prized for dramatic backlighting potential.\n\n1. BACKLIGHTING & SEALING PROTOCOLS\nBecause onyx is a soft calcitic stone, avoiding abrasive chemical cleaners is critical. Diffused LED light panels behind slab installations create mesmerizing ambient illumination in luxury bars and feature walls.',
        category: 'Stone Maintenance',
        author: 'Stoneo Editorial',
        readTime: '5 Min Read',
        tags: ['onyx', 'interior', 'luxury'],
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80',
        date: 'July 2026'
    },
    {
        id: 'blog-5',
        title: 'Choosing Slate & Quartzite for Modern Architectural Facades',
        excerpt: 'Thermal insulation, frost resistance, and natural cleft aesthetics for exterior elevation cladding.',
        content: 'Specialty stones like quartzite and slate offer organic textures that elevate modern architectural facades.\n\n1. ELEVATION CLADDING PERFORMANCE\nNatural slate clefting provides superior slip and water resistance, making it an architectural favorite for mountain retreats and coastal villas.',
        category: 'Architectural Monograph',
        author: 'Stoneo Editorial',
        readTime: '7 Min Read',
        tags: ['quartzite', 'slate', 'cladding'],
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4ea0d?auto=format&fit=crop&w=800&q=80',
        date: 'June 2026'
    }
];

    const resolveBlogPost = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BACKEND_URL}/api/blogs/${id}`);
            if (res.data) {
                const enriched = {
                    ...res.data,
                    readTime: res.data.readTime || "5 Min Read",
                    category: res.data.category || "Architectural Journal",
                    featuredSlab: res.data.featuredSlab || {
                        name: "Black Forest Marble",
                        image: "/indian_marble_images/Black Forest.jpg",
                        category: "Indian Marble"
                    }
                };
                setPost(enriched);
                setLoading(false);
                return;
            }
        } catch (err) {
            console.warn("Backend blog fetch failed:", err.message);
        }

        const fallback = DEFAULT_BLOGS.find(b => String(b.id) === String(id) || String(b._id) === String(id));
        if (fallback) {
            setPost(fallback);
        } else {
            setPost(null);
        }
        setLoading(false);
    };

    const fetchRecentBlogs = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/blogs`);
            const fetched = Array.isArray(res.data) ? res.data : [];
            const unique = [];
            const seen = new Set();
            for (const item of fetched) {
                const itemId = String(item.id || item._id);
                if (itemId && itemId !== 'undefined' && !seen.has(itemId)) {
                    seen.add(itemId);
                    unique.push(item);
                }
            }
            setRecentBlogsList(unique);
        } catch (err) {
            console.warn("Could not fetch recent blogs from API:", err.message);
            setRecentBlogsList([]);
        }
    };

    const handleCopyLink = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2500);
        }
    };

    const toggleReaction = (key) => {
        setReactions(prev => {
            const current = prev[key];
            const nextActive = !current.active;
            return {
                ...prev,
                [key]: {
                    active: nextActive,
                    count: nextActive ? current.count + 1 : current.count - 1
                }
            };
        });
    };

    const scrollToSection = (sectionTitle) => {
        const headings = document.querySelectorAll('.bd-article-content h2, .bd-article-content h3');
        for (let h of headings) {
            if (h.textContent.toLowerCase().includes(sectionTitle.toLowerCase())) {
                h.scrollIntoView({ behavior: 'smooth', block: 'start' });
                break;
            }
        }
    };

    if (loading) {
        return (
            <div className="bd-page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '75vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)", fontSize: '32px', color: '#111' }}>Loading Blog...</h2>
                    <p style={{ color: '#777', marginTop: '10px' }}>Retrieving monograph from Stoneo Editorial archives</p>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="bd-page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '75vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)", fontSize: '32px', color: '#111' }}>Chronicle Not Found</h2>
                    <p style={{ color: '#777', marginTop: '10px', marginBottom: '20px' }}>The requested architectural monograph could not be located in our active archives.</p>
                    <button type="button" className="bd-back-btn" onClick={() => navigate('/blogs')}>← Return to Chronicles</button>
                </div>
            </div>
        );
    }

    // Get 3 recent added blogs except the selected one
    const relatedChronicles = recentBlogsList
        .filter(item => String(item.id || item._id) !== String(post.id || post._id))
        .slice(0, 3);

    // Get up to 3 featured product links for this post
    const getFeaturedProductLinks = () => {
        if (post.featuredProducts && Array.isArray(post.featuredProducts) && post.featuredProducts.length > 0) {
            const cleaned = post.featuredProducts.filter(Boolean).slice(0, 3);
            if (cleaned.length > 0) return cleaned;
        }
        return [];
    };
    const featuredLinks = getFeaturedProductLinks();

    return (
        <div className="bd-page-container">
            {/* Reading Progress Bar Fixed at Top */}
            <div className="bd-progress-bar-container">
                <div className="bd-progress-bar-fill" style={{ width: `${scrollProgress}%` }} />
            </div>

            <div className="bd-content-wrapper">

                {/* ================= 1. TOP EDITORIAL BAR ================= */}
                <div className="bd-top-bar">
                    <button
                        type="button"
                        onClick={() => navigate('/blogs')}
                        className="bd-back-btn"
                    >
                        ← Return to Chronicles
                    </button>

                    <div className="bd-breadcrumb">
                        <span>Stoneo Editorial</span> /{' '}
                        <span>Architectural Journal</span> /{' '}
                        <span className="bd-breadcrumb-current">{post.category || 'Monograph'}</span>
                    </div>

                    <div className="bd-top-actions">
                        <button type="button" className="bd-action-icon-btn" onClick={handleCopyLink}>
                            {copiedLink ? '✓ Link Copied!' : '🔗 Copy Article Link'}
                        </button>

                    </div>
                </div>

                {/* ================= 2. EDITORIAL HEADER & TITLE ================= */}
                <div className="bd-header-section">
                    <FadeUp>
                        <div className="bd-category-pill">
                            <span className="bd-pulse-dot"></span>
                            ✦ STONEO ARCHITECTURAL MONOGRAPH • STONEO EDITORIAL
                        </div>
                    </FadeUp>

                    <FadeUp delay={0.1}>
                        <h1 className="bd-title">{post.title}</h1>
                    </FadeUp>

                    <FadeUp delay={0.2}>
                        <div className="bd-meta-bar">
                            <div className="bd-meta-item">
                                <div className="bd-author-avatar">SE</div>
                                <span>By <strong className="bd-meta-author">{post.category || post.author || post.name || 'Stoneo Editorial'}</strong></span>
                            </div>
                            <span className="bd-meta-dot">•</span>
                            <div className="bd-meta-item">
                                <span>{post.date || 'July 2026'}</span>
                            </div>
                            <span className="bd-meta-dot">•</span>
                            <div className="bd-read-time-pill">
                                ● {post.readTime || '6 Min Read'}
                            </div>
                            {post.tags && post.tags.length > 0 && (
                                <>
                                    <span className="bd-meta-dot">•</span>
                                    <div className="bd-meta-item" style={{ color: '#b88554', fontWeight: 600 }}>
                                        #{post.tags[0].toUpperCase()}
                                    </div>
                                </>
                            )}
                        </div>
                    </FadeUp>
                </div>

                {/* ================= 3. CINEMATIC HERO IMAGE ================= */}
                <div className="bd-hero-image-wrapper">
                    <div className="bd-hero-badges">
                        <div className="bd-hero-badge">⭐ STONEO EDITORIAL FEATURE</div>
                        <div className="bd-hero-badge">📍 ARCHITECTURAL STONE JOURNAL</div>
                    </div>

                    <img
                        src={post.image || '/indian_marble_images/Black Forest.jpg'}
                        alt={post.title}
                        className="bd-hero-image"
                    />

                    <div className="bd-hero-caption">
                        {post.title} — High-Resolution Natural Stone Archive • Photo Credit: Stoneo Studios
                    </div>
                </div>

                {/* ================= 4. MAIN EDITORIAL BODY & SIDEBAR GRID ================= */}
                <div className="bd-article-grid">

                    {/* LEFT COLUMN: Article Content */}
                    <div className="bd-article-content">

                        {/* Key Takeaway */}
                        <div className="bd-takeaway-box">
                            <div className="bd-takeaway-title">
                                <span>✦ STONEO EDITORIAL TAKEAWAY</span>
                            </div>
                            <p className="bd-takeaway-text">
                                {post.excerpt || 'Natural stone is an architectural heirloom. Proper material selection, finish specification, and sealing protocols ensure a lifetime of structural beauty and timeless elegance across luxury interiors.'}
                            </p>
                        </div>

                        {/* Article Text Content with formatted sections */}
                        {post.content ? (
                            post.content.split('\n\n').map((paragraph, index) => {
                                // Check if paragraph is a numbered section heading (e.g., "1. GEOLOGICAL ORIGINS...")
                                if (/^\d+\.\s+[A-Z\s&]+/.test(paragraph.trim())) {
                                    return (
                                        <h2 key={index}>
                                            {paragraph.trim()}
                                        </h2>
                                    );
                                }

                                // Check if paragraph looks like a quote (starts with "Quote:" or quotes)
                                if (paragraph.trim().startsWith('"') && paragraph.trim().endsWith('"')) {
                                    return (
                                        <div key={index} className="bd-pull-quote">
                                            {paragraph}
                                            <span className="bd-pull-quote-author">
                                                — Stoneo Editorial Journal
                                            </span>
                                        </div>
                                    );
                                }

                                return (
                                    <p key={index}>
                                        {paragraph}
                                    </p>
                                );
                            })
                        ) : (
                            <p>No article text available.</p>
                        )}

                        {/* Architectural Pull Quote */}
                        <div className="bd-pull-quote">
                            "Natural stone is not manufactured; it is discovered. Our role as master fabricators is simply to reveal the geological symphony that nature composed over millions of years."
                            <span className="bd-pull-quote-author">
                                — STONEO EDITORIAL CURATION PRINCIPLE
                            </span>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Interactive Sticky Sidebar */}
                    <aside className="bd-sidebar">

                        {/* Table of Contents Box */}
                        {/* <div className="bd-sidebar-card">
                            <h3 className="bd-sidebar-title">📑 In This Chronicle</h3>
                            <ul className="bd-toc-list">
                                <li className="bd-toc-item" onClick={() => scrollToSection('GEOLOGICAL')}>
                                    <span className="bd-toc-num">01.</span>
                                    <span>Geological Origins & Heritage</span>
                                </li>
                                <li className="bd-toc-item" onClick={() => scrollToSection('ARCHITECTURAL')}>
                                    <span className="bd-toc-num">02.</span>
                                    <span>Architectural Applications</span>
                                </li>
                                <li className="bd-toc-item" onClick={() => scrollToSection('FABRICATION')}>
                                    <span className="bd-toc-num">03.</span>
                                    <span>Master Fabrication & Finishes</span>
                                </li>
                                <li className="bd-toc-item" onClick={() => scrollToSection('CARE')}>
                                    <span className="bd-toc-num">04.</span>
                                    <span>Care & Longevity</span>
                                </li>
                            </ul>
                        </div> */}

                        {/* Featured Slabs Spotlight Box (Max 3) */}
                        <div className="bd-sidebar-card" style={{ padding: "20px", background: "#111", border: "1px solid rgba(212, 175, 55, 0.35)" }}>
                            <h4 style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)", fontSize: "1.1rem", color: "#d4af37", marginBottom: "14px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>
                                ✦ Featured Slabs ({featuredLinks.length})
                            </h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                {featuredLinks.map((link, idx) => {
                                    const preview = resolveProductPreview(link);
                                    if (!preview) return null;
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => navigate(preview.url)}
                                            style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.06)", padding: "10px", borderRadius: "8px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.12)", transition: "all 0.25s ease" }}
                                            title="Click to view stone details"
                                        >
                                            <img src={preview.image} alt={preview.name} style={{ width: "48px", height: "48px", borderRadius: "6px", objectFit: "cover" }} />
                                            <div style={{ flex: 1, overflow: "hidden" }}>
                                                <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {preview.name}
                                                </div>
                                                <span style={{ fontSize: "0.78rem", color: "#e0c080", fontWeight: "500" }}>
                                                    View Details →
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Author Profile Box */}
                        <div className="bd-sidebar-card bd-author-box">
                            <div className="bd-author-avatar-large">SE</div>
                            <h4 className="bd-author-name">Stoneo Editorial</h4>
                            <div className="bd-author-role">Architectural Journal Curators</div>
                            <p className="bd-author-bio">
                                Stoneo Editorial delivers authoritative monographs, architectural guides, and masterclass natural stone curation for architects, interior designers, and luxury estates.
                            </p>
                        </div>
                    </aside>
                </div>

                {/* ================= FEATURED SLABS BOTTOM SHOWCASE (MAX 3) ================= */}
                {featuredLinks.length > 0 && (
                    <div className="bd-featured-slabs-showcase">
                        <div className="bd-featured-showcase-header">
                            <h2>✦ Slabs Featured in This Chronicle</h2>
                            <p>Click any featured stone below to inspect full technical specifications, slab gallery, and instant pricing</p>
                        </div>

                        <div className="bd-featured-slabs-grid">
                            {featuredLinks.map((link, idx) => {
                                const preview = resolveProductPreview(link);
                                if (!preview) return null;
                                return (
                                    <div
                                        key={idx}
                                        className="bd-featured-slab-card"
                                        onClick={() => navigate(preview.url)}
                                    >
                                        <img
                                            src={preview.image}
                                            alt={preview.name}
                                            className="bd-featured-slab-card-img"
                                        />
                                        <div className="bd-featured-slab-card-content">
                                            <span className="bd-featured-slab-card-tag">
                                                ✦ FEATURED STONE #{idx + 1}
                                            </span>
                                            <h3 className="bd-featured-slab-card-title">{preview.name}</h3>
                                            <span className="bd-featured-slab-card-btn">
                                                View Stone Details →
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ================= 5. INTERACTIVE REACTION & SHARE STRIP ================= */}
                <div className="bd-reactions-section">
                    <h3 className="bd-reactions-title">Was This Architectural Chronicle Insightful?</h3>
                    <p className="bd-reactions-subtitle">
                        Share your feedback with the Stoneo Editorial team
                    </p>

                    <div className="bd-reaction-buttons">
                        <button
                            type="button"
                            className={`bd-reaction-btn ${reactions.helpful.active ? 'active' : ''}`}
                            onClick={() => toggleReaction('helpful')}
                        >
                            <span>👍 Helpful</span>
                            <span className="bd-reaction-count">{reactions.helpful.count}</span>
                        </button>

                        <button
                            type="button"
                            className={`bd-reaction-btn ${reactions.insightful.active ? 'active' : ''}`}
                            onClick={() => toggleReaction('insightful')}
                        >
                            <span>💡 Insightful</span>
                            <span className="bd-reaction-count">{reactions.insightful.count}</span>
                        </button>

                        <button
                            type="button"
                            className={`bd-reaction-btn ${reactions.inspiring.active ? 'active' : ''}`}
                            onClick={() => toggleReaction('inspiring')}
                        >
                            <span>❤️ Inspiring</span>
                            <span className="bd-reaction-count">{reactions.inspiring.count}</span>
                        </button>
                    </div>
                </div>

                {/* ================= 6. RELATED ARCHITECTURAL CHRONICLES ================= */}
                <div className="bd-related-section">
                    <div className="bd-related-header">
                        <div>
                            <h2>More From The Architectural Journal</h2>
                            <p>Explore complementary natural stone monographs and quarry chronicles</p>
                        </div>
                        <button
                            type="button"
                            className="bd-back-btn"
                            onClick={() => navigate('/blogs')}
                        >
                            View All Chronicles →
                        </button>
                    </div>

                    {relatedChronicles.length > 0 ? (
                        <StaggerGroup className="bd-related-grid" itemSelector=".bd-related-card">
                            {relatedChronicles.map(item => (
                                <div
                                    key={item.id || item._id}
                                    className="bd-related-card"
                                    onClick={() => navigate(`/blogs/${item.id || item._id}`)}
                                >
                                    <div className="bd-related-img-wrapper">
                                        <img
                                            src={item.image || '/indian_marble_images/Black Forest.jpg'}
                                            alt={item.title || 'Architectural Chronicle'}
                                            className="bd-related-img"
                                        />
                                    </div>

                                    <div className="bd-related-content">
                                        <span className="bd-related-tag">
                                            ✦ {item.category || 'Architectural Journal'}
                                        </span>
                                        <h4 className="bd-related-title">{item.title}</h4>
                                        <p className="bd-related-excerpt">
                                            {item.excerpt || (item.content ? item.content.substring(0, 120) + '...' : '')}
                                        </p>

                                        <div className="bd-related-footer">
                                            <span>Read Chronicle →</span>
                                            <span>● {item.readTime || '5 Min Read'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </StaggerGroup>
                    ) : (
                        <div style={{ padding: '40px 0', textAlign: 'center', color: '#777', fontStyle: 'italic' }}>
                            No additional chronicles published yet.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
