import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const GEMSTONE_VARIETIES = [
    'Agate', 'Amethyst', 'Jasper', 'Rose Quartz', 'Smoky Quartz', 'Clear Quartz',
    'Tiger Eye', 'Labradorite', 'Sodalite', 'Malachite', 'Lapis Lazuli', 
    'Petrified Wood', 'Shellstone', 'Fossil'
];

const GEMSTONE_APPLICATIONS = [
    'Back Panel (Backlit / Feature Wall)',
    'Wash Basin & Vanity Bowl',
    'Table Top & Luxury Furniture',
    'Bar Counter & Vanity Top',
    'Luxury Wall Cladding',
    'Medallion Inlay & Flooring'
];

const DEFAULT_STONE_COLORS = [
    { name: 'Gold', hex: '#d4af37' },
    { name: 'Blue', hex: '#1565c0' },
    { name: 'White', hex: '#f8f9fa', border: '#ddd' },
    { name: 'Green', hex: '#2e7d32' },
    { name: 'Black', hex: '#1a1a1a' },
    { name: 'Pink', hex: '#f48fb1' },
    { name: 'Brown', hex: '#795548' },
    { name: 'Multicolor', hex: 'linear-gradient(135deg, #e53935, #43a047, #1e88e5)' }
];

const initialFormState = {
    name: '',
    color: '',
    origin: '',
    startingPrice: '',
    maximumPrice: '',
    estimatedPrice: '',
    price: '',
    gemstoneVariety: 'Agate',
    gemstoneApplications: ['Back Panel (Backlit / Feature Wall)', 'Wash Basin & Vanity Bowl', 'Table Top & Luxury Furniture'],
    isBacklit: true,
    finish: ['Polished', 'High Gloss'],
    description: '',
    images: []
};

