import React, { useState, useEffect, useRef } from 'react';
import { CSV_PRODUCTS } from '../utils/constants';
import '../styles/visual-search.css';

const CATEGORIES = ['All', 'Granite', 'Marble', 'Sandstone', 'Quartz', 'Tiles', 'Onyx', 'Terrazzo', 'Quartzite', 'Soapstone', 'Basalt', 'Slate', 'Travertine', 'Limestone'];

// --- Perceptual color engine: CIE L*a*b* + texture variance ---

// Convert sRGB to CIE L*a*b* (perceptually uniform — equal delta-E = equal perceived difference)
function rgbToLab(r, g, b) {
  // Gamma-decode sRGB
  const linearize = c => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const rl = linearize(r), gl = linearize(g), bl = linearize(b);
  // Linear RGB → XYZ (D65 illuminant)
  const X = rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375;
  const Y = rl * 0.2126729 + gl * 0.7151522 + bl * 0.0721750;
  const Z = rl * 0.0193339 + gl * 0.1191920 + bl * 0.9503041;
  // XYZ → Lab (D65 white: 0.95047, 1.0, 1.08883)
  const f = t => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  const fX = f(X / 0.95047), fY = f(Y / 1.0), fZ = f(Z / 1.08883);
  return [116 * fY - 16, 500 * (fX - fY), 200 * (fY - fZ)];
}

// CIE76 delta-E: perceptually uniform distance. ≤10 = similar; ≥50 = very different
function deltaE(lab1, lab2) {
  const dL = lab1[0] - lab2[0];
  const da = lab1[1] - lab2[1];
  const db = lab1[2] - lab2[2];
  return Math.sqrt(dL * dL + da * da + db * db);
}

// Trimmed mean: discard darkest & brightest 10% of pixels to remove shadow/highlight noise
function trimmedMeanRGB(pixels, trim = 0.1) {
  if (pixels.length === 0) return [128, 128, 128];
  const sorted = [...pixels].sort((a, b) => (a[0]+a[1]+a[2]) - (b[0]+b[1]+b[2]));
  const cut = Math.floor(sorted.length * trim);
  const kept = sorted.slice(cut, sorted.length - cut);
  const n = kept.length || 1;
  return [
    kept.reduce((s, p) => s + p[0], 0) / n,
    kept.reduce((s, p) => s + p[1], 0) / n,
    kept.reduce((s, p) => s + p[2], 0) / n,
  ];
}

function computeVariance(pixels) {
  const n = pixels.length;
  if (n === 0) return 0;
  const mR = pixels.reduce((a, p) => a + p[0], 0) / n;
  const mG = pixels.reduce((a, p) => a + p[1], 0) / n;
  const mB = pixels.reduce((a, p) => a + p[2], 0) / n;
  return pixels.reduce((a, p) =>
    a + Math.pow(p[0] - mR, 2) + Math.pow(p[1] - mG, 2) + Math.pow(p[2] - mB, 2)
  , 0) / (n * 3);
}

