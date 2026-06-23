import React, { useState, useEffect } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import './Admin.css';

const FINISH_ENUM = [
    'Polished', 'Honed', 'Leather', 'Flamed',
    'Lapato', 'Bush Hammered', 'Antique', 'Sandblasted'
];

const INTERIOR_OPTIONS = [
    'Flooring', 'Wall Cladding', 'Kitchen Countertops', 
    'Bathroom & Vanity', 'Staircase', 'Pooja Room & Temples', 'Table Tops & Furniture'
];

const EXTERIOR_OPTIONS = [
    'Elevation/Facade Cladding', 'Outdoor Flooring & Paving', 
    'Garden & Landscaping', 'Driveways & Pathways', 'Swimming Pool Areas'
];

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        color: '',
        finish: [],
        description: '',
        interior: [],
        exterior: [],
        images: []
    });

    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
            setProducts(res.data);
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
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleMultiSelect = (field, option) => {
        setFormData(prev => {
            const currentSelected = prev[field];
            if (currentSelected.includes(option)) {
                return { ...prev, [field]: currentSelected.filter(item => item !== option) };
            } else {
                return { ...prev, [field]: [...currentSelected, option] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            alert("Product Name is required.");
            return;
        }

        try {
            if (editingId) {
                await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${editingId}`, formData);
                alert("Product updated successfully!");
            } else {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, formData);
                alert("Product published successfully!");
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', color: '', finish: [], description: '', interior: [], exterior: [], images: [] });
            fetchProducts();
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product.");
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name || '',
            color: product.color || '',
            finish: product.finish || [],
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

    const filteredProducts = products.filter(p => 
        (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (p.color && p.color.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Manage Products</h1>
                <button 
                    onClick={() => {
                        setShowForm(!showForm);
                        if (showForm) {
                            setEditingId(null);
                            setFormData({ name: '', color: '', finish: [], description: '', interior: [], exterior: [], images: [] });
                        }
                    }}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: showForm ? '#ff4444' : '#111',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {showForm ? 'Cancel' : 'Add New Product'}
                </button>
            </div>

            {showForm && (
                <div className="admin-form-container">
                    <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>{editingId ? 'Edit Product' : 'Create Product'}</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        
                        <div className="admin-form-grid">
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ padding: "10px", width: "100%", border: "1px solid #ddd", borderRadius: "4px" }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Color</label>
                                <input type="text" name="color" value={formData.color} onChange={handleInputChange} style={{ padding: "10px", width: "100%", border: "1px solid #ddd", borderRadius: "4px" }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Finish</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {FINISH_ENUM.map(opt => (
                                    <span 
                                        key={opt}
                                        onClick={() => toggleMultiSelect('finish', opt)}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            backgroundColor: formData.finish.includes(opt) ? '#111' : '#f0f0f0',
                                            color: formData.finish.includes(opt) ? '#fff' : '#333',
                                            border: '1px solid',
                                            borderColor: formData.finish.includes(opt) ? '#111' : '#ddd',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {opt}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Interior Applications</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {INTERIOR_OPTIONS.map(opt => (
                                    <span 
                                        key={opt}
                                        onClick={() => toggleMultiSelect('interior', opt)}
                                        style={{
                                            padding: '6px 12px',
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
                                            padding: '6px 12px',
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

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Images (Up to 3)</label>
                            
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
                                {formData.images.map((img, idx) => (
                                    <div key={idx} style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                        <img src={img} alt={`Product ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button 
                                            type="button" 
                                            onClick={() => removeImage(idx)}
                                            style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px' }}
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
                                        padding: "30px", border: `2px dashed ${dragActive ? "#111" : "#ccc"}`, borderRadius: "4px",
                                        textAlign: "center", backgroundColor: dragActive ? "#f0f0f0" : "#fafafa", cursor: "pointer",
                                        position: "relative"
                                    }}
                                >
                                    <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>Drag & drop up to {3 - formData.images.length} image(s) here, or click to browse</p>
                                    <input type="file" accept="image/*" multiple onChange={handleChangeFiles} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} style={{ padding: "10px", width: "100%", border: "1px solid #ddd", borderRadius: "4px" }} />
                        </div>
                        
                        <button type="submit" style={{ padding: "12px 20px", backgroundColor: "#111", color: "#fff", border: "none", cursor: "pointer", alignSelf: "flex-start", borderRadius: "4px", fontSize: '16px' }}>
                            {editingId ? "Update Product" : "Publish Product"}
                        </button>
                    </form>
                </div>
            )}

            <div style={{ marginBottom: '30px' }}>
                <input 
                    type="text" 
                    placeholder="Search products by name or color..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="admin-search-input"
                />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading products...</div>
            ) : filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '8px', color: '#666' }}>
                    No products found. Add a new product above!
                </div>
            ) : (
                <div className="admin-product-grid">
                    {filteredProducts.map(product => (
                        <div key={product.id || product._id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: '200px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {product.images && product.images.length > 0 ? (
                                    <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : product.image ? (
                                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ color: '#aaa' }}>No Image</span>
                                )}
                            </div>
                            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{product.name}</h3>
                                <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px', flex: 1 }}>
                                    {product.color && <div style={{ marginBottom: '4px' }}><strong>Color:</strong> {product.color}</div>}
                                    {(product.finish && product.finish.length > 0) && <div style={{ marginBottom: '4px' }}><strong>Finish:</strong> {product.finish.join(', ')}</div>}
                                    {(product.interior && product.interior.length > 0) && <div style={{ marginBottom: '4px', fontSize: '12px', color: '#888' }}>{product.interior.length} interior options</div>}
                                    {(product.exterior && product.exterior.length > 0) && <div style={{ marginBottom: '4px', fontSize: '12px', color: '#888' }}>{product.exterior.length} exterior options</div>}
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                    <button 
                                        onClick={() => handleEdit(product)}
                                        style={{ flex: 1, padding: '8px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s' }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(product.id || product._id)}
                                        style={{ flex: 1, padding: '8px', backgroundColor: '#fff', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s' }}
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
