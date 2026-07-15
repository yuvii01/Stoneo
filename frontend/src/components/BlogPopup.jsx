import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/blogPopup.css';

const BlogPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [latestBlog, setLatestBlog] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Don't show again if already dismissed or if we are on the blogs page
    if (isDismissed || location.pathname.includes('/blogs')) {
      setIsVisible(false);
      return;
    }

    const fetchLatestBlog = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`);
        if (res.data && res.data.length > 0) {
          // Assuming the first item is the most recent
          setLatestBlog(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching latest blog for popup", err);
      }
    };
    
    fetchLatestBlog();

    // Show the popup 4 seconds after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [location, isDismissed]);

  if (isDismissed || !latestBlog) return null;

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    setTimeout(() => setIsDismissed(true), 500);
  };

  return (
    <div className={`blog-popup-overlay ${isVisible ? 'show' : ''}`}>
      <button className="blog-popup-close" onClick={handleClose}>
        &times;
      </button>
      
      <div className="blog-popup-image-container">
        <img 
          src={latestBlog.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} 
          alt={latestBlog.title} 
          className="blog-popup-image" 
        />
        <span className="blog-popup-tag">Latest Blog</span>
      </div>
      
      <div className="blog-popup-content">
        <h4>{latestBlog.title}</h4>
        <Link 
          to={`/blogs/${latestBlog.id || latestBlog._id}`} 
          className="blog-popup-link"
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => setIsDismissed(true), 500);
          }}
        >
          Read Now &rarr;
        </Link>
      </div>
    </div>
  );
};

export default BlogPopup;
