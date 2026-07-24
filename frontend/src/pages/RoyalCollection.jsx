import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/RoyalCollection.css';
import SEOHead from '../components/SEOHead';
import { stoneKnowledge } from '../stoneKnowledge';

gsap.registerPlugin(ScrollTrigger);

import { gemstoneImages } from '../gemstoneImages';

// Dummy products to populate the collection
const STONE_TYPES = ["Agate", "Quartz", "Gemstone", "Shellstone", "Fossil", "Jasper"];

const generateDummyProducts = (categoryName, collectionId) => {
  const images = collectionId && gemstoneImages[collectionId.toLowerCase()];

  if (images && images.length > 0) {
    return images.map((img, index) => {
      const isTranslucent = Math.random() > 0.5;
      // Extract filename without extension to use as a better name
      const rawName = img.split('/').pop().replace(/\.[^/.]+$/, "");
      const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1).replace(/([A-Z])/g, ' $1');

      return {
        id: index + 1,
        name: displayName || `${categoryName} ${index + 1}`,
        stoneType: categoryName,
        isTranslucent: isTranslucent,
        image: img
      };
    });
  }

  return Array.from({ length: 12 }).map((_, index) => {
    const stoneType = STONE_TYPES[index % STONE_TYPES.length];
    const isTranslucent = Math.random() > 0.5;
    return {
      id: index + 1,
      name: `${stoneType} ${categoryName} ${index + 1}`,
      stoneType: stoneType,
      isTranslucent: isTranslucent,
      image: `https://placehold.co/600x800/1a1a1a/d4af37?text=${stoneType}+${categoryName}`
    };
  });
};

const RoyalCollection = ({ showFilters = false }) => {
  const { collectionId } = useParams();
  const gridItemsRef = useRef([]);

  const collectionIdLower = collectionId ? collectionId.toLowerCase() : '';
  const knowledge = stoneKnowledge[collectionIdLower];
  const knowledgeImages = gemstoneImages[collectionIdLower] || [];

  const categoryName = collectionId ? collectionId.replace(/-/g, ' ').toUpperCase() : 'STONE';
  // Use useMemo to avoid re-generating products on every render which breaks images
  const products = React.useMemo(() => generateDummyProducts(categoryName, collectionId), [categoryName, collectionId]);

  const [selectedStoneTypes, setSelectedStoneTypes] = useState([]);
  const [selectedBacklight, setSelectedBacklight] = useState([]);

  // Filter handlers
  const toggleStoneType = (type) => {
    setSelectedStoneTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleBacklight = (value) => {
    setSelectedBacklight(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const filteredProducts = showFilters ? products.filter(product => {
    const matchStone = selectedStoneTypes.length === 0 || selectedStoneTypes.includes(product.stoneType);
    const backlightValue = product.isTranslucent ? 'Translucent' : 'Non-Translucent';
    const matchBacklight = selectedBacklight.length === 0 || selectedBacklight.includes(backlightValue);
    return matchStone && matchBacklight;
  }) : products;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [collectionId]);

  useEffect(() => {
    // Re-trigger animation when filteredProducts change
    gridItemsRef.current = gridItemsRef.current.slice(0, filteredProducts.length);
    gridItemsRef.current.forEach((el, index) => {
      if (el) {
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: index * 0.05, // Faster stagger when filtering
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });
  }, [filteredProducts]);

  return (
    <div className="royal-collection-page page">
      <SEOHead
        pageKey="home"
        title={`${categoryName} Collection | Royal Gem Stones`}
      />

      <section className="collection-header">
        <h1>THE {categoryName} COLLECTION</h1>
        <p>Explore our exclusive range of {categoryName.toLowerCase()} products, crafted for the ultimate luxurious aesthetic. Hand-selected for quality, elegance, and timeless beauty.</p>
      </section>


      <section className="collection-layout">
        {showFilters && (
          <aside className="collection-sidebar">
            <div className="filter-group">
              <h3>Stone Type</h3>
              {STONE_TYPES.map(type => (
                <label key={type} className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedStoneTypes.includes(type)}
                    onChange={() => toggleStoneType(type)}
                  />
                  <span className="checkmark"></span>
                  {type}
                </label>
              ))}
            </div>
            <div className="filter-group">
              <h3>Back Light</h3>
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={selectedBacklight.includes('Translucent')}
                  onChange={() => toggleBacklight('Translucent')}
                />
                <span className="checkmark"></span>
                Translucent <span className="helper-text">(allows light to pass)</span>
              </label>
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={selectedBacklight.includes('Non-Translucent')}
                  onChange={() => toggleBacklight('Non-Translucent')}
                />
                <span className="checkmark"></span>
                Non-Translucent <span className="helper-text">(does not allow light to pass)</span>
              </label>
            </div>
          </aside>
        )}

        <div className="collection-grid-container">
          <div className="collection-grid">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="collection-item"
                ref={el => gridItemsRef.current[index] = el}
              >
                <div className="item-image-container">
                  <img src={product.image} alt={product.name} />
                  <div className="item-overlay">
                    <div className="item-details">
                      <h3>{product.name}</h3>
                      {/* <button className="btn-view-details">View Details</button> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {knowledge && !showFilters && (
        <section className="stone-knowledge-section" style={{ marginTop: '50px' }}>
          <div className="knowledge-block">
            <div className="knowledge-text">
              <h2>Geological Origins & Formation</h2>
              <p>{knowledge.origins}</p>
            </div>
            <div className="knowledge-image">
              <img src={knowledgeImages[0] || 'https://placehold.co/600x400/1a1a1a/d4af37?text=Origins'} alt="Geological Origins" />
            </div>
          </div>
          
          <div className="knowledge-block reverse">
            <div className="knowledge-text">
              <h2>Architectural Benefits & Properties</h2>
              <p>{knowledge.whyUsed}</p>
            </div>
            <div className="knowledge-image">
              <img src={knowledgeImages[1] || 'https://placehold.co/600x400/1a1a1a/d4af37?text=Why+Used'} alt="Architectural Benefits" />
            </div>
          </div>

          <div className="knowledge-block">
            <div className="knowledge-text">
              <h2>Luxury Interior Design Applications</h2>
              <p>{knowledge.whereUsed}</p>
            </div>
            <div className="knowledge-image">
              <img src={knowledgeImages[2] || 'https://placehold.co/600x400/1a1a1a/d4af37?text=Where+Used'} alt="Interior Design Applications" />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default RoyalCollection;
