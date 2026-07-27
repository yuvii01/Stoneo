import React, { useState, useEffect } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { CSV_PRODUCTS } from '../../utils/constants';
import './Admin.css';

// Helper to resolve product name, image, and canonical URL from any link string
export const resolveProductPreview = (url) => {
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
    // Fallback for custom product names
    const prettyName = param.charAt(0).toUpperCase() + param.slice(1);
    return {
        name: prettyName,
        image: '/indian_marble_images/Black Forest.jpg',
        url: cleanStr.startsWith('http') || cleanStr.startsWith('/') ? cleanStr : `/products/${encodeURIComponent(param)}`
    };
};

export default function AdminBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        author: 'Stoneo Editorial',
        tags: '',
        featuredProducts: ['', '', '']
    });

    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`);
            setBlogs(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            setLoading(false);
        }
    };

    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChangeFile = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file) => {
        if (!file.type.startsWith('image/')) {
            alert("Please drop an image file.");
            return;
        }
        try {
            const options = { maxSizeMB: 0.15, maxWidthOrHeight: 1920, useWebWorker: true };
            const compressedFile = await imageCompression(file, options);
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onload = () => setFormData(prev => ({ ...prev, image: reader.result }));
            reader.onerror = (error) => console.error("Error reading file: ", error);
        } catch (error) {
            console.error("Error compressing image:", error);
            alert("Error compressing image");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFeaturedProductChange = (index, value) => {
        setFormData(prev => {
            const next = [...(prev.featuredProducts || ['', '', ''])];
            next[index] = value;
            return { ...prev, featuredProducts: next };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) {
            alert("Please provide an image URL or drop an image file.");
            return;
        }
        const payload = {
            ...formData,
            author: formData.author || 'Stoneo Editorial',
            tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
            featuredProducts: (formData.featuredProducts || [])
                .map(l => l.trim())
                .filter(Boolean)
                .slice(0, 3) // Keep 3 products at most
        };
        try {
            if (editingId) {
                await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/${editingId}`, payload);
            } else {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`, payload);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ title: '', excerpt: '', content: '', image: '', author: 'Stoneo Editorial', tags: '', featuredProducts: ['', '', ''] });
            fetchBlogs();
        } catch (error) {
            console.error("Error saving blog:", error);
            alert("Failed to save blog.");
        }
    };

    const handleEdit = (blog) => {
        setEditingId(blog.id);
        const fp = Array.isArray(blog.featuredProducts) ? blog.featuredProducts : [];
        setFormData({
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
            image: blog.image,
            author: blog.author || 'Stoneo Editorial',
            tags: blog.tags ? blog.tags.join(', ') : '',
            featuredProducts: [fp[0] || '', fp[1] || '', fp[2] || '']
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/${id}`);
                fetchBlogs();
            } catch (error) {
                console.error("Error deleting blog:", error);
                alert("Failed to delete blog.");
            }
        }
    };

    const filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Manage Blogs</h1>
                <button 
                    onClick={() => {
                        setShowForm(!showForm);
                        if (!showForm) {
                            setEditingId(null);
                            setFormData({ title: '', excerpt: '', content: '', image: '', author: 'Stoneo Editorial', tags: '', featuredProducts: ['', '', ''] });
                        }
                    }}
                    style={{ padding: '10px 20px', backgroundColor: '#111', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {showForm ? "Cancel" : "+ Add New Blog"}
                </button>
            </div>

            {showForm && (
                <div className="admin-form-container">
                    <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>{editingId ? "Edit Blog" : "Add a New Blog"}</h2>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Blog Title" required style={{ padding: "10px", width: "100%", border: "1px solid #ddd", borderRadius: "4px" }} />
                        <input type="text" name="author" value={formData.author} onChange={handleInputChange} placeholder="Author Name" required style={{ padding: "10px", width: "100%", border: "1px solid #ddd", borderRadius: "4px" }} />
                        <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Tags (comma separated, e.g. granite, interior, design)" style={{ padding: "10px", width: "100%", border: "1px solid #ddd", borderRadius: "4px" }} />

                        {/* FEATURED PRODUCTS SECTION (MAX 3) WITH LIVE UI PREVIEWS */}
                        <div style={{ margin: "10px 0", padding: "16px", backgroundColor: "#fbfaf7", border: "1px solid #e2dcd4", borderRadius: "8px" }}>
                            <label style={{ display: "block", fontWeight: "600", marginBottom: "6px", color: "#111", fontSize: "15px" }}>
                                Featured Products (Max 3 Product Links)
                            </label>
                            <p style={{ margin: "0 0 14px 0", fontSize: "13px", color: "#666" }}>
                                Paste up to 3 product links (e.g. <code>/products/Black%20Forest%20Marble</code> or full URL). Readers can inspect and redirect to these stone dossiers directly from the blog.
                            </p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {[0, 1, 2].map((idx) => {
                                    const linkVal = formData.featuredProducts ? formData.featuredProducts[idx] || '' : '';
                                    const preview = resolveProductPreview(linkVal);

                                    return (
                                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                                            <input
                                                type="text"
                                                placeholder={`Product Link #${idx + 1} (e.g. /products/Black Forest Marble)`}
                                                value={linkVal}
                                                onChange={(e) => handleFeaturedProductChange(idx, e.target.value)}
                                                style={{ flex: 1, minWidth: "240px", padding: "10px 14px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px" }}
                                            />
                                            {preview && (
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#fff", padding: "6px 14px", borderRadius: "50px", border: "1px solid #d4af37", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                                                    <img src={preview.image} alt={preview.name} style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }} />
                                                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#111" }}>{preview.name}</span>
                                                    <a
                                                        href={preview.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{ fontSize: "12px", color: "#b88554", textDecoration: "underline", marginLeft: "4px", fontWeight: "500" }}
                                                    >
                                                        Preview →
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ margin: "10px 0" }}>
                            <label style={{ display: "block", marginBottom: "5px", color: "#666", fontSize: "14px" }}>Blog Image (Drag & Drop or URL)</label>
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
                                    backgroundColor: dragActive ? "#f0f0f0" : "#fafafa",
                                    cursor: "pointer",
                                    position: "relative",
                                    minHeight: "100px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                {formData.image && formData.image.startsWith('data:image') ? (
                                    <div style={{ position: "relative", display: "inline-block" }}>
                                        <img src={formData.image} alt="Preview" style={{ maxHeight: "150px", objectFit: "contain", borderRadius: "4px" }} />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); setFormData(prev => ({ ...prev, image: '' })); }}
                                            style={{ position: "absolute", top: "-10px", right: "-10px", background: "#ff4444", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>{formData.image ? "URL provided. Drop file to replace." : "Drag & drop an image here, or click to browse"}</p>
                                        <input type="file" accept="image/*" onChange={handleChangeFile} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
                                    </>
                                )}
                            </div>
                            <div style={{ textAlign: "center", margin: "10px 0", color: "#999", fontSize: "12px", fontWeight: "bold" }}>OR</div>
                            <input type="url" name="image" value={formData.image && !formData.image.startsWith('data:image') ? formData.image : ''} onChange={handleInputChange} placeholder="Paste Image URL" style={{ padding: "10px", width: "100%", border: "1px solid #ddd", borderRadius: "4px" }} />
                        </div>
                        <textarea name="excerpt" value={formData.excerpt} onChange={handleInputChange} placeholder="Short Excerpt (shows on card)" required rows={2} style={{ padding: "10px", width: "100%", border: "1px solid #ddd", borderRadius: "4px" }} />
                        <textarea name="content" value={formData.content} onChange={handleInputChange} placeholder="Full Content" required rows={6} style={{ padding: "10px", width: "100%", border: "1px solid #ddd", borderRadius: "4px" }} />
                        <button type="submit" style={{ padding: "12px 20px", backgroundColor: "#111", color: "#fff", border: "none", cursor: "pointer", alignSelf: "flex-start", borderRadius: "4px" }}>
                            {editingId ? "Update Blog" : "Publish Blog"}
                        </button>
                    </form>
                </div>
            )}

            <div style={{ marginBottom: '30px' }}>
                <input 
                    type="text" 
                    placeholder="Search blogs..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="admin-search-input"
                />
            </div>

            {loading ? (
                <p>Loading blogs...</p>
            ) : filteredBlogs.length === 0 ? (
                <p>No blogs found.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {filteredBlogs.map(blog => (
                        <div key={blog.id} className="admin-blog-card">
                            <img src={blog.image} alt={blog.title} className="admin-blog-image" />
                            <div className="admin-blog-content">
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{blog.title}</h3>
                                <p style={{ margin: '0', color: '#666', fontSize: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {blog.excerpt}
                                </p>
                                {blog.featuredProducts && blog.featuredProducts.length > 0 && (
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                                        {blog.featuredProducts.map((link, i) => {
                                            const preview = resolveProductPreview(link);
                                            return preview ? (
                                                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: '#f5efe6', color: '#8c6a38', padding: '4px 10px', borderRadius: '12px', border: '1px solid #d4af37', fontWeight: '500' }}>
                                                    ✦ {preview.name}
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                )}
                            </div>
                            <div className="admin-blog-actions">
                                <button 
                                    onClick={() => handleEdit(blog)}
                                    style={{ padding: '8px 16px', background: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(blog.id)}
                                    style={{ padding: '8px 16px', background: '#ffebee', color: '#d32f2f', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
