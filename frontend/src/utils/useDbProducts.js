import { useState, useEffect } from 'react';
import axios from 'axios';

export function useDbProducts(categoryName, fallbackProducts = []) {
  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/products?category=${encodeURIComponent(categoryName)}`;

    axios.get(url)
      .then(res => {
        if (!isMounted) return;
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((p, idx) => ({
            id: p.id || p._id || `db-${idx}`,
            name: p.name || 'Product',
            image: (p.images && p.images.length > 0) ? p.images[0] : (p.image || ''),
            images: p.images || (p.image ? [p.image] : []),
            category: p.colorCategory || p.color || p.category || 'Standard',
            price: Number(p.price || p.estimatedPrice || 100),
            pricePerSqft: Number(p.price || p.estimatedPrice || 100),
            origin: p.origin || 'India',
            touch: Array.isArray(p.finish) && p.finish.length > 0 ? p.finish : ['Polished'],
            thickness: Array.isArray(p.thickness) && p.thickness.length > 0 ? p.thickness : [18, 20],
            description: p.description || 'Premium architectural stone surface.',
            features: Array.isArray(p.features) && p.features.length > 0 ? p.features : ['Durable', 'Scratch resistant', 'Easy to maintain']
          }));
          setDbProducts(mapped);
        }
      })
      .catch(e => {
        console.error(`Failed to fetch database products for ${categoryName}:`, e);
      });

    return () => {
      isMounted = false;
    };
  }, [categoryName]);

  return dbProducts.length > 0 ? dbProducts : fallbackProducts;
}
