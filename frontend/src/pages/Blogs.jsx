import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Blogs.css';

export default function Blogs() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [showAllTags, setShowAllTags] = useState(false);

    // Derived state for tags
    const [allTags, setAllTags] = useState([]);
    const [topTags, setTopTags] = useState([]);
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
            const fetchedBlogs = res.data;
            setBlogs(fetchedBlogs);

            // Extract and process tags
            const tagCounts = {};
            fetchedBlogs.forEach(blog => {
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
            setLoading(false);
        } catch (error) {
            console.error("Error fetching blogs:", error);
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
                <div className="editorial-badge-pill">
                    <span className="editorial-pulse-dot"></span>
                    Stoneo Journal • Insightful Blogs
                </div>
                <h1>The Stoneo Journal</h1>
                <p>
                    Discover masterclass design guides, quarry explorations, and expert natural stone curation from Stoneo.
                </p>
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

                            <div className="luxury-blogs-grid">
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
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}
