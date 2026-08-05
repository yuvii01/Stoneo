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

export function useDbProducts(categoryName, fallbackData = []) {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const url = (!categoryName || categoryName === 'All' || categoryName === 'all')
      ? `${import.meta.env.VITE_BACKEND_URL}/api/products/list`
      : `${import.meta.env.VITE_BACKEND_URL}/api/products/list?category=${encodeURIComponent(categoryName)}`;

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

          const getImageUrl = (imgUrl) => {
            if (!imgUrl) return '';
            if (imgUrl.startsWith('http') || imgUrl.startsWith('data:')) return imgUrl;
            return `${import.meta.env.VITE_BACKEND_URL}${imgUrl}`;
          };

          const mapped = sortedData.map((p, idx) => {
            const parsedPrice = parsePrice(p.startingPrice || p.price || p.estimatedPrice, 100);
            const minP = p.startingPrice ? parsePrice(p.startingPrice, Math.max(50, parsedPrice - 40)) : Math.max(50, parsedPrice - 40);
            const maxP = p.maximumPrice ? parsePrice(p.maximumPrice, Math.min(500, parsedPrice + 40)) : Math.min(500, parsedPrice + 40);

            const thumbUrl = p.thumbnail 
              ? getImageUrl(p.thumbnail)
              : ((p.images && p.images.length > 0) ? p.images[0] : (p.image || ''));

            let inferredType = p.type || p.variety || '';
            const lowerName = (p.name || '').toLowerCase();
            if (!inferredType) {
              if (categoryName === 'Quartz') {
                if (lowerName.includes('calacatta')) inferredType = 'Calacatta';
                else if (lowerName.includes('sparkling')) inferredType = 'Sparkling';
                else inferredType = 'Solid Color';
              } else if (categoryName === 'Onyx') {
                if (lowerName.includes('exotic')) inferredType = 'Exotic';
                else if (lowerName.includes('white')) inferredType = 'White';
                else inferredType = 'Solid Color';
              } else if (categoryName === 'Sandstone') {
                if (lowerName.includes('kota')) inferredType = 'Kota Stone';
                else if (lowerName.includes('agra')) inferredType = 'Agra Sandstone';
                else if (lowerName.includes('raj green')) inferredType = 'Raj Green Sandstone';
                else if (lowerName.includes('teak')) inferredType = 'Teakwood Sandstone';
                else if (lowerName.includes('dholpur')) inferredType = 'Dholpur Sandstone';
                else if (lowerName.includes('kandla')) inferredType = 'Kandla Grey';
                else inferredType = 'Agra Sandstone';
              } else if (categoryName === 'Other Natural Stones') {
                if (lowerName.includes('slate')) inferredType = 'Slate Stone';
                else if (lowerName.includes('limestone')) inferredType = 'Limestone';
                else if (lowerName.includes('basalt')) inferredType = 'Basalt';
                else if (lowerName.includes('quartzite')) inferredType = 'Quartzite';
                else if (lowerName.includes('travertine')) inferredType = 'Travertine';
                else if (lowerName.includes('kota')) inferredType = 'Kota Stone';
                else inferredType = 'Quartzite';
              }
            }

            let inferredCategory = p.color || p.colorCategory || p.category || 'Standard';
            if (categoryName === 'Paving & Landscape' || categoryName === 'Paving and Landscape') {
              if (lowerName.includes('cobble')) inferredCategory = 'Cobbles';
              else if (lowerName.includes('paver') || lowerName.includes('brick') || lowerName.includes('sandstone') || lowerName.includes('granite') || lowerName.includes('marble')) inferredCategory = 'Pavers';
              else if (lowerName.includes('pebble') || lowerName.includes('step')) inferredCategory = 'Stones';
              else inferredCategory = p.category || 'Pavers';
            }

            return {
              id: p.id || p._id || `db-${idx}`,
              sortOrder: typeof p.sortOrder === 'number' && !isNaN(p.sortOrder) ? p.sortOrder : idx,
              name: p.name || 'Product',
              image: thumbUrl,
              images: (p.images && p.images.length > 0) ? p.images : [thumbUrl],
              thumbnail: thumbUrl,
              color: p.color || '',
              colorCategory: p.colorCategory || p.color || '',
              variety: p.variety || p.gemstoneVariety || '',
              isRoyalGemStone: p.isRoyalGemStone || p.category === 'Royal Gemstone',
              category: inferredCategory,
              type: inferredType,
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
        } else {
          setDbProducts([]);
        }
        setLoading(false);
      })
      .catch(e => {
        if (isMounted) {
          setDbProducts([]);
          setLoading(false);
        }
        console.error(`Failed to fetch database products for ${categoryName}:`, e);
      });

    return () => {
      isMounted = false;
    };
  }, [categoryName]);

  const result = [...dbProducts];
  result.loading = loading;
  return result;
}

