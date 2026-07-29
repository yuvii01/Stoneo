import { useState, useEffect } from 'react';
import axios from 'axios';

const parsePrice = (val, fallback = 100) => {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (!val) return fallback;
  const matches = String(val).match(/\d+(\.\d+)?/g);
  if (matches && matches.length > 0) {
    const parsed = parseFloat(matches[0]);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

export function useDbProducts(categoryName) {
  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const url = (!categoryName || categoryName === 'All' || categoryName === 'all')
      ? `${import.meta.env.VITE_BACKEND_URL}/api/products`
      : `${import.meta.env.VITE_BACKEND_URL}/api/products?category=${encodeURIComponent(categoryName)}`;

    axios.get(url)
      .then(res => {
        if (!isMounted) return;
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const sortedData = [...res.data].sort((a, b) => {
            const orderA = (a && typeof a.sortOrder === 'number' && !isNaN(a.sortOrder)) ? a.sortOrder : 0;
            const orderB = (b && typeof b.sortOrder === 'number' && !isNaN(b.sortOrder)) ? b.sortOrder : 0;
            if (orderA !== orderB) return orderA - orderB;
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            if (timeA !== timeB) return timeB - timeA;
            const idA = String(a._id || a.id || '');
            const idB = String(b._id || b.id || '');
            return idA.localeCompare(idB);
          });

          const mapped = sortedData.map((p, idx) => {
            const parsedPrice = parsePrice(p.startingPrice || p.price || p.estimatedPrice, 100);
            const minP = p.startingPrice ? parsePrice(p.startingPrice, Math.max(50, parsedPrice - 40)) : Math.max(50, parsedPrice - 40);
            const maxP = p.maximumPrice ? parsePrice(p.maximumPrice, Math.min(500, parsedPrice + 40)) : Math.min(500, parsedPrice + 40);

            return {
              id: p.id || p._id || `db-${idx}`,
              sortOrder: typeof p.sortOrder === 'number' && !isNaN(p.sortOrder) ? p.sortOrder : idx,
              name: p.name || 'Product',
              image: (p.images && p.images.length > 0) ? p.images[0] : (p.image || ''),
              images: p.images || (p.image ? [p.image] : []),
              color: p.color || '',
              colorCategory: p.colorCategory || p.color || '',
              variety: p.variety || p.gemstoneVariety || '',
              isRoyalGemStone: p.isRoyalGemStone || p.category === 'Royal Gemstone',
              category: p.color || p.colorCategory || p.category || 'Standard',
              stoneCategory: p.category || categoryName || '',
              material: p.category || categoryName || '',
              price: parsedPrice,
              pricePerSqft: parsedPrice,
              minPrice: minP,
              maxPrice: maxP,
              origin: p.origin || 'India',
              touch: Array.isArray(p.finish) && p.finish.length > 0 ? p.finish : ['Polished'],
              finish: Array.isArray(p.finish) && p.finish.length > 0 ? p.finish : ['Polished'],
              thickness: Array.isArray(p.thickness) && p.thickness.length > 0 ? p.thickness : [18, 20],
              description: p.description || 'Premium architectural stone surface.',
              features: Array.isArray(p.features) && p.features.length > 0 ? p.features : ['Durable', 'Scratch resistant', 'Easy to maintain'],
              interior: p.interior || [],
              exterior: p.exterior || []
            };
          });
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

  return dbProducts;
}

