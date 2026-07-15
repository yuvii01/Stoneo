const fs = require('fs');

let content = fs.readFileSync('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/pages/categories/Granite.jsx', 'utf8');

// 1. Imports
content = content.replace("import { GRANITE_TYPES } from '../../utils/constants';\n", '');
content = content.replace("import { useDemand } from '../../context/DemandContext';\n", "import { useDemand } from '../../context/DemandContext';\nimport PAVING_PRODUCTS from '../../utils/paving_landscape.json';\n");

// 2. Data
content = content.replace(/const CSV_PRODUCTS = \[[\s\S]*?\];/, '');
content = content.replace(/const DEFAULT_DESCRIPTION =[\s\S]*?const THICKNESS_RANGE = \[16, 18, 20, 22, 24, 26, 28, 30\];/, '');

const replacementAllProducts = `
const THICKNESS_RANGE = ['10mm', '16mm', '20mm', '30mm', '40mm', '50mm', '60mm'];
const COLOR_OPTIONS = ['Red', 'Brown', 'Black', 'Grey', 'Blue', 'Green', 'Ivory', 'Noce', 'White', 'Yellow', 'Mixed'];

const ALL_PRODUCTS = PAVING_PRODUCTS.map((csvItem, index) => {
  const nameLower = csvItem.name.toLowerCase();
  
  let color = 'Grey'; // default
  for (let c of COLOR_OPTIONS) {
    if (nameLower.includes(c.toLowerCase())) {
      color = c;
      break;
    }
  }

  const thickness = [];
  const numThickness = (index % 3) + 2;
  for (let i = 0; i < numThickness; i++) {
    thickness.push(THICKNESS_RANGE[(index + i) % THICKNESS_RANGE.length]);
  }

  let baseCategory = csvItem.category || 'Stones';
  let subCat = baseCategory;
  if (baseCategory === 'Cobbles') {
    if (nameLower.includes('granite')) subCat = 'Granite Cobbles';
    else if (nameLower.includes('lime') || nameLower.includes('kota')) subCat = 'Limestone Cobbles';
    else subCat = 'Sandstone Cobbles';
  } else if (baseCategory === 'Pavers') {
    if (nameLower.includes('brick')) subCat = 'Paving Bricks';
    else if (nameLower.includes('travertine')) subCat = 'Travertine Pavers';
    else subCat = 'Sandstone Pavers';
  } else {
    if (nameLower.includes('pebble')) subCat = 'Landscaping Pebbles';
    else subCat = 'Stepping Stones';
  }

  return {
    id: \`paving-\${index}\`,
    name: csvItem.name,
    image: csvItem.image,
    category: subCat,
    description: 'High-quality paving and landscape stones for outdoor elegance.',
    features: ['Durable', 'Weather Resistant', 'Non-slip Surface', 'Easy Installation'],
    color: color,
    price: 30 + ((index * 13) % 150),
    thickness: thickness
  };
});
`;
content = content.replace(/const ALL_PRODUCTS = CSV_PRODUCTS\.map\([\s\S]*?\}\);/, replacementAllProducts);

// 3. Component name
content = content.replace('export default function Granite()', 'export default function PavingAndLandscape()');

// 4. Filters state
content = content.replace(/const \[filters, setFilters\] = useState\(\{[\s\S]*?\}\);/, `const [filters, setFilters] = useState({
    category: [],
    color: [],
    thickness: []
  });`);

