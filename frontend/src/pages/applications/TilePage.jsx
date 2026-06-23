import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDemand } from '../../context/DemandContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function TilePage() {
    const { tileName } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { addDemand, demands } = useDemand();
    const isInterior = location.pathname.toLowerCase().includes('interior');

    // Define exact titles to match against slugs
    const interiorTitles = [
        "Flooring", "Wall Cladding", "Kitchen Countertops", "Bathroom & Vanity", 
        "Staircase", "Pooja Room & Temples", "Table Tops & Furniture"
    ];
    const exteriorTitles = [
        "Elevation/Facade Cladding", "Outdoor Flooring & Paving", "Garden & Landscaping", 
        "Driveways & Pathways", "Swimming Pool Areas"
    ];

    const activeTitles = isInterior ? interiorTitles : exteriorTitles;
    
    // Find the exact original title by comparing slugs
    const exactTitle = activeTitles.find(t => 
        t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === tileName
    );

    // Fallback if not found in list
    const decodedTileName = decodeURIComponent(tileName || '').replace(/-/g, ' ');
    const displayTitle = exactTitle || decodedTileName
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [filters, setFilters] = useState({
        material: '',
        finish: '',
        color: ''
    });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const queryParam = isInterior ? 'interior' : 'exterior';
            const res = await fetch(`${BACKEND_URL}/api/products?${queryParam}=${encodeURIComponent(displayTitle)}`);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [tileName]);

    // Get unique values for filter dropdowns
    const filterOptions = useMemo(() => ({
        material: [...new Set(products.map(p => p.category).filter(Boolean))],
        finish: [...new Set(products.flatMap(p => p.finish || []).filter(Boolean))],
        color: [...new Set(products.map(p => p.color).filter(Boolean))]
    }), [products]);

    // Apply filters
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            if (filters.material && p.category !== filters.material) return false;
            if (filters.finish && (!p.finish || !p.finish.includes(filters.finish))) return false;
            if (filters.color && p.color !== filters.color) return false;
            return true;
        });
    }, [products, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ material: '', finish: '', color: '' });
    };


    const selectStyle = {
        padding: '10px 14px', fontSize: '14px', border: '1px solid #ddd',
        borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer',
        outline: 'none', minWidth: '150px', fontFamily: "'Jost', sans-serif"
    };

    return (
        <>
            <div className="page products-page">
                <section className="granite-header page-header">
                    <div className="container container-heading">
                        <h1>{displayTitle}</h1>
                        <p>Browse our premium selection for {displayTitle.toLowerCase()} applications</p>
                    </div>
                </section>

                {/* Filter Bar */}
                <section style={{ padding: '20px 0', backgroundColor: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Filters
                            </h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={clearFilters} style={{ padding: '8px 16px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer', color: '#666' }}>
                                    Clear All
                                </button>

                            </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            <select style={selectStyle} value={filters.material} onChange={e => handleFilterChange('material', e.target.value)}>
                                <option value="">All Materials</option>
                                {filterOptions.material.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select style={selectStyle} value={filters.finish} onChange={e => handleFilterChange('finish', e.target.value)}>
                                <option value="">All Finishes</option>
                                {filterOptions.finish.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                            <select style={selectStyle} value={filters.color} onChange={e => handleFilterChange('color', e.target.value)}>
                                <option value="">All Colors</option>
                                {filterOptions.color.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="products-section">
                    <div className="container">
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#999', fontSize: '18px' }}>
                                Loading products...
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                                <p style={{ fontSize: '18px', color: '#999', marginBottom: '20px' }}>
                                    No products found for this application yet.
                                </p>

                            </div>
                        ) : (
                            <div className="products-grid">
                                {filteredProducts.map(product => (
                                    <div key={product.id} className="product-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/products/${product.id || product._id}`, { state: { product } })}>
                                        <div className="product-image">
                                            {product.images && product.images.length > 0 ? (
                                                <img src={product.images[0]} alt={product.name} />
                                            ) : (
                                                <div style={{ width: '100%', height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '14px' }}>
                                                    No Image
                                                </div>
                                            )}
                                            {(product.finish && product.finish.length > 0) && (
                                                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 10px', fontSize: '10px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                                    {product.finish[0]} {product.finish.length > 1 && `+${product.finish.length - 1}`}
                                                </div>
                                            )}
                                        </div>
                                        <div className="product-info">
                                            <h3>{product.name}</h3>
                                            <p>{product.description}</p>
                                            {product.priceRange && (
                                                <span style={{ fontSize: '13px', color: '#a45040', fontWeight: 600 }}>{product.priceRange}</span>
                                            )}
                                            <button
                                                className="get-quote-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addDemand({
                                                        ...product,
                                                        image: product.images?.[0] || ''
                                                    });
                                                }}
                                            >
                                                {demands.some(d => d.name === product.name) ? "Added!" : "Add to Demands"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>


        </>
    );
}
