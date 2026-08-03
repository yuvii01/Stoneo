import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { CSV_PRODUCTS, COMPANY_INFO } from '../utils/constants';
import { useDbProducts } from '../utils/useDbProducts';
import '../styles/ProductDetail.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const allDbProducts = useDbProducts('All', CSV_PRODUCTS);

    const decodedId = decodeURIComponent(id || '').trim();
    // 1. Resolve product from navigation state or DB/CSV fallback immediately
    const passedProduct = location.state?.product;
    const fallbackProduct = allDbProducts.find((p, idx) =>
        p && (
            (p.name && p.name.toLowerCase() === decodedId.toLowerCase()) ||
            (p.id !== undefined && String(p.id) === String(decodedId)) ||
            (p._id !== undefined && String(p._id) === String(decodedId)) ||
            String(idx + 1) === String(decodedId) ||
            String(idx) === String(decodedId)
        )
    );

    const [product, setProduct] = useState(passedProduct || fallbackProduct || null);
    const [loading, setLoading] = useState(!passedProduct && !fallbackProduct);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('specs');
    const [sqFt, setSqFt] = useState(150);
    const [copiedSpec, setCopiedSpec] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        const target = passedProduct || fallbackProduct;
        if (target) {
            setProduct(target);
            setLoading(false);
            if (decodedId !== target.name && !isNaN(decodedId)) {
                navigate(`/products/${encodeURIComponent(target.name)}`, { replace: true, state: { product: target } });
            }
        }

        const fetchProduct = async () => {
            try {
                const productId = target ? (target._id || target.id) : id;
                if (!productId || String(productId).startsWith('db-') || String(productId).startsWith('csv-')) return;
                const res = await fetch(`${BACKEND_URL}/api/products/${productId}`);
                if (!res.ok) {
                    if (!target) throw new Error("Product not found");
                    return;
                }
                const data = await res.json();
                setProduct(prev => ({
                    ...data,
                    ...prev,
                    ...data,
                    images: (data.images && data.images.length > 0) ? data.images : (prev?.images || []),
                    image: data.image || (data.images && data.images[0]) || prev?.image || ''
                }));
            } catch (err) {
                console.error("Error fetching product:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, decodedId, passedProduct, fallbackProduct, navigate]);

    if (loading) {
        return (
            <div className="pd-page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)", fontSize: '28px', color: '#333' }}>Loading Product Details...</h2>
                    <p style={{ color: '#888', marginTop: '8px' }}>Retrieving live Kishangarh slab specifications</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pd-page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
                <h2 style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)", fontSize: '32px', color: '#111' }}>Product Not Found</h2>
                <p style={{ color: '#666', marginTop: '8px' }}>The requested natural stone could not be located in our active catalogue.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="pd-back-btn"
                    style={{ marginTop: '24px' }}
                >
                    ← Return to Collection
                </button>
            </div>
        );
    }

    // Prepare multi-angle display images
    const rawImages = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
    const displayImages = rawImages.length >= 4
        ? rawImages.slice(0, 4)
        : [
            rawImages[0] || '/granite_images/Absolute Black Granite.webp',
            rawImages[1] || rawImages[0] || '/granite_images/Absolute Black Granite.webp',
            rawImages[2] || rawImages[0] || '/granite_images/Absolute Black Granite.webp',
            rawImages[3] || rawImages[0] || '/granite_images/Absolute Black Granite.webp'
        ];

    const thumbLabels = [
        'Main Slab Texture',
        'High-Res Grain Close-Up',
        'Installed Architectural View',
        'Bookmatched Vein Feature'
    ];

    const specFinish = product.finish?.length > 0 ? product.finish : ['Polished', 'Honed', 'Leathered', 'Flamed (Exterior)'];
    const specInterior = product.interior?.length > 0 ? product.interior : ['Flooring & Grand Lobbies', 'Kitchen Countertops & Islands', 'Feature Wall Cladding', 'Luxury Bathroom Vanities'];
    const specExterior = product.exterior?.length > 0 ? product.exterior : ['Building Facades', 'Outdoor Patios & Decks', 'Architectural Columns'];
    const specThickness = product.thickness || '18mm - 20mm Standard (Custom 30mm Available)';
    const specSlipResistance = product.slipResistance || 'High (Textured Finish) / Medium-High (Polished)';

    // Interactive Calculator
    const numericSqFt = Math.max(10, Number(sqFt) || 0);
    const estimatedSlabs = Math.ceil(numericSqFt / 45); // Standard ~45 sq ft per slab

    // Similar Products
    const similarProducts = allDbProducts
        .filter(p => (p.category === product.category || p.material === product.material || p.stoneCategory === product.category) && p.name !== product.name)
        .slice(0, 4);

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopiedSpec(true);
            setTimeout(() => setCopiedSpec(false), 2500);
        }
    };

    const handleWhatsApp = () => {
        const text = encodeURIComponent(
            `Hello, I am interested in ${product.name} (~${numericSqFt} sq. ft. / ~${estimatedSlabs} slabs). Please share current lot pricing and availability.`
        );
        window.open(`https://wa.me/91${COMPANY_INFO.phone}?text=${text}`, '_blank');
    };

    const handleQuote = () => {
        navigate(`/get-quote?stone=${encodeURIComponent(product.name)}&image=${encodeURIComponent(displayImages[0] || '')}&sqft=${numericSqFt}`);
    };

    return (
        <div className="pd-page-container">
            {/* ================= HERO BANNER ================= */}
            <div className="pd-hero-banner" style={{ backgroundImage: `url(${displayImages[activeImageIndex] || displayImages[0]})` }}>
                <div className="pd-hero-banner-overlay"></div>
                <div className="pd-hero-banner-content">
                    <div className="pd-breadcrumb-hero">
                        <span>Kishangarh Facility</span> /{' '}
                        <span>Natural Slabs</span> /{' '}
                        <span>{product.category || product.material || 'Granite'}</span> /{' '}
                        <span className="pd-breadcrumb-current-hero">{product.name}</span>
                    </div>
                    <h1 className="pd-hero-title">{product.name}</h1>
                    <div className="pd-hero-subtitle">
                        NATURAL {product.category || product.material || 'STONE'} SLAB DETAILS
                    </div>
                </div>
            </div>

            <div className="pd-content-wrapper pd-content-overlap">

                {/* ================= 1. TOP EDITORIAL BREADCRUMB & BAR ================= */}
                <div className="pd-top-bar">
                    <button
                        onClick={() => navigate(-1)}
                        className="pd-back-btn"
                    >
                        ← Return to Collection
                    </button>

                    <div className="pd-top-actions" style={{ marginLeft: 'auto' }}>
                        <button type="button" className="pd-action-icon-btn" onClick={handleShare}>
                            {copiedSpec ? 'Link Copied!' : 'Share Stone Details'}
                        </button>
                        <button
                            type="button"
                            className="pd-action-icon-btn"
                            onClick={() => window.print()}
                        >
                            Print Spec Sheet
                        </button>
                    </div>
                </div>

                {/* ================= 2. MAIN HERO SHOWCASE GRID ================= */}
                <div className="pd-hero-grid">

                    {/* LEFT COLUMN: Interactive Gallery */}
                    <div className="pd-gallery-section">
                        <div
                            className="pd-main-image-wrapper"
                            onClick={() => setLightboxOpen(true)}
                            title="Click to zoom high-resolution slab texture"
                        >
                            <div className="pd-slab-badge-strip">
                                <div className="pd-badge-pill gold">
                                    QUARRY GRADE: A+ EXCLUSIVE
                                </div>
                                <div className="pd-badge-pill">
                                    100% NATURAL KISHANGARH ORIGIN
                                </div>
                            </div>

                            <img
                                src={displayImages[activeImageIndex]}
                                alt={`${product.name} - ${thumbLabels[activeImageIndex]}`}
                                className="pd-main-image"
                            />

                            <div className="pd-zoom-indicator">
                                Click to Open Fullscreen Lightbox
                            </div>
                        </div>

                        {/* Thumbnail Selector Strip */}
                        <div className="pd-thumbnails-grid">
                            {displayImages.map((imgUrl, idx) => (
                                <div
                                    key={idx}
                                    className={`pd-thumb-card ${activeImageIndex === idx ? 'active' : ''}`}
                                    onClick={() => setActiveImageIndex(idx)}
                                >
                                    <img src={imgUrl} alt={`${product.name} View ${idx + 1}`} className="pd-thumb-img" />
                                    <div className="pd-thumb-label">{thumbLabels[idx]}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Architectural Stone Dossier */}
                    <div className="pd-dossier-section">
                        <div className="pd-category-tag">
                            NATURAL {product.category || product.material || 'STONE'} SLAB DETAILS
                        </div>

                        <h1 className="pd-product-title">{product.name}</h1>

                        <div className="pd-starting-price-badge" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'linear-gradient(135deg, #fdfaf4, #f8f3e9)',
                            border: '1px solid #e8dec8',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            marginBottom: '16px',
                            color: '#222'
                        }}>
                            <span style={{ fontSize: '13px', color: '#776952', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Starting Price:</span>
                            <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-primary, #b48e5d)' }}>
                                Starts from ₹{product.startingPrice || product.minPrice || product.price || '100'} / sq. ft.
                            </span>
                        </div>

                        <div className="pd-quick-specs-row" style={{ borderBottom: 'none', paddingBottom: '0', marginBottom: '12px' }}>
                            <div className="pd-quick-spec-pill" style={{ width: '100%', alignItems: 'flex-start', flexWrap: 'wrap', borderRadius: '16px', padding: '12px 16px' }}>
                                <span style={{ marginTop: '2px' }}>Available Finishes:</span>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
                                    {specFinish.map((f, i) => (
                                        <strong key={i} style={{
                                            background: 'var(--pd-bg-page)',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            border: '1px solid var(--pd-border)'
                                        }}>{f}</strong>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pd-quick-specs-row">
                            <div className="pd-quick-spec-pill">
                                Standard: <strong>18mm - 20mm</strong>
                            </div>
                            {/* <div className="pd-quick-spec-pill">
                                Density: <strong>Commercial High</strong>
                            </div> */}
                            <div className="pd-quick-spec-pill">
                                Origin: <strong>Kishangarh, India</strong>
                            </div>
                        </div>

                        <div className="pd-curator-note-box">
                            <div className="pd-curator-title">
                                <span>Note</span>
                            </div>
                            <p className="pd-description-text">
                                {product.description || `An exceptional natural ${product.category || 'stone'} sourced from premier quarries and masterfully cut at our Kishangarh facility. Renowned for its distinctive mineral veining, structural durability, and timeless appeal across residential and hospitality spaces.`}
                            </p>
                        </div>

                        {/* Interactive Slab & Project Area Calculator */}


                        {/* Action Button Stack */}
                        <div className="pd-actions-stack">
                            <button
                                type="button"
                                className="pd-btn-primary-quote"
                                onClick={handleQuote}
                            >
                                <span>Request Custom Quotation for {product.name}</span>
                            </button>

                        </div>

                        <div className="pd-assurance-strip">
                            <div className="pd-assurance-item">
                                <strong>100% Genuine Origin</strong>
                            </div>
                            <div className="pd-assurance-item">
                                <strong>Precision Laser Cut</strong>
                            </div>
                            <div className="pd-assurance-item">
                                <strong>Pan-India Secure Transit</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= 3. TECHNICAL SPECIFICATIONS & APPLICATIONS TABS ================= */}

                {/* ================= 4. SIMILAR ATELIER STONES CAROUSEL / GRID ================= */}
                {similarProducts.length > 0 && (
                    <div className="pd-similar-section">
                        <div className="pd-section-title-row">
                            <div>
                                <h2>More From Our {product.category || 'Natural Stone'} Collection</h2>
                                <p>Explore complementary natural slabs selected from the same collection</p>
                            </div>
                        </div>

                        <div className="pd-similar-grid">
                            {similarProducts.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="pd-similar-card"
                                    onClick={() => navigate(`/products/${encodeURIComponent(item.name)}`, { state: { product: item } })}
                                >
                                    <div className="pd-similar-img-wrapper">
                                        <img
                                            src={item.image || item.images?.[0] || '/granite_images/Absolute Black Granite.webp'}
                                            alt={item.name}
                                            className="pd-similar-img"
                                        />
                                    </div>
                                    <div className="pd-similar-info">
                                        <span className="pd-similar-cat">{item.category || item.material || 'Stone'}</span>
                                        <h4 className="pd-similar-name">{item.name}</h4>
                                        <div className="pd-similar-link">
                                            <span>View Details →</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ================= 5. FULLSCREEN ZOOM LIGHTBOX MODAL ================= */}
            {lightboxOpen && createPortal(
                <div className="pd-lightbox-overlay" onClick={() => setLightboxOpen(false)}>
                    <button
                        type="button"
                        className="pd-lightbox-close"
                        onClick={() => setLightboxOpen(false)}
                        title="Close Fullscreen View"
                    >
                        ✕
                    </button>
                    <div className="pd-lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={displayImages[activeImageIndex]}
                            alt={`${product.name} Fullscreen Texture`}
                            className="pd-lightbox-img"
                        />
                        <div className="pd-lightbox-caption">
                            {product.name} — {thumbLabels[activeImageIndex]} • High-Resolution Kishangarh Slab Inspection
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