// Returns a 0–100 score for how well the image's HSL/variance matches a named color
function scoreColorMatch(colorName, h, s, l, variance) {
  // Helper: score how close a hue is to a target, within a tolerance (degrees)
  const hueScore = (target, tol) => {
    let diff = Math.abs(h - target);
    if (diff > 180) diff = 360 - diff; // handle circular hue
    return Math.max(0, 1 - diff / tol);
  };

  switch (colorName) {
    case 'Black': {
      // Lightness is the main factor; saturation doesn't matter much
      if (l < 15) return 98;
      if (l < 30) return 85;
      if (l < 45) return 60;
      return Math.max(5, 45 - l);
    }
    case 'White': {
      if (l > 90 && s < 12) return 98;
      if (l > 80 && s < 20) return 82;
      if (l > 70 && s < 28) return 60;
      return Math.max(5, (l - 40) * 1.5);
    }
    case 'Grey': {
      const greyBase = s < 12 && l > 25 && l < 75 ? 90 : s < 22 && l > 20 && l < 80 ? 65 : 15;
      return Math.round(greyBase - Math.max(0, s - 12) * 1.5);
    }
    case 'Cream': {
      const hueFit = hueScore(38, 30); // beige/cream hue ~38°
      const lightFit = l > 68 && l < 92 ? 1 : 0.3;
      const satFit = s > 5 && s < 35 ? 1 : 0.4;
      return Math.round(10 + 85 * hueFit * lightFit * satFit);
    }
    case 'Gold': {
      const hueFit = hueScore(44, 22); // gold hue ~44°
      const satFit = s > 35 ? 1 : s / 35;
      const lightFit = l > 30 && l < 72 ? 1 : 0.4;
      return Math.round(10 + 85 * hueFit * satFit * lightFit);
    }
    case 'Brown': {
      const hueFit = hueScore(28, 22); // brown hue ~28°
      const lightFit = l > 12 && l < 50 ? 1 : 0.3;
      const satFit = s > 18 && s < 65 ? 1 : 0.4;
      return Math.round(10 + 85 * hueFit * lightFit * satFit);
    }
    case 'Red': {
      // Red wraps around 0°/360°
      const hueFit = Math.max(hueScore(0, 20), hueScore(360, 20));
      const satFit = s > 35 ? 1 : s / 35;
      return Math.round(10 + 85 * hueFit * satFit);
    }
    case 'Orange': {
      const hueFit = hueScore(25, 18);
      const satFit = s > 45 ? 1 : s / 45;
      const lightFit = l > 35 && l < 70 ? 1 : 0.45;
      return Math.round(10 + 85 * hueFit * satFit * lightFit);
    }
    case 'Yellow': {
      const hueFit = hueScore(58, 16);
      const satFit = s > 40 ? 1 : s / 40;
      const lightFit = l > 45 ? 1 : 0.5;
      return Math.round(10 + 85 * hueFit * satFit * lightFit);
    }
    case 'Green': {
      const hueFit = hueScore(120, 45);
      const satFit = s > 22 ? 1 : s / 22;
      return Math.round(10 + 85 * hueFit * satFit);
    }
    case 'Blue': {
      const hueFit = hueScore(220, 40);
      const satFit = s > 22 ? 1 : s / 22;
      return Math.round(10 + 85 * hueFit * satFit);
    }
    case 'Pink': {
      const hueFit = hueScore(345, 30);
      const satFit = s > 20 && s < 70 ? 1 : 0.4;
      const lightFit = l > 45 && l < 82 ? 1 : 0.3;
      return Math.round(10 + 85 * hueFit * satFit * lightFit);
    }
    case 'Multicolor': {
      // High pixel variance = many colors in the region
      if (variance > 3500) return 90;
      if (variance > 2000) return 75;
      if (variance > 900)  return 55;
      if (variance > 300)  return 35;
      return 15;
    }
    default:
      return 20;
  }
}

