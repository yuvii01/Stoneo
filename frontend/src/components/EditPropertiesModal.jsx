import React, { useState, useEffect } from 'react';

const FINISH_OPTIONS = [
    'Polished', 'Honed', 'Leather', 'Flamed',
    'Lapato', 'Bush Hammered', 'Antique', 'Sandblasted'
];

const APPLICATION_OPTIONS = [
    'Flooring', 'Wall Cladding', 'Kitchen Countertops',
    'Bathroom & Vanity', 'Staircase', 'Pooja Room & Temples',
    'Table Tops & Furniture', 'Elevation/Facade Cladding',
    'Outdoor Flooring & Paving', 'Garden & Landscaping',
    'Driveways & Pathways', 'Swimming Pool Areas'
];

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function EditPropertiesModal({ isOpen, onClose, product, onSaved }) {
    const [form, setForm] = useState({
        name: '',
        category: 'Granite',
        colorCategory: '',
        description: '',
        features: [],
        finish: '',
        color: '',
        thickness: '',
        slipResistance: '',
        priceRange: '',
        images: [],
        applications: []
    });
    const [featuresText, setFeaturesText] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || '',
                category: product.category || 'Granite',
                colorCategory: product.colorCategory || '',
                description: product.description || '',
                features: product.features || [],
                finish: product.finish || '',
                color: product.color || '',
                thickness: product.thickness || '',
                slipResistance: product.slipResistance || '',
                priceRange: product.priceRange || '',
                images: product.images || [],
                applications: product.applications || []
            });
            setFeaturesText((product.features || []).join(', '));
        }
    }, [product]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleApplicationToggle = (app) => {
        setForm(prev => {
            const apps = prev.applications.includes(app)
                ? prev.applications.filter(a => a !== app)
                : [...prev.applications, app];
            return { ...prev, applications: apps };
        });
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (form.images.length + files.length > 3) {
            setError('Maximum 3 images allowed.');
            return;
        }
        setError('');

        const newImages = [];
        for (const file of files) {
            const reader = new FileReader();
            const base64 = await new Promise((resolve) => {
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
            newImages.push(base64);
        }
        setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    };

    const removeImage = (index) => {
        setForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            setError('Product name is required.');
            return;
        }
        setSaving(true);
        setError('');

        const payload = {
            ...form,
            features: featuresText.split(',').map(f => f.trim()).filter(Boolean)
        };

        try {
            const isUpdate = product && product.id;
            const url = isUpdate
                ? `${BACKEND_URL}/api/products/${product.id}`
                : `${BACKEND_URL}/api/products`;
            const method = isUpdate ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to save');
            }

            const saved = await res.json();
            if (onSaved) onSaved(saved);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!product || !product.id) return;
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        setSaving(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/products/${product.id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Failed to delete');
            if (onSaved) onSaved(null);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const overlayStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px'
    };

    const modalStyle = {
        backgroundColor: '#fff', borderRadius: '16px', width: '100%',
        maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto',
        padding: '40px', fontFamily: "'Jost', sans-serif",
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    };

    const labelStyle = {
        display: 'block', fontSize: '13px', fontWeight: 600,
        color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em',
        marginBottom: '6px'
    };

    const inputStyle = {
        width: '100%', padding: '10px 14px', fontSize: '15px',
        border: '1px solid #ddd', borderRadius: '8px', outline: 'none',
        transition: 'border-color 0.2s', boxSizing: 'border-box'
    };

    const selectStyle = { ...inputStyle, cursor: 'pointer', backgroundColor: '#fff' };

    const fieldGroup = { marginBottom: '20px' };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 400, color: '#111' }}>
                        {product && product.id ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#999', lineHeight: 1 }}>×</button>
                </div>

                {error && (
                    <div style={{ padding: '12px 16px', backgroundColor: '#fee', color: '#c33', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                {/* Name */}
                <div style={fieldGroup}>
                    <label style={labelStyle}>Product Name *</label>
                    <input style={inputStyle} value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Absolute Black Granite" />
                </div>

                {/* Category & Color Category */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', ...fieldGroup }}>
                    <div>
                        <label style={labelStyle}>Category *</label>
                        <select style={selectStyle} value={form.category} onChange={e => handleChange('category', e.target.value)}>
                            <option value="Granite">Granite</option>
                            <option value="Imported Marble">Imported Marble</option>
                            <option value="Indian Marble">Indian Marble</option>
                            <option value="Sandstone">Sandstone</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Color Category</label>
                        <input style={inputStyle} value={form.colorCategory} onChange={e => handleChange('colorCategory', e.target.value)} placeholder="e.g. Black, White, Blue" />
                    </div>
                </div>

                {/* Finish & Thickness */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', ...fieldGroup }}>
                    <div>
                        <label style={labelStyle}>Finish</label>
                        <select style={selectStyle} value={form.finish} onChange={e => handleChange('finish', e.target.value)}>
                            <option value="">Select Finish</option>
                            {FINISH_OPTIONS.map(f => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Thickness</label>
                        <input style={inputStyle} value={form.thickness} onChange={e => handleChange('thickness', e.target.value)} placeholder="e.g. 18mm, 20mm" />
                    </div>
                </div>

                {/* Color & Slip Resistance */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', ...fieldGroup }}>
                    <div>
                        <label style={labelStyle}>Color</label>
                        <input style={inputStyle} value={form.color} onChange={e => handleChange('color', e.target.value)} placeholder="e.g. Jet Black" />
                    </div>
                    <div>
                        <label style={labelStyle}>Slip Resistance</label>
                        <input style={inputStyle} value={form.slipResistance} onChange={e => handleChange('slipResistance', e.target.value)} placeholder="e.g. R9, R10, R11" />
                    </div>
                </div>

                {/* Price Range */}
                <div style={fieldGroup}>
                    <label style={labelStyle}>Price Range</label>
                    <input style={inputStyle} value={form.priceRange} onChange={e => handleChange('priceRange', e.target.value)} placeholder="e.g. ₹80-120/sqft" />
                </div>

                {/* Description */}
                <div style={fieldGroup}>
                    <label style={labelStyle}>Description</label>
                    <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="Product description..." />
                </div>

                {/* Features */}
                <div style={fieldGroup}>
                    <label style={labelStyle}>Features (comma-separated)</label>
                    <input style={inputStyle} value={featuresText} onChange={e => setFeaturesText(e.target.value)} placeholder="e.g. Scratch resistant, Easy to maintain" />
                </div>

                {/* Applications */}
                <div style={fieldGroup}>
                    <label style={labelStyle}>Applications</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                        {APPLICATION_OPTIONS.map(app => (
                            <button
                                key={app}
                                type="button"
                                onClick={() => handleApplicationToggle(app)}
                                style={{
                                    padding: '6px 14px', fontSize: '13px', borderRadius: '20px', cursor: 'pointer',
                                    border: form.applications.includes(app) ? '2px solid #a45040' : '1px solid #ddd',
                                    backgroundColor: form.applications.includes(app) ? '#a45040' : '#fff',
                                    color: form.applications.includes(app) ? '#fff' : '#555',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {app}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Images */}
                <div style={fieldGroup}>
                    <label style={labelStyle}>Images (max 3)</label>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {form.images.map((img, i) => (
                            <div key={i} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                <img src={img} alt={`Product ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button
                                    onClick={() => removeImage(i)}
                                    style={{ position: 'absolute', top: '4px', right: '4px', width: '22px', height: '22px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                                >×</button>
                            </div>
                        ))}
                        {form.images.length < 3 && (
                            <label style={{ width: '100px', height: '100px', borderRadius: '10px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#aaa', fontSize: '30px', transition: 'border-color 0.2s' }}>
                                +
                                <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
                            </label>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '30px', justifyContent: 'flex-end' }}>
                    {product && product.id && (
                        <button onClick={handleDelete} disabled={saving} style={{ padding: '12px 24px', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
                            Delete
                        </button>
                    )}
                    <button onClick={onClose} style={{ padding: '12px 24px', backgroundColor: '#f5f5f5', color: '#555', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving} style={{ padding: '12px 24px', backgroundColor: '#a45040', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                        {saving ? 'Saving...' : (product && product.id ? 'Update' : 'Create')}
                    </button>
                </div>
            </div>
        </div>
    );
}
