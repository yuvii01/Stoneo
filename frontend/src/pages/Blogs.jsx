import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Blogs() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form state
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        author: 'KM Stonex Team'
    });

    const [dragActive, setDragActive] = useState(false);

    const handleDrag = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = function(e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChangeFile = function(e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        if (!file.type.startsWith('image/')) {
            alert("Please drop an image file.");
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setFormData(prev => ({ ...prev, image: reader.result }));
        };
        reader.onerror = (error) => {
            console.error("Error reading file: ", error);
        };
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/blogs');
            setBlogs(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) {
            alert("Please provide an image URL or drop an image file.");
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/blogs', formData);
            setShowForm(false);
            setFormData({ title: '', excerpt: '', content: '', image: '', author: 'KM Stonex Team' });
            fetchBlogs(); // Refresh blogs
        } catch (error) {
            console.error("Error creating blog:", error);
            alert("Failed to create blog. Is the backend running?");
        }
    };

    return (
        <div style={{ fontFamily: "'Jost', sans-serif", backgroundColor: "#fff", color: "#333", padding: "80px 20px" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "60px" }}>
                    <div style={{ width: "120px" }}></div> {/* Spacer for centering */}
                    <h1 style={{ 
                        textAlign: "center", 
                        fontSize: "56px", 
                        fontWeight: 300, 
                        letterSpacing: "4px", 
                        margin: 0, 
                        textTransform: "uppercase",
                        color: "#111" 
                    }}>
                        Blogs
                    </h1>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#111",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            width: "120px"
                        }}
                    >
                        {showForm ? "Close Form" : "+ Add Blog"}
                    </button>
                </div>

                {showForm && (
                    <div style={{ background: "#f9f9f9", padding: "30px", marginBottom: "50px", borderRadius: "8px", border: "1px solid #eee" }}>
                        <h2 style={{ marginBottom: "20px" }}>Add a New Blog</h2>
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Blog Title" required style={{ padding: "10px", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }} />
                            <input type="text" name="author" value={formData.author} onChange={handleInputChange} placeholder="Author Name" required style={{ padding: "10px", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }} />
                            
                            <div style={{ margin: "10px 0" }}>
                                <label style={{ display: "block", marginBottom: "5px", color: "#666", fontSize: "14px", fontWeight: "500" }}>Blog Image (Drag & Drop or URL)</label>
                                <div 
                                    onDragEnter={handleDrag} 
                                    onDragLeave={handleDrag} 
                                    onDragOver={handleDrag} 
                                    onDrop={handleDrop}
                                    style={{ 
                                        padding: "20px", 
                                        border: `2px dashed ${dragActive ? "#111" : "#ccc"}`, 
                                        borderRadius: "4px", 
                                        textAlign: "center",
                                        backgroundColor: dragActive ? "#f0f0f0" : "#fff",
                                        cursor: "pointer",
                                        position: "relative",
                                        minHeight: "100px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    {formData.image && formData.image.startsWith('data:image') ? (
                                        <div style={{ position: "relative", display: "inline-block" }}>
                                            <img src={formData.image} alt="Preview" style={{ maxHeight: "150px", objectFit: "contain", borderRadius: "4px" }} />
                                            <button 
                                                type="button" 
                                                onClick={(e) => { e.preventDefault(); setFormData(prev => ({...prev, image: ''})); }}
                                                style={{ position: "absolute", top: "-10px", right: "-10px", background: "#ff4444", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <p style={{ margin: "0", color: "#666", fontSize: "15px" }}>{formData.image ? "URL provided. Drop file to replace." : "Drag & drop an image here, or click to browse"}</p>
                                            <input type="file" accept="image/*" onChange={handleChangeFile} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
                                        </>
                                    )}
                                </div>
                                <div style={{ textAlign: "center", margin: "10px 0", color: "#999", fontSize: "12px", fontWeight: "bold" }}>OR</div>
                                <input type="url" name="image" value={formData.image && !formData.image.startsWith('data:image') ? formData.image : ''} onChange={handleInputChange} placeholder="Paste Image URL (e.g. from Unsplash)" style={{ padding: "10px", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }} />
                            </div>
                            <textarea name="excerpt" value={formData.excerpt} onChange={handleInputChange} placeholder="Short Excerpt (shows on card)" required rows={2} style={{ padding: "10px", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }} />
                            <textarea name="content" value={formData.content} onChange={handleInputChange} placeholder="Full Content" required rows={6} style={{ padding: "10px", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }} />
                            <button type="submit" style={{ padding: "12px 20px", backgroundColor: "#111", color: "#fff", border: "none", cursor: "pointer", alignSelf: "flex-start", borderRadius: "4px" }}>Publish Blog</button>
                        </form>
                    </div>
                )}
                
                {loading ? (
                    <div style={{ textAlign: "center", padding: "50px" }}>Loading blogs...</div>
                ) : blogs.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "50px" }}>No blogs found. Be the first to add one!</div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px" }}>
                        {blogs.map(post => (
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
