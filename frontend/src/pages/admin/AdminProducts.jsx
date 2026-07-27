import React, { useState, useEffect } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import './Admin.css';

const FINISH_ENUM = [
    'Polished', 'Honed', 'Leather', 'Flamed',
    'Lapato', 'Bush Hammered', 'Antique', 'Sandblasted',
    'High Gloss', 'Resin Encapsulated'
];

const INTERIOR_OPTIONS = [
    'Flooring', 'Wall Cladding', 'Kitchen Countertops', 
    'Bathroom & Vanity', 'Staircase', 'Pooja Room & Temples', 'Table Tops & Furniture'
];

const EXTERIOR_OPTIONS = [
    'Elevation/Facade Cladding', 'Outdoor Flooring & Paving', 
    'Garden & Landscaping', 'Driveways & Pathways', 'Swimming Pool Areas'
];

const STONE_CATEGORIES = [
    'Granite', 'Marble', 'Sandstone', 'Other Natural Stones', 'Quartz', 'Onyx', 'Paving and Landscape'
];

const STONE_VARIETIES_MAP = {
    'Granite': [
        'North Indian Granite', 'South Indian Granite', 'Imported Granite', 'Alaska Granite'
    ],
    'Marble': [
        'Makrana white', 'Katni', 'Ambaji', 'Rajnagar', 'Udaipur green', 'Kishangarh', 'Jaisalmer Yellow',
        'Italian', 'Spanish', 'Vietnamese', 'Turkish', 'Greece'
    ],
    'Sandstone': [
        'Kota Stone', 'Agra Sandstone', 'Raj Green Sandstone', 'Teakwood Sandstone', 'Dholpur Sandstone'
    ],
    'Other Natural Stones': [
        'Quartzite', 'Limestone', 'Slate Stone', 'Basalt', 'Kota Stone', 'Travertine'
    ],
    'Quartz': [
        'Calacatta', 'Sparkling', 'Solid Color'
    ],
    'Onyx': [
        'Exotic', 'White', 'Solid Color'
    ],
    'Paving and Landscape': [
        'Granite Cobbles', 'Sandstone Cobbles', 'Limestone Cobbles',
        'Bricks', 'Sandstone', 'Travertino', 'Granite Pavers', 'Marble Pavers',
        'landscaping pebbles', 'Stepping stones'
    ]
};

