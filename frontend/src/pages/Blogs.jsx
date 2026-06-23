import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = selectedTags.length > 0 ? (blog.tags && selectedTags.some(t => blog.tags.includes(t))) : true;
        return matchesSearch && matchesTag;
    });

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    return (
        <div className="blogs-page-container" style={{ fontFamily: "'Jost', sans-serif", backgroundColor: "#fff", color: "#333", padding: "40px 20px" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ marginBottom: "60px" }}>
                    <h1 style={{
                        textAlign: "center",
                        fontSize: "clamp(36px, 8vw, 56px)",
                        fontWeight: 300,
                        letterSpacing: "clamp(2px, 1vw, 4px)",
                        paddingTop: "80px",
                        margin: 0,
                        textTransform: "uppercase",
                        color: "#111",
                        marginBottom: "30px"
                    }}>
                        Blogs
                    </h1>
                    <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: "15px 25px",
                                width: "100%",
                                borderRadius: "30px",
                                border: "1px solid #ddd",
                                fontSize: "16px",
                                marginBottom: "20px",
                                outline: "none",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
                            }}
                        />

                        {allTags.length > 0 && (
                            <div ref={tagsContainerRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px", position: "relative" }}>
                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
                                    <button
                                        onClick={() => { setSelectedTags([]); setShowAllTags(false); }}
                                        style={{
                                            padding: "8px 16px",
                                            borderRadius: "20px",
                                            border: "none",
                                            backgroundColor: selectedTags.length === 0 ? "#111" : "#f5f5f5",
                                            color: selectedTags.length === 0 ? "#fff" : "#666",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            transition: "all 0.2s"
                                        }}
                                    >
                                        All
                                    </button>
                                    {(showAllTags ? allTags : topTags).map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => { toggleTag(tag); setShowAllTags(false); }}
                                            style={{
                                                padding: "8px 16px",
                                                borderRadius: "20px",
                                                border: "none",
                                                backgroundColor: selectedTags.includes(tag) ? "#111" : "#f5f5f5",
                                                color: selectedTags.includes(tag) ? "#fff" : "#666",
                                                cursor: "pointer",
                                                fontSize: "14px",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                    {allTags.length > 5 && (
                                        <button
                                            onClick={() => setShowAllTags(!showAllTags)}
                                            style={{
                                                padding: "8px 16px",
                                                borderRadius: "20px",
                                                border: "1px solid #ddd",
                                                backgroundColor: "transparent",
                                                color: "#111",
                                                cursor: "pointer",
                                                fontSize: "14px",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            {showAllTags ? "Show Less" : "View All Tags"}
                                        </button>
                                    )}
                                    {selectedTags.length > 0 && (
                                        <button
                                            onClick={() => { setSelectedTags([]); setShowAllTags(false); }}
                                            style={{
                                                padding: "8px 16px",
                                                borderRadius: "20px",
                                                border: "1px solid #ff4d4f",
                                                backgroundColor: "#fff",
                                                color: "#ff4d4f",
                                                cursor: "pointer",
                                                fontSize: "14px",
                                                transition: "all 0.2s"
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ff4d4f"; e.currentTarget.style.color = "#fff"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.color = "#ff4d4f"; }}
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                                {showAllTags && (
                                    <div style={{
                                        position: "absolute",
                                        top: "100%",
                                        marginTop: "10px",
                                        zIndex: 10,
                                        width: "200px",
                                        maxHeight: "190px", // Approximate height for 5 tags (30px tag + 8px gap)
                                        overflowY: "auto",
                                        padding: "10px",
                                        backgroundColor: "#fff",
                                        borderRadius: "8px",
                                        border: "1px solid #eee",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                        alignItems: "stretch",
                                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                                    }}>
                                        {allTags.map(tag => (
                                            <button
                                                key={`all-${tag}`}
                                                onClick={() => { toggleTag(tag); setShowAllTags(false); }}
                                                style={{
                                                    padding: "8px 12px",
                                                    borderRadius: "6px",
                                                    border: "1px solid #ddd",
                                                    backgroundColor: selectedTags.includes(tag) ? "#111" : "#fff",
                                                    color: selectedTags.includes(tag) ? "#fff" : "#666",
                                                    cursor: "pointer",
                                                    fontSize: "13px",
                                                    textAlign: "left",
                                                    transition: "background-color 0.2s"
                                                }}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "50px" }}>Loading blogs...</div>
                ) : filteredBlogs.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "50px" }}>No blogs found. Check back later!</div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "clamp(20px, 4vw, 40px)" }}>
                        {filteredBlogs.map(post => (
                            <div key={post.id || post._id} style={{
                                display: "flex", flexDirection: "column", border: "1px solid #eee", backgroundColor: "#fff", transition: "box-shadow 0.3s ease", cursor: "pointer"
                            }}
                                onClick={() => navigate(`/blogs/${post.id || post._id}`)}
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.08)"}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                            >
                                <div style={{ height: "260px", overflow: "hidden" }}>
                                    <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                    />
                                </div>
                                <div style={{ padding: "30px", flex: 1, display: "flex", flexDirection: "column" }}>
                                    {post.tags && post.tags.length > 0 && (
                                        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "10px" }}>
                                            {post.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleTag(tag);
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = selectedTags.includes(tag) ? "#333" : "#e0e0e0"}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedTags.includes(tag) ? "#111" : "#f0f0f0"}
                                                    style={{
                                                        fontSize: "11px",
                                                        backgroundColor: selectedTags.includes(tag) ? "#111" : "#f0f0f0",
                                                        color: selectedTags.includes(tag) ? "#fff" : "#444",
                                                        padding: "4px 10px",
                                                        borderRadius: "12px",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "1px",
                                                        cursor: "pointer",
                                                        transition: "background-color 0.2s"
                                                    }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", lineHeight: 1.4, color: "#222" }}>{post.title}</h3>
                                    <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.6, marginBottom: "30px", flex: 1 }}>{post.excerpt}</p>
                                    <span style={{ fontSize: "14px", color: "#999", textDecoration: "none", alignSelf: "flex-start", transition: "color 0.2s" }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = "#222"}
                                        onMouseLeave={(e) => e.currentTarget.style.color = "#999"}>Read More</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
