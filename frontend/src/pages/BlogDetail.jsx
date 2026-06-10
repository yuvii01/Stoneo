import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BlogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
            setPost(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Blog post not found.');
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ padding: "120px 20px", textAlign: "center", fontFamily: "'Jost', sans-serif" }}>Loading...</div>;
    }

    if (error || !post) {
        return (
            <div style={{ padding: "120px 20px", textAlign: "center", fontFamily: "'Jost', sans-serif" }}>
                <h2>{error || 'Blog post not found.'}</h2>
                <button 
                    onClick={() => navigate('/blogs')} 
                    style={{ padding: "12px 24px", marginTop: "20px", cursor: "pointer", background: "#111", color: "#fff", border: "none", borderRadius: "4px" }}
                >
                    Back to Blogs
                </button>
            </div>
        );
    }

    return (
        <article style={{ fontFamily: "'Jost', sans-serif", backgroundColor: "#fff", color: "#333", padding: "80px 20px" }}>
            <div style={{ maxWidth: "840px", margin: "0 auto" }}>
                <button 
                    onClick={() => navigate('/blogs')}
                    style={{ background: "none", border: "none", fontSize: "15px", color: "#666", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", padding: 0, marginBottom: "40px", textTransform: "uppercase", letterSpacing: "1px" }}
                >
                    &larr; Back to Blogs
                </button>
                
                <h1 style={{ fontSize: "46px", fontWeight: 300, lineHeight: 1.2, marginBottom: "20px", color: "#111" }}>
                    {post.title}
                </h1>
                
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "40px", color: "#777", fontSize: "15px" }}>
                    <span>By <strong style={{ color: "#333" }}>{post.author}</strong></span>
                    <span>•</span>
                    <span>{post.date}</span>
                </div>

                <div style={{ width: "100%", height: "480px", overflow: "hidden", marginBottom: "50px", borderRadius: "12px" }}>
                    <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                <div style={{ fontSize: "18px", lineHeight: 1.8, color: "#444", whiteSpace: "pre-wrap" }}>
                    {post.content}
                </div>
            </div>
        </article>
    );
}