export default function VisualSearchModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('upload'); // 'upload' | 'results'
  const [uploadedImage, setUploadedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortedProducts, setSortedProducts] = useState(CSV_PRODUCTS);
  const [scanBox, setScanBox] = useState({ x: 60, y: 10, w: 30, h: 30 });
  const scanBoxRef = useRef({ x: 60, y: 10, w: 30, h: 30 }); // Keep latest without triggering effect teardown
  const dragRef = useRef({ isDragging: false, isResizing: false, startX: 0, startY: 0, startBox: null });

  // Sync ref with state
  useEffect(() => {
    scanBoxRef.current = scanBox;
  }, [scanBox]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setMode('upload');
        setUploadedImage(null);
        setActiveCategory('All');
        setSortedProducts(CSV_PRODUCTS);
        setScanBox({ x: 60, y: 10, w: 30, h: 30 });
      }, 300);
    }
  }, [isOpen]);

  const analyzeColor = (currentScanBox, currentImage) => {
    const boxToUse = currentScanBox || scanBoxRef.current;
    const imageToUse = currentImage || uploadedImage;
    if (!imageToUse) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      // Sample 5 zones: the scan box + 4 image corners (16x16 each = 256 pixels/zone)
      // Gives a fuller picture of the stone's color profile
      const GRID = 16;
      canvas.width = GRID;
      canvas.height = GRID;

      const sx = (boxToUse.x / 100) * img.width;
      const sy = (boxToUse.y / 100) * img.height;
      const sw = (boxToUse.w / 100) * img.width;
      const sh = (boxToUse.h / 100) * img.height;

      const zones = [
        [sx, sy, sw, sh],                          // scan box (primary)
        [0, 0, img.width * 0.3, img.height * 0.3], // top-left corner
        [img.width * 0.7, 0, img.width * 0.3, img.height * 0.3], // top-right
        [0, img.height * 0.7, img.width * 0.3, img.height * 0.3], // bottom-left
        [img.width * 0.7, img.height * 0.7, img.width * 0.3, img.height * 0.3], // bottom-right
      ];

      const zonePixels = zones.map(([zx, zy, zw, zh]) => {
        ctx.clearRect(0, 0, GRID, GRID);
        ctx.drawImage(img, zx, zy, zw, zh, 0, 0, GRID, GRID);
        const data = ctx.getImageData(0, 0, GRID, GRID).data;
        const pxs = [];
        for (let i = 0; i < data.length; i += 4) {
          pxs.push([data[i], data[i+1], data[i+2]]);
        }
        return pxs;
      });

      // Primary zone (scan box): trimmed mean removes shadow/highlight outliers
      const primaryPixels = zonePixels[0];
      const trimmedRGB = trimmedMeanRGB(primaryPixels, 0.1);
      const imageLab = rgbToLab(trimmedRGB[0], trimmedRGB[1], trimmedRGB[2]);

      // Texture: standard deviation of luminance across the scan box
      // 0 = very uniform/smooth; high = speckled/patterned
      const imageVariance = computeVariance(primaryPixels);
      const imageTexture = Math.min(100, Math.sqrt(imageVariance) / 2.55);

      // Cross-zone consistency: average Lab from corner zones
      const cornerLabs = zonePixels.slice(1).map(pxs => {
        const t = trimmedMeanRGB(pxs, 0.1);
        return rgbToLab(t[0], t[1], t[2]);
      });

      // Score each product
      const MAX_DELTA_E = 100; // deltaE > 100 means completely different colors
      const scored = CSV_PRODUCTS.map(p => {
        if (!p.rgb) {
          return { ...p, matchScore: 30 };
        }

        // PRIMARY SCORE: CIE L*a*b* delta-E between scan box trimmed mean and product rgb
        const productLab = rgbToLab(p.rgb[0], p.rgb[1], p.rgb[2]);
        const primaryDeltaE = deltaE(imageLab, productLab);
        const colorScore = Math.max(0, (1 - primaryDeltaE / MAX_DELTA_E) * 100);

        // SECONDARY SCORE: cross-zone consistency bonus
        // If the whole image looks like the product color (not just the scan box), boost score
        const avgCornerDeltaE = cornerLabs.reduce((s, cl) => s + deltaE(cl, productLab), 0) / cornerLabs.length;
        const consistencyBonus = Math.max(0, (1 - avgCornerDeltaE / MAX_DELTA_E) * 20);

        // TEXTURE SCORE: penalize if product texture (smooth vs speckled) doesn't match image
        const productTexture = p.texture !== undefined ? p.texture : 40; // default mid-texture
        const textureDiff = Math.abs(imageTexture - productTexture) / 100;
        const texturePenalty = textureDiff * 15; // max 15pt penalty for texture mismatch

        const total = colorScore * 0.75 + consistencyBonus - texturePenalty;
        return { ...p, matchScore: Math.min(99, Math.max(1, Math.round(total))) };
      });

      const ranked = scored.sort((a, b) => b.matchScore - a.matchScore);
      setSortedProducts(ranked);
    };
    img.src = imageToUse;
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!dragRef.current.isDragging && !dragRef.current.isResizing) return;
      
      const container = document.querySelector('.vs-image-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      
      const dxPercent = ((e.clientX - dragRef.current.startX) / rect.width) * 100;
      const dyPercent = ((e.clientY - dragRef.current.startY) / rect.height) * 100;
      
      if (dragRef.current.isDragging) {
        let newX = dragRef.current.startBox.x + dxPercent;
        let newY = dragRef.current.startBox.y + dyPercent;
        newX = Math.max(0, Math.min(newX, 100 - dragRef.current.startBox.w));
        newY = Math.max(0, Math.min(newY, 100 - dragRef.current.startBox.h));
        setScanBox(prev => ({ ...prev, x: newX, y: newY }));
      } else if (dragRef.current.isResizing) {
        let newW = dragRef.current.startBox.w + dxPercent;
        let newH = dragRef.current.startBox.h + dyPercent;
        newW = Math.max(10, Math.min(newW, 100 - dragRef.current.startBox.x));
        newH = Math.max(10, Math.min(newH, 100 - dragRef.current.startBox.y));
        setScanBox(prev => ({ ...prev, w: newW, h: newH }));
      }
    };

    const handleUp = () => {
      if (dragRef.current.isDragging || dragRef.current.isResizing) {
        dragRef.current.isDragging = false;
        dragRef.current.isResizing = false;
        analyzeColor();
      }
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [uploadedImage]); // Removed scanBox from deps to prevent listener thrashing

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setUploadedImage(dataUrl);
      setMode('results');
      analyzeColor(scanBox, dataUrl); // pass current scanBox and dataUrl directly to avoid stale closure
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="vs-modal-overlay" onClick={onClose}>
      <div className={`vs-modal-content ${mode === 'results' ? 'vs-results-mode' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="vs-close-btn" onClick={onClose}>✕</button>
        
        {mode === 'upload' ? (
          <div className="vs-upload-view">
            <h2>Material Bank Match</h2>
            <p>Upload an image and see similar items available for sampling.</p>
            
            <div className="vs-dropzone">
              <p>Drag an image here or</p>
              <label className="vs-upload-btn">
                Upload a file
                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
              </label>
            </div>
            
            <div className="vs-divider">or</div>
            
            <div className="vs-paste-link">
              <input type="text" placeholder="Paste image link" />
              <button>Search</button>
            </div>
          </div>
        ) : (
          <div className="vs-results-view">
            <div className="vs-results-header-mobile">
              <h2>Visual Search</h2>
            </div>
            <div className="vs-results-left">
              <div className="vs-image-container">
                <img src={uploadedImage} alt="Uploaded" className="vs-uploaded-img" />
                <div 
                  className="vs-scan-box"
                  style={{ 
                    left: `${scanBox.x}%`, 
                    top: `${scanBox.y}%`, 
                    width: `${scanBox.w}%`, 
                    height: `${scanBox.h}%`,
                    cursor: 'move'
                  }}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dragRef.current = { isDragging: true, isResizing: false, startX: e.clientX, startY: e.clientY, startBox: { ...scanBox } };
                  }}
                >
                  <div 
                    className="vs-resize-handle"
                    style={{
                      position: 'absolute',
                      right: 0,
                      bottom: 0,
                      width: '15px',
                      height: '15px',
                      cursor: 'nwse-resize',
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderTopLeftRadius: '50%'
                    }}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dragRef.current = { isDragging: false, isResizing: true, startX: e.clientX, startY: e.clientY, startBox: { ...scanBox } };
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="vs-results-right">
              <div className="vs-results-header">
                <h2>Product Matches</h2>
              </div>
              
              <div className="vs-category-filters">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    className={`vs-filter-pill ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="vs-product-grid">
                {sortedProducts
                  .filter(p => activeCategory === 'All' || p.material === activeCategory)
                  .slice(0, 9)
                  .map((product, idx) => (
                    <div key={idx} className="vs-product-card">
                      <img src={product.image} alt={product.name} />
                      {product.matchScore !== undefined && (
                        <div className="vs-match-badge">{product.matchScore}% match</div>
                      )}
                      <div className="vs-product-info">
                        <span className="vs-product-cat">{product.material ? product.material.toUpperCase() : ''}</span>
                        <h4>{product.name}</h4>
                        <button className="vs-add-btn">Add to Cart</button>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