// 5. searchParams logic
const searchParamsStr = `useEffect(() => {
    const type = searchParams.get('type');
    let categories = [];
    if (type === 'cobbles') categories = ['Granite Cobbles', 'Sandstone Cobbles', 'Limestone Cobbles'];
    else if (type === 'cobbles-granite') categories = ['Granite Cobbles'];
    else if (type === 'cobbles-sandstone') categories = ['Sandstone Cobbles'];
    else if (type === 'cobbles-limestone') categories = ['Limestone Cobbles'];
    
    else if (type === 'pavers') categories = ['Paving Bricks', 'Sandstone Pavers', 'Travertine Pavers'];
    else if (type === 'pavers-brick') categories = ['Paving Bricks'];
    else if (type === 'pavers-sandstone') categories = ['Sandstone Pavers'];
    else if (type === 'pavers-travertine') categories = ['Travertine Pavers'];
    
    else if (type === 'stones') categories = ['Landscaping Pebbles', 'Stepping Stones'];
    else if (type === 'stones-pebbles') categories = ['Landscaping Pebbles'];
    else if (type === 'stones-stepping') categories = ['Stepping Stones'];
    
    if (type) {
        setFilters(prev => ({ ...prev, category: categories }));
    }
  }, [searchParams]);`;
content = content.replace(/useEffect\(\(\) => \{[\s\S]*?origin: \['Imported'\] \}\)\);\n    \}\n  \}, \[searchParams\]\);/, searchParamsStr);

// 6. handleFilterChange and handleGroupToggle
const filterChangeStr = `const handleFilterChange = (category, value) => {
    setFilters(prev => {
      const current = prev[category] || [];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const handleGroupToggle = (groupCategories) => {
    setFilters(prev => {
      const allSelected = groupCategories.every(cat => prev.category.includes(cat));
      if (allSelected) {
        return { ...prev, category: prev.category.filter(cat => !groupCategories.includes(cat)) };
      } else {
        const newCategories = new Set([...prev.category, ...groupCategories]);
        return { ...prev, category: Array.from(newCategories) };
      }
    });
  };`;
content = content.replace(/const handleFilterChange = \([\s\S]*?\n  \};/, filterChangeStr);

// 7. Filtered List Logic
const filterLogicStr = `const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(p => {
      const matchesUrlCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesType = filters.category.length === 0 || filters.category.includes(p.category);
      const matchesColor = filters.color.length === 0 || filters.color.includes(p.color);
      const matchesThickness = filters.thickness.length === 0 || filters.thickness.some(th => p.thickness.includes(th));

      return matchesUrlCategory && matchesType && matchesColor && matchesThickness;
    });
  }, [categoryFilter, filters]);`;
content = content.replace(/const filteredProducts = useMemo\(\(\) => \{[\s\S]*?return matchesUrlCategory && matchesColor && matchesOrigin && matchesTouch && matchesThickness;\n    \}\);\n  \}, \[categoryFilter, filters\]\);/, filterLogicStr);

// 8. Update SEO and Header
content = content.replace('pageKey="granite"', 'pageKey="paving-landscape"');
content = content.replace("name: 'Granite', path: '/category/granite'", "name: 'Paving & Landscape', path: '/category/paving-landscape'");
content = content.replace("Our {categoryFilter !== 'All' ? categoryFilter : ''} Granite Collections", "Our Paving & Landscape Collections");
content = content.replace("Browse our premium selection of {categoryFilter.toLowerCase()} imported varieties", "Premium selection of cobbles, pavers, and landscaping stones.");

