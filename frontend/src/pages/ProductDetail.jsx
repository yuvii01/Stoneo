import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if product was passed in navigation state
    const passedProduct = location.state?.product;
    
    const [product, setProduct] = useState(passedProduct || null);
    const [loading, setLoading] = useState(!passedProduct);

    useEffect(() => {
        if (passedProduct) {
            setLoading(false);
            return;
        }
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/products/${id}`);
                if (!res.ok) throw new Error("Product not found");
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                console.error("Error fetching product:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, passedProduct]);

    if (loading) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h2>Loading...</h2>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h2>Product Not Found</h2>
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ marginTop: '20px', padding: '10px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Go Back
                </button>
            </div>
        );
    }

    const rawImages = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
    let displayImages = [];
    if (rawImages.length >= 3) {
        displayImages = rawImages;
    } else if (rawImages.length === 2) {
        displayImages = [rawImages[0], rawImages[1], rawImages[0]];
    } else if (rawImages.length === 1) {
        displayImages = [rawImages[0], rawImages[0], rawImages[0]];
    }

    const specFinish = product.finish?.length > 0 ? product.finish : ['Polished', 'Honed', 'Leathered'];
    const specInterior = product.interior?.length > 0 ? product.interior : ['Flooring', 'Countertops', 'Wall Cladding', 'Bathroom Vanity'];
    const specExterior = product.exterior?.length > 0 ? product.exterior : ['Building Facades', 'Patios', 'Walkways'];
    const specThickness = product.thickness || '18mm - 20mm';
    const specSlipResistance = product.slipResistance || 'High (Textured) / Medium (Polished)';

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 20px 60px 20px', fontFamily: "'Jost', sans-serif" }}>
            <button 
                onClick={() => navigate(-1)} 
                style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '15px' }}
            >
                ← Back
            </button>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px', alignItems: 'start' }}>
                
                {/* TOP-LEFT: Images */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: displayImages.length >= 2 ? '1fr 1fr' : '1fr', 
                    gridTemplateRows: displayImages.length >= 3 ? '1fr 1fr' : '1fr', 
                    gap: '10px',
                    height: '500px',
                    width: '100%'
                }}>
                    {displayImages.length === 0 ? (
                        <div style={{ backgroundColor: '#f5f5f5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', gridRow: '1 / -1', gridColumn: '1 / -1' }}>
                            No Image Available
                        </div>
                    ) : (
                        <>
                            <div style={{ gridRow: '1 / span 2', gridColumn: '1' }}>
                                <img src={displayImages[0]} alt={`${product.name} - View 1`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                            </div>
                            <div style={{ gridRow: '1', gridColumn: '2' }}>
                                <img src={displayImages[1]} alt={`${product.name} - View 2`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                            </div>
                            <div style={{ gridRow: '2', gridColumn: '2' }}>
                                <img src={displayImages[2]} alt={`${product.name} - View 3`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                            </div>
                        </>
                    )}
                </div>

                {/* RIGHT: Data */}
                <div>
                    <h1 style={{ fontSize: '36px', fontWeight: 400, margin: '0 0 20px 0', color: '#222' }}>{product.name}</h1>
                    {product.category && (
                        <div style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: '#f0f0f0', borderRadius: '20px', fontSize: '14px', marginBottom: '20px', color: '#333' }}>
                            {product.category}
                        </div>
                    )}
                    
                    {product.priceRange && (
                        <div style={{ fontSize: '20px', fontWeight: 600, color: '#a45040', marginBottom: '20px' }}>
                            Price: {product.priceRange}
                        </div>
                    )}
                    
                    <p style={{ fontSize: '18px', color: '#555', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                        {product.description || 'No description available for this product.'}
                    </p>
                    
                    <div style={{ marginTop: '30px' }}>
                        <button 
                            onClick={() => navigate(`/get-quote?stone=${encodeURIComponent(product.name)}&image=${encodeURIComponent(displayImages[0] || '')}`)}
                            style={{ padding: '14px 35px', background: '#111', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', fontWeight: 500, width: '100%', maxWidth: '300px' }}
                        >
                            Request a Quote
                        </button>
                    </div>
                </div>
            </div>

            {/* BOTTOM: Data */}
            <div style={{ marginTop: '60px', borderTop: '1px solid #eee', paddingTop: '40px' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '30px', color: '#333' }}>Product Specifications</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
                    
                    {specFinish && specFinish.length > 0 && (
                        <div>
                            <h3 style={{ fontSize: '15px', color: '#888', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available Finishes</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {specFinish.map(f => (
                                    <span key={f} style={{ padding: '6px 12px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', color: '#333' }}>
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {specInterior && specInterior.length > 0 && (
                        <div>
                            <h3 style={{ fontSize: '15px', color: '#888', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interior Applications</h3>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: '#444', lineHeight: '1.6' }}>
                                {specInterior.map(i => <li key={i} style={{ marginBottom: '6px' }}>{i}</li>)}
                            </ul>
                        </div>
                    )}

                    {specExterior && specExterior.length > 0 && (
                        <div>
                            <h3 style={{ fontSize: '15px', color: '#888', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Exterior Applications</h3>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: '#444', lineHeight: '1.6' }}>
                                {specExterior.map(e => <li key={e} style={{ marginBottom: '6px' }}>{e}</li>)}
                            </ul>
                        </div>
                    )}
                    
                    {specThickness && (
                        <div>
                            <h3 style={{ fontSize: '15px', color: '#888', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Thickness</h3>
                            <p style={{ margin: 0, color: '#444', fontSize: '15px' }}>{specThickness}</p>
                        </div>
                    )}
                    
                    {specSlipResistance && (
                        <div>
                            <h3 style={{ fontSize: '15px', color: '#888', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Slip Resistance</h3>
                            <p style={{ margin: 0, color: '#444', fontSize: '15px' }}>{specSlipResistance}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
