import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Blogs.css';
import FadeUp from '../components/animations/FadeUp';
import StaggerGroup from '../components/animations/StaggerGroup';

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

export default function Blogs() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState(DEFAULT_BLOGS);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [showAllTags, setShowAllTags] = useState(false);

    // Derived state for tags
    const [allTags, setAllTags] = useState(['granite', 'marble', 'tiles', 'cobbles', 'quartz', 'interior', 'countertops', 'paving', 'onyx', 'slate', 'cladding']);
    const [topTags, setTopTags] = useState(['granite', 'marble', 'tiles', 'cobbles', 'quartz']);
    const tagsContainerRef = useRef(null);

    // Handle click outside to close tags dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (tagsContainerRef.current && !tagsContainerRef.current.contains(event.target)) {
                setShowAllTags(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`);
            if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                setBlogs(res.data);

                // Extract and process tags
                const tagCounts = {};
                res.data.forEach(blog => {
                    if (blog.tags && Array.isArray(blog.tags)) {
                        blog.tags.forEach(tag => {
                            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                        });
                    }
                });

                const sortedTags = Object.entries(tagCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(entry => entry[0]);

                const DEFAULT_TAGS = ['granite', 'marble', 'tiles', 'cobbles', 'quartz'];
                const uniqueAllTags = Array.from(new Set([...DEFAULT_TAGS, ...sortedTags]));

                setAllTags(uniqueAllTags);
                setTopTags(DEFAULT_TAGS);
            }
        } catch (error) {
            console.warn("Backend blogs fetch warning (using default blogs fallback):", error.message);
        } finally {
            setLoading(false);
        }
    };

    // Filter blogs based on search query and selected tags
    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch =
            blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (blog.excerpt && blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesTag =
            selectedTags.length > 0
                ? (blog.tags && selectedTags.some(t => blog.tags.includes(t)))
                : true;
        return matchesSearch && matchesTag;
    });

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    // Feature the first article in the filtered list as our lead story
    const leadArticle = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
    const gridArticles = filteredBlogs.length > 1 ? filteredBlogs.slice(1) : [];

    return (
        <div className="luxury-blogs-page">
            {/* ================= HERO HEADER ================= */}
            <section
                className="luxury-blogs-hero"
                style={{
                    background: "linear-gradient(180deg, rgba(15, 16, 19, 0.75) 0%, rgba(15, 16, 19, 0.85) 100%), url('/indian_marble_images/Black Forest.jpg') center/cover no-repeat"
                }}
            >
                <FadeUp>
                    <div className="editorial-badge-pill">
                        <span className="editorial-pulse-dot"></span>
                        Stoneo Journal • Insightful Blogs
                    </div>
                </FadeUp>
                <FadeUp delay={0.1}>
                    <h1>The Stoneo Journal</h1>
                </FadeUp>
                <FadeUp delay={0.2}>
                    <p>
                        Discover masterclass design guides, quarry explorations, and expert natural stone curation from Stoneo.
                    </p>
                </FadeUp>
            </section>

            {/* ================= GLASSMORPHIC SEARCH & TAG CURATION ================= */}
            <section className="blogs-curation-section">
                <div className="blogs-curation-bar">
                    <div className="search-input-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="blog-search-input"
                            placeholder="Search architectural articles, finishes, or quarry insights..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="clear-search-btn"
                                onClick={() => setSearchQuery('')}
                                title="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {allTags.length > 0 && (
                        <div ref={tagsContainerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                            <div className="blogs-tags-row">
                                <button
                                    type="button"
                                    className={`tag-filter-chip ${selectedTags.length === 0 ? 'active' : ''}`}
                                    onClick={() => { setSelectedTags([]); setShowAllTags(false); }}
                                >
                                    All Blogs
                                </button>
                                {(showAllTags ? allTags : topTags).map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        className={`tag-filter-chip ${selectedTags.includes(tag) ? 'active' : ''}`}
                                        onClick={() => { toggleTag(tag); setShowAllTags(false); }}
                                    >
                                        #{tag}
                                    </button>
                                ))}

                                {allTags.length > 5 && (
                                    <button
                                        type="button"
                                        className="tag-filter-chip"
                                        style={{ borderColor: 'rgba(212, 163, 115, 0.4)', color: '#d4a373' }}
                                        onClick={() => setShowAllTags(!showAllTags)}
                                    >
                                        {showAllTags ? '▲ Show Fewer' : `▼ +${allTags.length - topTags.length} More Tags`}
                                    </button>
                                )}

                                {selectedTags.length > 0 && (
                                    <button
                                        type="button"
                                        className="clear-tags-btn"
                                        onClick={() => { setSelectedTags([]); setShowAllTags(false); }}
                                    >
                                        ✕ Clear Tags
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ================= CONTENT STATE AREA ================= */}
            {loading ? (
                <div className="blogs-state-container">
                    <div className="blogs-loader-spinner"></div>
                    <h3>Loading Stoneo Journal...</h3>
                    <p>Curating the latest stone design guides and atelier features.</p>
                </div>
            ) : filteredBlogs.length === 0 ? (
                <div className="blogs-state-container">
                    <h3>No Blogs Found</h3>
                    <p>We couldn't find any articles matching your search query or selected tags.</p>
                    <button
                        type="button"
                        className="reset-filters-btn"
                        onClick={() => { setSearchQuery(''); setSelectedTags([]); }}
                    >
                        Reset Search & Filters
                    </button>
                </div>
            ) : (
                <>
                    {/* ================= FEATURED LEAD ARTICLE (PANORAMIC) ================= */}
                    {leadArticle && (
                        <section className="featured-article-section">
                            <FadeUp>
                                <div
                                    className="featured-article-card"
                                    onClick={() => navigate(`/blogs/${leadArticle.id || leadArticle._id}`)}
                                >
                                <div className="featured-img-wrapper">
                                    <span className="lead-badge">✦ LEAD STORY</span>
                                    <img
                                        src={leadArticle.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
                                        alt={leadArticle.title}
                                    />
                                </div>
                                <div className="featured-content-col">
                                    <div className="article-meta-row">
                                        {leadArticle.tags && leadArticle.tags.length > 0 && (
                                            <span className="article-tag-pill">#{leadArticle.tags[0]}</span>
                                        )}
                                        <span className="article-read-time">● {leadArticle.readTime || '4 Min Read'} • {leadArticle.category || leadArticle.author || leadArticle.name || 'Stoneo Editorial'}</span>
                                    </div>
                                    <h2 className="featured-title">{leadArticle.title}</h2>
                                    <p className="featured-excerpt">{leadArticle.excerpt}</p>
                                    <span className="read-chronicle-link">
                                        Read Full Article →
                                    </span>
                                </div>
                                </div>
                            </FadeUp>
                        </section>
                    )}

                    {/* ================= EDITORIAL GRID ================= */}
                    {gridArticles.length > 0 && (
                        <section className="luxury-blogs-grid-section">
                            <div className="grid-section-header">
                                <h2 className="grid-section-title">More Blogs</h2>
                                <span className="grid-count-badge">
                                    Showing {gridArticles.length} {gridArticles.length === 1 ? 'Article' : 'Articles'}
                                </span>
                            </div>

                            <StaggerGroup className="luxury-blogs-grid" itemSelector=".luxury-blog-card">
                                {gridArticles.map(post => (
                                    <div
                                        key={post.id || post._id}
                                        className="luxury-blog-card"
                                        onClick={() => navigate(`/blogs/${post.id || post._id}`)}
                                    >
                                        <div className="card-img-wrapper">
                                            <img
                                                src={post.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'}
                                                alt={post.title}
                                            />
                                            {post.tags && post.tags.length > 0 && (
                                                <div className="card-img-overlay">
                                                    {post.tags.slice(0, 2).map(t => (
                                                        <span key={t} className="overlay-tag">#{t}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="card-content">
                                            <h3 className="card-title">{post.title}</h3>
                                            <p className="card-excerpt">{post.excerpt}</p>

                                            <div className="card-footer">
                                                <span className="card-read-more">Read Article →</span>
                                                <span className="card-date">● {post.category || post.author || post.name || 'Stoneo Editorial'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </StaggerGroup>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}
