import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import '../styles/HomeDecor.css';
import { useDbProducts } from '../utils/useDbProducts';
import ProductLoader from '../components/ProductLoader';
import NoProductsFound from '../components/NoProductsFound';
import StaggerGroup from '../components/animations/StaggerGroup';

gsap.registerPlugin(ScrollTrigger);

export default function HomeDecor() {
  const heroRef = useRef(null);
  const introRef = useRef(null);
  const galleryRef = useRef(null);
  const showcaseRef = useRef(null);
  const navigate = useNavigate();

  const productsList = useDbProducts('Home Decor', []);
  const [selectedMaterial, setSelectedMaterial] = useState('All');

  const filteredProducts = useMemo(() => {
    return productsList.filter(p => selectedMaterial === 'All' || (p.variety && p.variety.includes(selectedMaterial)) || (p.category && p.category.includes(selectedMaterial)) || (p.name && p.name.includes(selectedMaterial)));
  }, [productsList, selectedMaterial]);

  useEffect(() => {
    // Hero Text Animation
    gsap.fromTo(
      heroRef.current.querySelectorAll('.hero-text-animate'),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.2 }
    );

    // Intro Section Animation
    gsap.fromTo(
      introRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: introRef.current,
          start: 'top 80%',
        }
      }
    );

    // Gallery Items Animation
    gsap.fromTo(
      galleryRef.current.querySelectorAll('.gallery-item'),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 75%',
        }
      }
    );
  }, []);

  const decorIdeas = [
    {
      title: "Warm Sandstone Fireplaces",
      desc: "Create a cozy, inviting focal point in your living room with the natural warmth of sandstone.",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Elegant Marble Tables",
      desc: "Elevate your dining and coffee spaces with premium, hand-crafted marble surfaces.",
      img: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Onyx Accent Walls",
      desc: "Introduce a breathtaking, translucent beauty to your interiors with backlit onyx panels.",
      img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop"
    },
    {
      title: "Granite Kitchen Islands",
      desc: "Combine unmatched durability with striking aesthetics for the heart of your home.",
      img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <>
      <SEOHead
        pageKey="home-decor"
        title="Premium Home Decor | Stoneo India"
        description="Discover the best natural stone home decor. Transform your space with warmth, elegance, and friendly aesthetics using our premium marble, granite, and sandstone."
      />

      <div className="home-decor-page">
        {/* Hero Section */}
        <section className="decor-hero" ref={heroRef}>
          <div className="decor-hero-bg">
            <img src="/home_decor_hero.png" alt="Warm Home Decor" />
            <div className="decor-hero-overlay"></div>
          </div>
          <div className="decor-hero-content">
            <h1 className="hero-text-animate">Transform Your Space</h1>
            <h2 className="hero-text-animate">With Nature's Warmth</h2>
            <p className="hero-text-animate">
              Discover the most elegant, welcoming, and premium stone decor for your home.
            </p>
            <Link to="/get-quote" className="decor-btn hero-text-animate">
              Consult Our Experts
            </Link>
          </div>
        </section>

        {/* Intro Section */}
        <section className="decor-intro" ref={introRef}>
          <div className="decor-container">
            <h3 className="decor-section-title">The Essence of Comfort</h3>
            <p className="decor-section-text">
              We believe your home should be your sanctuary. A place that radiates a warm, friendly vibe the moment you walk through the door. By integrating the timeless beauty of natural stone into your decor, we help you craft spaces that are not just visually stunning, but deeply inviting.
            </p>
          </div>
        </section>

        {/* Inspiration Gallery */}
        <section className="decor-gallery-section" ref={galleryRef}>
          <div className="decor-container">
            <h3 className="decor-section-title">Inspiration for Every Room</h3>
            <div className="decor-grid">
              {decorIdeas.map((idea, index) => (
                <div key={index} className="gallery-item">
                  <div className="gallery-img-wrapper">
                    <img src={idea.img} alt={idea.title} loading="lazy" />
                  </div>
                  <div className="gallery-item-content">
                    <h4>{idea.title}</h4>
                    <p>{idea.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Materials Section */}


        {/* Product Showcase */}
        <section className="decor-showcase-section" ref={showcaseRef} style={{ padding: '80px 0', backgroundColor: '#fafaf8' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px', padding: '0 20px' }}>
            <h3 className="decor-section-title">Shop Home Decor</h3>
            <p className="decor-section-text" style={{ maxWidth: '600px', margin: '0 auto' }}>Browse our exclusive collection of home decor products.</p>
          </div>
          
          <div className="container category-layout-container">
            {/* Sidebar Filters */}
            <aside className="filter-sidebar" style={{ height: 'fit-content' }}>
              <h4 style={{ marginBottom: '15px', fontSize: '18px' }}>Categories</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['All', 'Marble', 'Granite', 'Sandstone', 'Onyx'].map(mat => (
                  <label key={mat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="decor-material"
                      checked={selectedMaterial === mat}
                      onChange={() => setSelectedMaterial(mat)}
                    />
                    {mat}
                  </label>
                ))}
              </div>
            </aside>

            {/* Product Grid */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <StaggerGroup className="products-grid" itemSelector=".product-card">
                  {productsList.loading ? (
                    <ProductLoader text="Loading Home Decor..." />
                  ) : filteredProducts.length === 0 ? (
                    <NoProductsFound
                      title="No Decor Products Found"
                      description="Check back later or change your filter."
                      onReset={() => setSelectedMaterial('All')}
                    />
                  ) : (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="product-card"
                        onClick={() => navigate(`/products/${encodeURIComponent(product.name || product.id)}`, { state: { product } })}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="product-image">
                          <img src={product.image} alt={product.name} />
                        </div>
                        <div className="product-info">
                          <h3>{product.name}</h3>
                          <div className="product-price" style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)', margin: '4px 0 8px 0' }}>
                            ₹{product.price}
                          </div>
                          <p style={{ fontSize: '12px', color: '#666' }}>{product.description?.substring(0, 50)}...</p>
                        </div>
                      </div>
                    ))
                  )}
                </StaggerGroup>
            </div>
          </div>
        </section>

        <section className="decor-materials">
          <div className="decor-container">
            <div className="materials-content">
              <h3 className="decor-section-title">Curated for Elegance</h3>
              <p className="decor-section-text">
                From the soft, earthy tones of sandstone to the rich, luxurious veins of Italian marble, our collection is handpicked to bring unparalleled sophistication to your interiors.
              </p>
              <div className="materials-buttons">
                <Link to="/category/granite" className="decor-btn-outline">Explore Granites</Link>
                <Link to="/category/marble" className="decor-btn-outline">Explore Marble</Link>
                <Link to="/category/sandstone" className="decor-btn-outline">Explore Sandstone</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