const DEFAULT_STONE_COLORS = [
    { name: 'Black', hex: '#1a1a1a' },
    { name: 'White', hex: '#f8f9fa', border: '#ddd' },
    { name: 'Grey', hex: '#7f8c8d' },
    { name: 'Brown', hex: '#795548' },
    { name: 'Beige', hex: '#d7ccc8' },
    { name: 'Gold', hex: '#d4af37' },
    { name: 'Cream', hex: '#fffdd0', border: '#ddd' },
    { name: 'Red', hex: '#c0392b' },
    { name: 'Green', hex: '#27ae60' },
    { name: 'Blue', hex: '#2980b9' },
    { name: 'Pink', hex: '#fd79a8' },
    { name: 'Yellow', hex: '#f1c40f' },
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
    category: 'Granite',
    categories: ['North Indian Granite'],
    variety: 'North Indian Granite',
    finish: ['Polished'],
    description: '',
    interior: [],
    exterior: [],
    images: []
};

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [originFilter, setOriginFilter] = useState('All');
    const [colorFilter, setColorFilter] = useState('All');
    const [finishFilter, setFinishFilter] = useState('All');
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
            const standardProducts = (res.data || []).filter(p => !p.isRoyalGemStone && p.category !== 'Royal Gemstone');
            setProducts(standardProducts);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
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
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleChangeFiles = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleFiles = async (files) => {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length === 0) {
            alert("Please provide valid image files.");
            return;
        }

        if (formData.images.length + imageFiles.length > 3) {
            alert("You can only upload up to 3 images per product.");
            return;
        }

        try {
            const options = { maxSizeMB: 0.15, maxWidthOrHeight: 1920, useWebWorker: true };
            const newImages = [...formData.images];

            for (const file of imageFiles) {
                const compressedFile = await imageCompression(file, options);
                const reader = new FileReader();
                await new Promise((resolve, reject) => {
                    reader.onload = () => {
                        newImages.push(reader.result);
                        resolve();
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(compressedFile);
                });
            }

            setFormData(prev => ({ ...prev, images: newImages }));
        } catch (error) {
            console.error("Error compressing images:", error);
            alert("Error processing images");
        }
    };

    const removeImage = (index) => {
        setFormData(prev => {
            const newImages = [...prev.images];
            newImages.splice(index, 1);
            return { ...prev, images: newImages };
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'category') {
            const firstVariety = (STONE_VARIETIES_MAP[value] && STONE_VARIETIES_MAP[value][0]) || value;
            setFormData(prev => ({ ...prev, category: value, categories: [firstVariety], variety: firstVariety }));
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
        } else if (name === 'estimatedPrice' || name === 'price') {
            setFormData(prev => ({ ...prev, estimatedPrice: value, price: value }));
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
            if (field === 'categories') {
                return { ...prev, categories: updated, variety: updated.join(', ') || option };
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
            isRoyalGemStone: false,
            variety: Array.isArray(formData.categories) ? formData.categories.join(', ') : (formData.variety || ''),
            categories: formData.categories,
            origin: formData.origin || '',
            startingPrice: formData.startingPrice || '',
            maximumPrice: formData.maximumPrice || '',
            estimatedPrice: formData.estimatedPrice || formData.price || '',
            price: formData.price || formData.estimatedPrice || ''
        };

        try {
            if (editingId) {
                await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${editingId}`, payload);
                alert("Product updated successfully!");
            } else {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, payload);
                alert("Product published successfully!");
            }
            setShowForm(false);
            setEditingId(null);
            setFormData(initialFormState);
            fetchProducts();
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product.");
        }
    };

    const handleEdit = (product) => {
        const loadedCategories = Array.isArray(product.categories) && product.categories.length > 0
            ? product.categories
            : (product.variety ? (typeof product.variety === 'string' ? product.variety.split(', ').map(s => s.trim()) : (Array.isArray(product.variety) ? product.variety : [product.variety])) : [(STONE_VARIETIES_MAP[product.category] ? STONE_VARIETIES_MAP[product.category][0] : '')]);

        setFormData({
            name: product.name || '',
            color: product.color || '',
            origin: product.origin || '',
            startingPrice: product.startingPrice || '',
            maximumPrice: product.maximumPrice || '',
            estimatedPrice: product.estimatedPrice || product.price || '',
            price: product.price || product.estimatedPrice || '',
            category: product.category || 'Granite',
            categories: loadedCategories,
            variety: product.variety || loadedCategories.join(', '),
            finish: product.finish || ['Polished'],
            description: product.description || '',
            interior: product.interior || [],
            exterior: product.exterior || [],
            images: product.images || (product.image ? [product.image] : [])
        });
        setEditingId(product.id || product._id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
            alert("Product deleted!");
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product.");
        }
    };

    const moveProductStep = async (index, direction) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= products.length) return;
        const updated = [...products];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;
        setProducts(updated);
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/reorder`, {
                products: updated.map((p, idx) => ({ id: p.id || p._id, sortOrder: idx }))
            });
        } catch (error) {
            console.error("Error saving reorder:", error);
        }
    };

    const moveProductToTarget = async (productId, targetId) => {
        if (!targetId || productId === targetId) return;
        const currentIndex = products.findIndex(p => (p.id || p._id) === productId);
        const targetIndex = products.findIndex(p => (p.id || p._id) === targetId);
        if (currentIndex === -1 || targetIndex === -1) return;
        const updated = [...products];
        const [movedItem] = updated.splice(currentIndex, 1);
        const newTargetIndex = updated.findIndex(p => (p.id || p._id) === targetId);
        updated.splice(newTargetIndex, 0, movedItem);
        setProducts(updated);
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/reorder`, {
                products: updated.map((p, idx) => ({ id: p.id || p._id, sortOrder: idx }))
            });
        } catch (error) {
            console.error("Error saving reorder:", error);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = !searchQuery ||
            (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.color && p.color.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.variety && p.variety.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.origin && p.origin.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesOrigin = originFilter === 'All' || (p.origin && p.origin.toLowerCase().includes(originFilter.toLowerCase()));
        const matchesColor = colorFilter === 'All' || (p.color && p.color.toLowerCase().includes(colorFilter.toLowerCase())) || (p.colorCategory && p.colorCategory.toLowerCase().includes(colorFilter.toLowerCase()));
        const matchesFinish = finishFilter === 'All' || (p.finish && Array.isArray(p.finish) && p.finish.some(f => f.toLowerCase().includes(finishFilter.toLowerCase())));

        return matchesSearch && matchesCat && matchesOrigin && matchesColor && matchesFinish;
    });

    return (
        <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '10px 15px 60px' }}>
            <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 className="admin-page-title" style={{ margin: 0 }}>Manage Products</h1>
                    <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
                        Create and manage Natural Stones and Engineered Surfaces
                    </p>
                </div>
                <button 
                    onClick={() => {
                        const nextState = !showForm;
                        setShowForm(nextState);
                        if (nextState) {
                            setEditingId(null);
                            setFormData(initialFormState);
                        }
                    }}
                    style={{
                        padding: '11px 22px',
                        backgroundColor: showForm ? '#ff4444' : '#111',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '15px'
                    }}
                >
                    {showForm ? '✕ Cancel' : '+ Add New Product'}
                </button>
            </div>

            {showForm && (
                <div className="admin-form-container" style={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    padding: '25px',
                    marginBottom: '35px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '22px', color: '#111' }}>
                        {editingId ? 'Edit Product Details' : 'Create Natural or Engineered Stone Product'}
                    </h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                        
                        {/* 1. VARIETY & CATEGORY SECTION */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#111' }}>
                                    Stone Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    style={{ padding: '11px', width: '100%', border: '1px solid #ccc', borderRadius: '6px', fontSize: '15px', backgroundColor: '#fff' }}
                                >
                                    {STONE_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#111' }}>
                                    Stone Categories / Varieties (Multi-Select) *
                                </label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', backgroundColor: '#fff' }}>
                                    {(STONE_VARIETIES_MAP[formData.category] || []).map(varItem => {
                                        const isSelected = (formData.categories || []).includes(varItem);
                                        return (
                                            <button
                                                key={varItem}
                                                type="button"
                                                onClick={() => toggleMultiSelect('categories', varItem)}
                                                style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '20px',
                                                    border: isSelected ? '1.5px solid #111' : '1px solid #ddd',
                                                    backgroundColor: isSelected ? '#111' : '#f8f8f8',
                                                    color: isSelected ? '#fff' : '#333',
                                                    fontSize: '13px',
                                                    fontWeight: isSelected ? '700' : '500',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => {}} // Controlled via onClick
                                                    style={{ width: '14px', height: '14px', accentColor: '#111', cursor: 'pointer' }}
                                                />
                                                {varItem}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* 2. BASIC PRODUCT METADATA */}
                        <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Black Forest Indian Marble"
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
                                    placeholder="e.g. Kishangarh, Rajasthan / Carrara, Italy / Brazil"
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
                                    placeholder="e.g. 150"
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
                                    placeholder="e.g. 350"
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
                                                    border: isSelected ? '2px solid #111' : '1px solid #ddd',
                                                    backgroundColor: isSelected ? '#f0f4f8' : '#fff',
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

                                    {/* ADD COLOR FEATURE */}
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

                        {/* 3. FINISH OPTIONS */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Finish Options</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {FINISH_ENUM.map(opt => (
                                    <span 
                                        key={opt}
                                        onClick={() => toggleMultiSelect('finish', opt)}
                                        style={{
                                            padding: '7px 14px',
                                            borderRadius: '20px',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            backgroundColor: formData.finish.includes(opt) ? '#111' : '#f0f0f0',
                                            color: formData.finish.includes(opt) ? '#fff' : '#333',
                                            border: '1px solid',
                                            borderColor: formData.finish.includes(opt) ? '#111' : '#ddd',
                                            fontWeight: formData.finish.includes(opt) ? '600' : '400',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {opt}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 4. STANDARD APPLICATIONS */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Interior Applications</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {INTERIOR_OPTIONS.map(opt => (
                                    <span 
                                        key={opt}
                                        onClick={() => toggleMultiSelect('interior', opt)}
                                        style={{
                                            padding: '7px 14px',
                                            borderRadius: '20px',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            backgroundColor: formData.interior.includes(opt) ? '#111' : '#f0f0f0',
                                            color: formData.interior.includes(opt) ? '#fff' : '#333',
                                            border: '1px solid',
                                            borderColor: formData.interior.includes(opt) ? '#111' : '#ddd',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {opt}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Exterior Applications</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {EXTERIOR_OPTIONS.map(opt => (
                                    <span 
                                        key={opt}
                                        onClick={() => toggleMultiSelect('exterior', opt)}
                                        style={{
                                            padding: '7px 14px',
                                            borderRadius: '20px',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            backgroundColor: formData.exterior.includes(opt) ? '#111' : '#f0f0f0',
                                            color: formData.exterior.includes(opt) ? '#fff' : '#333',
                                            border: '1px solid',
                                            borderColor: formData.exterior.includes(opt) ? '#111' : '#ddd',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {opt}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 5. IMAGE UPLOADS */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                Product Images (Up to 3)
                            </label>
                            
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
                                {formData.images.map((img, idx) => (
                                    <div key={idx} style={{ position: 'relative', width: '130px', height: '130px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #ddd' }}>
                                        <img src={img} alt={`Product ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button 
                                            type="button" 
                                            onClick={() => removeImage(idx)}
                                            style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(255,0,0,0.85)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {formData.images.length < 3 && (
                                <div 
                                    onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                                    style={{
                                        padding: "35px",
                                        border: `2px dashed ${dragActive ? '#111' : '#ccc'}`,
                                        borderRadius: "8px",
                                        textAlign: "center",
                                        backgroundColor: dragActive ? "#fefcf4" : "#fafafa",
                                        cursor: "pointer",
                                        position: "relative"
                                    }}
                                >
                                    <p style={{ margin: "0", color: "#666", fontSize: "15px" }}>
                                        Drag & drop up to {3 - formData.images.length} image(s) here, or click to browse
                                    </p>
                                    <input type="file" accept="image/*" multiple onChange={handleChangeFiles} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
                                </div>
                            )}
                        </div>

                        {/* 6. DESCRIPTION */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Description & Architectural Details</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Describe texture, quarry origin, application best practices, and durability features..."
                                style={{ padding: "12px", width: "100%", border: "1px solid #ddd", borderRadius: "6px", fontSize: '15px' }}
                            />
                        </div>
                        
                        <button
                            type="submit"
                            style={{
                                padding: "14px 28px",
                                background: '#111',
                                color: "#fff",
                                border: "none",
                                cursor: "pointer",
                                alignSelf: "flex-start",
                                borderRadius: "6px",
                                fontSize: '16px',
                                fontWeight: '700',
                                transition: 'all 0.2s'
                            }}
                        >
                            {editingId ? "Update Product" : "Publish Product"}
                        </button>
                    </form>
                </div>
            )}

            {/* Category Buttons & Filters */}
            <div style={{ marginBottom: '25px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {['All', 'Granite', 'Marble', 'Sandstone', 'Other Natural Stones', 'Quartz', 'Onyx', 'Paving and Landscape'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                padding: '9px 18px',
                                borderRadius: '25px',
                                border: 'none',
                                background: selectedCategory === cat ? '#111' : '#f0f0f0',
                                color: selectedCategory === cat ? '#fff' : '#333',
                                fontWeight: '600',
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {cat === 'All' ? 'All Products' : cat}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '10px', border: '1px solid #eaeaea' }}>
                    <div style={{ flex: '1 1 280px' }}>
                        <input
                            type="text"
                            placeholder="🔍 Search products by name, origin, color..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ padding: '10px 14px', fontSize: '14px', borderRadius: '6px', border: '1px solid #ddd', width: '100%' }}
                        />
                    </div>
                    <select
                        value={originFilter}
                        onChange={(e) => setOriginFilter(e.target.value)}
                        style={{ padding: '10px 14px', fontSize: '14px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff' }}
                    >
                        <option value="All">All Origins</option>
                        <option value="India">India / Indian</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="South India">South India</option>
                        <option value="Italy">Italy / Italian</option>
                        <option value="Imported">Imported</option>
                    </select>
                    <select
                        value={colorFilter}
                        onChange={(e) => setColorFilter(e.target.value)}
                        style={{ padding: '10px 14px', fontSize: '14px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff' }}
                    >
                        <option value="All">All Colors</option>
                        {['Black', 'White', 'Grey', 'Brown', 'Beige', 'Gold', 'Cream', 'Red', 'Green', 'Blue', 'Yellow', 'Multicolor'].map(col => (
                            <option key={col} value={col}>{col}</option>
                        ))}
                    </select>
                    <select
                        value={finishFilter}
                        onChange={(e) => setFinishFilter(e.target.value)}
                        style={{ padding: '10px 14px', fontSize: '14px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff' }}
                    >
                        <option value="All">All Finishes</option>
                        {FINISH_ENUM.map(fin => (
                            <option key={fin} value={fin}>{fin}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading products...</div>
            ) : filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '8px', color: '#666' }}>
                    No products found. Add a new product above!
                </div>
            ) : (
                <div className="admin-product-grid">
                    {filteredProducts.map((product, index) => (
                        <div
                            key={product.id || product._id}
                            style={{
                                border: '1px solid #eee',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                backgroundColor: '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div style={{ height: '210px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                                {product.images && product.images.length > 0 ? (
                                    <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : product.image ? (
                                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ color: '#aaa' }}>No Image</span>
                                )}

                                <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                                    <span style={{ backgroundColor: 'rgba(0,0,0,0.75)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                                        {product.category || 'Natural Stone'}
                                    </span>
                                </div>
                            </div>
                            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#111' }}>{product.name}</h3>
                                </div>

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
                                    {(product.finish && product.finish.length > 0) && <div style={{ marginBottom: '4px' }}><strong>Finish:</strong> {product.finish.join(', ')}</div>}
                                    {(product.interior && product.interior.length > 0) && <div style={{ marginBottom: '4px', fontSize: '12px', color: '#888' }}>{product.interior.length} interior options</div>}
                                    {(product.exterior && product.exterior.length > 0) && <div style={{ marginBottom: '4px', fontSize: '12px', color: '#888' }}>{product.exterior.length} exterior options</div>}
                                </div>

                                {/* Reorder Controls */}
                                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '6px 10px', borderRadius: '6px', border: '1px solid #eaeaea' }}>
                                    <button
                                        onClick={() => moveProductStep(index, -1)}
                                        disabled={index === 0}
                                        title="Move Up"
                                        style={{ padding: '4px 10px', border: '1px solid #ddd', borderRadius: '4px', background: '#fff', cursor: index === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onClick={() => moveProductStep(index, 1)}
                                        disabled={index === filteredProducts.length - 1}
                                        title="Move Down"
                                        style={{ padding: '4px 10px', border: '1px solid #ddd', borderRadius: '4px', background: '#fff', cursor: index === filteredProducts.length - 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                                    >
                                        ↓
                                    </button>
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                moveProductToTarget(product.id || product._id, e.target.value);
                                                e.target.value = "";
                                            }
                                        }}
                                        defaultValue=""
                                        style={{ flex: 1, padding: '5px 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #ddd', background: '#fff', color: '#333' }}
                                    >
                                        <option value="">⇄ Move next to product...</option>
                                        {products.map((p) => {
                                            const pId = p.id || p._id;
                                            if (pId === (product.id || product._id)) return null;
                                            return (
                                                <option key={pId} value={pId}>
                                                    Before: {p.name} ({p.category || 'Granite'})
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                        <button 
                                            onClick={() => handleEdit(product)}
                                            style={{ flex: 1, padding: '9px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: 'background 0.2s' }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(product.id || product._id)}
                                            style={{ flex: 1, padding: '9px', backgroundColor: '#fff', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: 'background 0.2s' }}
                                            onMouseEnter={(e) => { e.target.style.backgroundColor = '#ff4444'; e.target.style.color = '#fff'; }}
                                            onMouseLeave={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#ff4444'; }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