export default function AdminRoyalGemStones() {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(initialFormState);

    const [customColors, setCustomColors] = useState([]);
    const [showAddColor, setShowAddColor] = useState(false);
    const [newColorName, setNewColorName] = useState('');
    const [newColorHex, setNewColorHex] = useState('#d4af37');

    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
            // Only list Royal Gem Stone products
            const royalProducts = (res.data || []).filter(p => p.isRoyalGemStone || p.category === 'Royal Gemstone');
            setProducts(royalProducts);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching royal gemstone products:", error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'startingPrice' || name === 'maximumPrice') {
            const sp = name === 'startingPrice' ? value : formData.startingPrice;
            const mp = name === 'maximumPrice' ? value : formData.maximumPrice;
            const formatted = sp && mp ? `₹${sp} - ₹${mp}` : (sp ? `₹${sp}` : (mp ? `₹${mp}` : ''));
            setFormData(prev => ({ 
                ...prev, 
                [name]: value, 
                price: formatted,
                estimatedPrice: formatted
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const toggleMultiSelect = (field, option) => {
        setFormData(prev => {
            const currentSelected = prev[field] || [];
            let updated;
            if (currentSelected.includes(option)) {
                updated = currentSelected.filter(item => item !== option);
            } else {
                updated = [...currentSelected, option];
            }
            return { ...prev, [field]: updated };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            alert("Product Name is required.");
            return;
        }

        const payload = {
            ...formData,
            category: 'Royal Gemstone',
            isRoyalGemStone: true,
            variety: formData.gemstoneVariety,
            interior: formData.gemstoneApplications,
            applications: formData.gemstoneApplications,
            finish: (formData.finish && formData.finish.length > 0) ? formData.finish : ['Polished', 'High Gloss'],
            startingPrice: formData.startingPrice || '',
            maximumPrice: formData.maximumPrice || '',
            estimatedPrice: formData.estimatedPrice || formData.price || '',
            price: formData.price || formData.estimatedPrice || ''
        };

        try {
            if (editingId) {
                await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${editingId}`, payload);
                alert("Royal Gem Stone updated successfully!");
            } else {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, payload);
                alert("Royal Gem Stone published successfully!");
            }
            setShowForm(false);
            setEditingId(null);
            setFormData(initialFormState);
            fetchProducts();
        } catch (error) {
            console.error("Error saving royal gemstone:", error);
            alert("Failed to save royal gemstone.");
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name || '',
            color: product.color || '',
            origin: product.origin || '',
            startingPrice: product.startingPrice || '',
            maximumPrice: product.maximumPrice || '',
            estimatedPrice: product.estimatedPrice || product.price || '',
            price: product.price || product.estimatedPrice || '',
            gemstoneVariety: product.variety || product.gemstoneVariety || 'Agate',
            gemstoneApplications: product.interior || product.applications || ['Back Panel (Backlit / Feature Wall)', 'Wash Basin & Vanity Bowl', 'Table Top & Luxury Furniture'],
            isBacklit: product.isBacklit !== undefined ? product.isBacklit : true,
            finish: product.finish || ['Polished', 'High Gloss'],
            description: product.description || '',
            images: product.images || (product.image ? [product.image] : [])
        });
        setEditingId(product.id || product._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this Royal Gem Stone?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product.");
        }
    };

    const handleDrag = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const processFiles = (files) => {
        const fileArray = Array.from(files);
        if (formData.images.length + fileArray.length > 3) {
            alert("You can upload a maximum of 3 images per product.");
            return;
        }

        fileArray.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, reader.result]
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDrop = function(e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFiles(e.dataTransfer.files);
        }
    };

    const handleChangeFiles = function(e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            processFiles(e.target.files);
        }
    };

    const removeImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, idx) => idx !== indexToRemove)
        }));
    };

    const filteredProducts = products.filter(product => {
        const query = searchQuery.toLowerCase();
        return product.name.toLowerCase().includes(query) ||
               (product.variety && product.variety.toLowerCase().includes(query)) ||
               (product.color && product.color.toLowerCase().includes(query));
    });

    if (loading) return <div>Loading Royal Gem Stones...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '28px', color: '#b48e5d' }}>👑 Royal Gem Stones</h1>
                    <p style={{ margin: '4px 0 0 0', color: '#666' }}>Manage luxury semi-precious agate, amethyst, and backlit gemstone surfaces</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => {
                            setFormData(initialFormState);
                            setEditingId(null);
                            setShowForm(true);
                        }}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#b48e5d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <span>+</span> Add New Royal Gem Stone
                    </button>
                )}
            </div>

            {showForm ? (
                <div style={{ backgroundColor: '#fff', border: '1px solid #e8dec8', borderRadius: '8px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f0e8d8' }}>
                        <h2 style={{ margin: 0, fontSize: '22px', color: '#b48e5d' }}>
                            {editingId ? 'Edit Royal Gem Stone' : 'Create New Royal Gem Stone'}
                        </h2>
                        <button
                            type="button"
                            onClick={() => { setShowForm(false); setEditingId(null); }}
                            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' }}
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                        
                        {/* VARIETY AND MINERAL */}
                        <div style={{ backgroundColor: '#fffcf0', border: '1px solid #e8dec8', padding: '20px', borderRadius: '8px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#b48e5d' }}>
                                        Gemstone Mineral / Variety *
                                    </label>
                                    <select
                                        name="gemstoneVariety"
                                        value={formData.gemstoneVariety}
                                        onChange={handleInputChange}
                                        style={{ padding: '11px', width: '100%', border: '1px solid #d4af37', borderRadius: '6px', fontSize: '15px', backgroundColor: '#fff' }}
                                    >
                                        {GEMSTONE_VARIETIES.map(v => (
                                            <option key={v} value={v}>{v}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '24px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '700', color: '#111', fontSize: '15px' }}>
                                        <input
                                            type="checkbox"
                                            name="isBacklit"
                                            checked={formData.isBacklit}
                                            onChange={handleInputChange}
                                            style={{ width: '18px', height: '18px', accentColor: '#d4af37' }}
                                        />
                                        ✨ Translucent / Backlit Support
                                    </label>
                                </div>
                            </div>

                            {/* APPLICATIONS (Back Panel, Wash Basin, Table Top) */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#b48e5d' }}>
                                    Luxury Application Areas (Back Panel, Wash Basin, Table Top, etc.) *
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px' }}>
                                    {GEMSTONE_APPLICATIONS.map(app => (
                                        <label
                                            key={app}
                                            onClick={() => toggleMultiSelect('gemstoneApplications', app)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '10px 14px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                backgroundColor: formData.gemstoneApplications.includes(app) ? '#fffcf0' : '#fafafa',
                                                border: formData.gemstoneApplications.includes(app) ? '2px solid #d4af37' : '1px solid #e2e2e2',
                                                fontWeight: formData.gemstoneApplications.includes(app) ? '700' : '500',
                                                color: formData.gemstoneApplications.includes(app) ? '#b48e5d' : '#444',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.gemstoneApplications.includes(app)}
                                                onChange={() => {}}
                                                style={{ width: '16px', height: '16px', accentColor: '#d4af37' }}
                                            />
                                            {app}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* BASIC PRODUCT METADATA */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Royal Blue Agate Backlit Surface"
                                    required
                                    style={{ padding: "11px", width: "100%", border: "1px solid #ddd", borderRadius: "6px", fontSize: '15px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Origin of the Stone</label>
                                <input
                                    type="text"
                                    name="origin"
                                    value={formData.origin}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Madagascar / Brazil / India"
                                    style={{ padding: "11px", width: "100%", border: "1px solid #ddd", borderRadius: "6px", fontSize: '15px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Starting Price (₹ / sq. ft.)</label>
                                <input
                                    type="number"
                                    name="startingPrice"
                                    value={formData.startingPrice}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 1800"
                                    style={{ padding: "11px", width: "100%", border: "1px solid #ddd", borderRadius: "6px", fontSize: '15px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Maximum Price (₹ / sq. ft.)</label>
                                <input
                                    type="number"
                                    name="maximumPrice"
                                    value={formData.maximumPrice}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 4500"
                                    style={{ padding: "11px", width: "100%", border: "1px solid #ddd", borderRadius: "6px", fontSize: '15px' }}
                                />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#111' }}>
                                    Primary Color / Shade *
                                </label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                                    {[...DEFAULT_STONE_COLORS, ...customColors].map(cObj => {
                                        const isSelected = formData.color === cObj.name;
                                        return (
                                            <button
                                                key={cObj.name}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, color: cObj.name }))}
                                                title={cObj.name}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '4px 12px 4px 5px',
                                                    borderRadius: '20px',
                                                    border: isSelected ? '2px solid #b48e5d' : '1px solid #ddd',
                                                    backgroundColor: isSelected ? '#fffcf0' : '#fff',
                                                    cursor: 'pointer',
                                                    fontSize: '13px',
                                                    fontWeight: isSelected ? '700' : '500',
                                                    color: '#222',
                                                    transition: 'all 0.2s',
                                                    boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.12)' : 'none'
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        width: '22px',
                                                        height: '22px',
                                                        borderRadius: '50%',
                                                        background: cObj.hex,
                                                        border: cObj.border ? `1px solid ${cObj.border}` : '1px solid rgba(0,0,0,0.1)',
                                                        display: 'inline-block'
                                                    }}
                                                />
                                                {cObj.name}
                                            </button>
                                        );
                                    })}

                                    {!showAddColor ? (
                                        <button
                                            type="button"
                                            onClick={() => setShowAddColor(true)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '6px 14px',
                                                borderRadius: '20px',
                                                border: '1px dashed #999',
                                                backgroundColor: '#fafafa',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                color: '#444'
                                            }}
                                        >
                                            + Add Color
                                        </button>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f9f9f9', padding: '4px 8px', borderRadius: '20px', border: '1px solid #ccc' }}>
                                            <input
                                                type="text"
                                                value={newColorName}
                                                onChange={(e) => setNewColorName(e.target.value)}
                                                placeholder="Custom color..."
                                                style={{ padding: '4px 8px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '13px', width: '110px' }}
                                            />
                                            <input
                                                type="color"
                                                value={newColorHex}
                                                onChange={(e) => setNewColorHex(e.target.value)}
                                                style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'pointer' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (newColorName.trim()) {
                                                        const createdColor = { name: newColorName.trim(), hex: newColorHex };
                                                        setCustomColors(prev => [...prev, createdColor]);
                                                        setFormData(prev => ({ ...prev, color: newColorName.trim() }));
                                                        setNewColorName('');
                                                        setShowAddColor(false);
                                                    }
                                                }}
                                                style={{ padding: '4px 10px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                            >
                                                Add
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddColor(false)}
                                                style={{ padding: '4px 8px', backgroundColor: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Description & Architectural Details</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Describe translucid backlit patterns, mineral origin, and luxury bespoke applications..."
                                style={{ padding: "12px", width: "100%", border: "1px solid #ddd", borderRadius: "6px", fontSize: '15px' }}
                            />
                        </div>

                        {/* IMAGE UPLOAD */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                Product Images (Max 3) *
                            </label>
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                {formData.images.map((img, index) => (
                                    <div key={index} style={{ position: 'relative', width: '110px', height: '110px', border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
                                        <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer' }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                {formData.images.length < 3 && (
                                    <div 
                                        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                                        style={{
                                            padding: "25px",
                                            border: `2px dashed ${dragActive ? '#d4af37' : '#ccc'}`,
                                            borderRadius: "8px",
                                            textAlign: "center",
                                            backgroundColor: dragActive ? "#fefcf4" : "#fafafa",
                                            cursor: "pointer",
                                            position: "relative",
                                            width: "100%"
                                        }}
                                    >
                                        <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
                                            Drag & drop up to {3 - formData.images.length} image(s) here, or click to browse
                                        </p>
                                        <input type="file" accept="image/*" multiple onChange={handleChangeFiles} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                            <button
                                type="submit"
                                style={{
                                    padding: '14px 28px',
                                    backgroundColor: '#b48e5d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                    cursor: 'pointer'
                                }}
                            >
                                {editingId ? 'Save Changes' : 'Publish Royal Gem Stone'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowForm(false); setEditingId(null); }}
                                style={{
                                    padding: '14px 28px',
                                    backgroundColor: '#f1f1f1',
                                    color: '#333',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}

            {/* PRODUCT CARDS LIST */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, fontSize: '20px', color: '#111' }}>
                        Published Royal Gem Stones ({filteredProducts.length})
                    </h2>
                    <input
                        type="text"
                        placeholder="Search royal gem stones..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '10px 16px', border: '1px solid #ddd', borderRadius: '20px', width: '260px', fontSize: '14px' }}
                    />
                </div>

                {filteredProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f9f9f9', borderRadius: '8px', color: '#666' }}>
                        <p style={{ margin: '0 0 16px 0', fontSize: '16px' }}>No Royal Gem Stones found.</p>
                        <button
                            onClick={() => { setFormData(initialFormState); setShowForm(true); }}
                            style={{ padding: '10px 20px', backgroundColor: '#b48e5d', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            + Create First Royal Gem Stone
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {filteredProducts.map(product => {
                            const isRoyal = true;
                            return (
                                <div key={product.id || product._id} style={{ display: 'flex', backgroundColor: '#fff', border: '1px solid #e8dec8', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                    <div style={{ width: '180px', height: '180px', backgroundColor: '#f5f5f5', flexShrink: 0, position: 'relative' }}>
                                        {((product.images && product.images[0]) || product.image) ? (
                                            <img src={(product.images && product.images[0]) || product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ color: '#aaa' }}>No Image</span>
                                        )}
                                        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                                            <span style={{ background: 'linear-gradient(135deg, #d4af37, #b89728)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                                                ★ ROYAL GEMSTONE
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#111' }}>{product.name}</h3>
                                        {product.variety && (
                                            <div style={{ fontSize: '13px', color: '#b48e5d', fontWeight: '600', marginBottom: '8px' }}>
                                                Variety: {product.variety}
                                            </div>
                                        )}
                                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px', flex: 1 }}>
                                            {product.color && <div style={{ marginBottom: '4px' }}><strong>Color:</strong> {product.color}</div>}
                                            {(product.startingPrice || product.maximumPrice || product.price) && (
                                                <div style={{ marginBottom: '4px', color: '#111', fontWeight: '600' }}>
                                                    <strong>Price Range:</strong> {product.startingPrice && product.maximumPrice ? `₹${product.startingPrice} - ₹${product.maximumPrice}` : (product.price || product.startingPrice || product.maximumPrice)} / sq. ft.
                                                </div>
                                            )}
                                            <div style={{ marginTop: '8px', padding: '8px', background: '#fffcf0', borderRadius: '6px', fontSize: '12px', color: '#7a5a2a', border: '1px solid #e8dec8' }}>
                                                <strong>Luxury Applications:</strong> {(product.interior || product.applications || []).slice(0, 3).join(' • ')}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                style={{ padding: '6px 14px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: '#333' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id || product._id)}
                                                style={{ padding: '6px 14px', backgroundColor: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: '#d32f2f' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