// 9. Sidebar Filters update
const sidebarTypeRegex = /<h4>Origin<\/h4>[\s\S]*?<\/div>\n              <\/div>/;
const replacementSidebar = `<h4>Type</h4>
                
                <div className="filter-subcategory-group" style={{marginBottom: '15px'}}>
                  <h5 
                    style={{fontSize:'14px', marginBottom:'8px', color:'#333', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center'}}
                    onClick={() => handleGroupToggle(['Granite Cobbles', 'Sandstone Cobbles', 'Limestone Cobbles'])}
                  >
                    Cobbles &rsaquo;
                  </h5>
                  {['Granite Cobbles', 'Sandstone Cobbles', 'Limestone Cobbles'].map(cat => (
                    <label key={cat} className="filter-checkbox-label" style={{marginLeft: '10px'}}>
                      <input type="checkbox" checked={filters.category.includes(cat)} onChange={() => handleFilterChange('category', cat)} />
                      {cat}
                    </label>
                  ))}
                </div>

                <div className="filter-subcategory-group" style={{marginBottom: '15px'}}>
                  <h5 
                    style={{fontSize:'14px', marginBottom:'8px', color:'#333', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center'}}
                    onClick={() => handleGroupToggle(['Paving Bricks', 'Sandstone Pavers', 'Travertine Pavers'])}
                  >
                    Brick & Travertine &rsaquo;
                  </h5>
                  {['Paving Bricks', 'Sandstone Pavers', 'Travertine Pavers'].map(cat => (
                    <label key={cat} className="filter-checkbox-label" style={{marginLeft: '10px'}}>
                      <input type="checkbox" checked={filters.category.includes(cat)} onChange={() => handleFilterChange('category', cat)} />
                      {cat}
                    </label>
                  ))}
                </div>

                <div className="filter-subcategory-group" style={{marginBottom: '15px'}}>
                  <h5 
                    style={{fontSize:'14px', marginBottom:'8px', color:'#333', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center'}}
                    onClick={() => handleGroupToggle(['Landscaping Pebbles', 'Stepping Stones'])}
                  >
                    Stones & Others &rsaquo;
                  </h5>
                  {['Landscaping Pebbles', 'Stepping Stones'].map(cat => (
                    <label key={cat} className="filter-checkbox-label" style={{marginLeft: '10px'}}>
                      <input type="checkbox" checked={filters.category.includes(cat)} onChange={() => handleFilterChange('category', cat)} />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>`;
content = content.replace(sidebarTypeRegex, replacementSidebar);

content = content.replace(/<h4>Touch<\/h4>[\s\S]*?<\/div>\n              <\/div>/, '');

content = content.replace("{[16, 18, 20, 22, 24, 26, 28, 30]", "{['10mm', '16mm', '20mm', '30mm', '40mm', '50mm', '60mm']");
content = content.replace("{th} mm", "{th}");

content = content.replace("filters.origin.length > 0 || filters.color.length > 0 || filters.touch.length > 0 || filters.thickness.length > 0 || filters.minPrice > 50 || filters.maxPrice < 250", 'filters.category.length > 0 || filters.color.length > 0 || filters.thickness.length > 0');

const categoryMapStr = `{filters.category.map(cat => (
                    <div key={cat} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {cat}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('category', cat)}>×</span>
                    </div>
                  ))}`;
content = content.replace(/\{filters\.origin\.map\(org => \([\s\S]*?<\/div>\n                  \)\)\}/, categoryMapStr);

content = content.replace(/\{filters\.touch\.map\(tch => \([\s\S]*?<\/div>\n                  \)\)\}/, '');

content = content.replace('<span className="origin">{product.origin}</span>', '<span className="origin">{product.category}</span>');
content = content.replace("Thickness: {product.thickness.join(', ')} mm", "Thickness: {product.thickness.join(', ')}");

content = content.replace("<strong>Origin:</strong> {selectedProduct.origin}", "<strong>Category:</strong> {selectedProduct.category}");
content = content.replace("<strong>Thickness:</strong> {selectedProduct.thickness.join(', ')} mm", "<strong>Thickness:</strong> {selectedProduct.thickness.join(', ')}");
content = content.replace("<strong>Available Touch:</strong> {selectedProduct.touch.join(', ')}", "<strong>Color:</strong> {selectedProduct.color}");

content = content.replace(/granite buying guide/ig, 'Paving & Landscape Buying Guide');
content = content.replace(/>Granite</ig, '>Paving & Landscape<');
content = content.replace(/>GRANITE</ig, '>PAVING AND LANDSCAPE<');

fs.writeFileSync('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/pages/categories/PavingAndLandscape.jsx', content, 'utf8');
console.log('Rebuild complete!');
