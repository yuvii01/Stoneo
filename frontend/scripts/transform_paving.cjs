const fs = require('fs');
let content = fs.readFileSync('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/pages/categories/PavingAndLandscape.jsx', 'utf8');

// 1. Replace Imports
content = content.replace(/import \{ GRANITE_TYPES \} from '\.\.\/\.\.\/utils\/constants';\n/, '');
content = content.replace(/import \{ useDemand \} from '\.\.\/\.\.\/context\/DemandContext';\n/, "import { useDemand } from '../../context/DemandContext';\nimport PAVING_PRODUCTS from '../../utils/paving_landscape.json';\n");

// 2. Replace CSV_PRODUCTS with PAVING_PRODUCTS mapping
const csvDataRegex = /const CSV_PRODUCTS = \[[\s\S]*?\];/;
content = content.replace(csvDataRegex, '');

const oldVarsRegex = /const DEFAULT_DESCRIPTION = [\s\S]*?const THICKNESS_RANGE = \[16, 18, 20, 22, 24, 26, 28, 30\];/;
content = content.replace(oldVarsRegex, '');

const allProductsRegex = /const ALL_PRODUCTS = CSV_PRODUCTS\.map\([\s\S]*?\}\);/;
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

  // Assign random thicknesses 
  const thickness = [];
  const numThickness = (index % 3) + 2;
  for (let i = 0; i < numThickness; i++) {
    thickness.push(THICKNESS_RANGE[(index + i) % THICKNESS_RANGE.length]);
  }

  return {
    id: \`paving-\${index}\`,
    name: csvItem.name,
    image: csvItem.image,
    category: csvItem.category || 'Stones',
    description: 'High-quality paving and landscape stones for outdoor elegance.',
    features: ['Durable', 'Weather Resistant', 'Non-slip Surface', 'Easy Installation'],
    color: color,
    price: 30 + ((index * 13) % 150),
    thickness: thickness
  };
});
`;
content = content.replace(allProductsRegex, replacementAllProducts);

// 3. Rename component and state
content = content.replace(/export default function Granite\(\)/g, 'export default function PavingAndLandscape()');

// 4. Update filters state
content = content.replace(/const \[filters, setFilters\] = useState\(\{[\s\S]*?\}\);/, `const [filters, setFilters] = useState({
    category: [],
    color: [],
    thickness: []
  });`);

// 5. Replace searchParams logic & handleFilterChange
const searchParamsRegex = /useEffect\(\(\) => \{[\s\S]*?origin: \['Imported'\] \}\)\);\n    \}\n  \}, \[searchParams\]\);/;
content = content.replace(searchParamsRegex, `useEffect(() => {
    const type = searchParams.get('type');
    let categories = [];
    if (type === 'cobbles') {
      categories = ['Cobbles'];
    } else if (type === 'pavers') {
      categories = ['Pavers'];
    } else if (type === 'stones') {
      categories = ['Stones'];
    }
    if (type) {
        setFilters(prev => ({ ...prev, category: categories }));
    }
  }, [searchParams]);`);

const filterChangeRegex = /const handleFilterChange = \([\s\S]*?\n  \};/;
content = content.replace(filterChangeRegex, `const handleFilterChange = (category, value) => {
    setFilters(prev => {
      const current = prev[category] || [];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };`);

// 6. Replace Filtered List Logic
const filterLogicRegex = /const filteredProducts = useMemo\(\(\) => \{[\s\S]*?return matchesUrlCategory && matchesColor && matchesOrigin && matchesTouch && matchesThickness;\n    \}\);\n  \}, \[categoryFilter, filters\]\);/;
content = content.replace(filterLogicRegex, `const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(p => {
      const matchesUrlCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesType = filters.category.length === 0 || filters.category.includes(p.category);
      const matchesColor = filters.color.length === 0 || filters.color.includes(p.color);
      const matchesThickness = filters.thickness.length === 0 || filters.thickness.some(th => p.thickness.includes(th));

      return matchesUrlCategory && matchesType && matchesColor && matchesThickness;
    });
  }, [categoryFilter, filters]);`);

// 7. Update SEO and Header
content = content.replace(/pageKey="granite"/, 'pageKey="paving-landscape"');
content = content.replace(/name: 'Granite', path: '\/category\/granite'/g, "name: 'Paving & Landscape', path: '/category/paving-landscape'");
content = content.replace(/Our \{categoryFilter !== 'All' \? categoryFilter : ''\} Granite Collections/g, "Our Paving & Landscape Collections");
content = content.replace(/Browse our premium selection of \{categoryFilter\.toLowerCase\(\)\} imported varieties/g, "Premium selection of cobbles, pavers, and landscaping stones.");

// 8. Sidebar Filters update
const originFilterRegex = /<h4>Origin<\/h4>[\s\S]*?<\/div>\n              <\/div>/;
content = content.replace(originFilterRegex, `<h4>Type</h4>
                <div className="filter-checkbox-group">
                  {['Cobbles', 'Pavers', 'Stones'].map(cat => (
                    <label key={cat} className="filter-checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.category.includes(cat)}
                        onChange={() => handleFilterChange('category', cat)}
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>`);

const touchFilterRegex = /<h4>Touch<\/h4>[\s\S]*?<\/div>\n              <\/div>/;
content = content.replace(touchFilterRegex, '');

content = content.replace(/\{\[16, 18, 20, 22, 24, 26, 28, 30\]/g, "{['10mm', '16mm', '20mm', '30mm', '40mm', '50mm', '60mm']");
content = content.replace(/\{th\} mm/g, "{th}");

content = content.replace(/filters\.origin\.length > 0 \|\| filters\.color\.length > 0 \|\| filters\.touch\.length > 0 \|\| filters\.thickness\.length > 0 \|\| filters\.minPrice > 50 \|\| filters\.maxPrice < 250/g, 'filters.category.length > 0 || filters.color.length > 0 || filters.thickness.length > 0');

content = content.replace(/\{filters\.origin\.map\(org => \([\s\S]*?<\/div>\n                  \)\)\}/, `{filters.category.map(cat => (
                    <div key={cat} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {cat}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('category', cat)}>×</span>
                    </div>
                  ))}`);

content = content.replace(/\{filters\.touch\.map\(tch => \([\s\S]*?<\/div>\n                  \)\)\}/, '');

content = content.replace(/<span className="origin">\{product\.origin\}<\/span>/, '<span className="origin">{product.category}</span>');
content = content.replace(/Thickness: \{product\.thickness\.join\(', '\)\} mm/, "Thickness: {product.thickness.join(', ')}");

content = content.replace(/<strong>Origin:<\/strong> \{selectedProduct\.origin\}/, '<strong>Category:</strong> {selectedProduct.category}');
content = content.replace(/<strong>Thickness:<\/strong> \{selectedProduct\.thickness\.join\(', '\)\} mm/, "<strong>Thickness:</strong> {selectedProduct.thickness.join(', ')}");
content = content.replace(/<strong>Available Touch:<\/strong> \{selectedProduct\.touch\.join\(', '\)\}/, '<strong>Color:</strong> {selectedProduct.color}');

// Fixing 'Granite' textual references
content = content.replace(/granite buying guide/gi, 'Paving & Landscape Buying Guide');
content = content.replace(/>Granite</gi, '>Paving & Landscape<');
content = content.replace(/>GRANITE</gi, '>PAVING AND LANDSCAPE<');

fs.writeFileSync('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/pages/categories/PavingAndLandscape.jsx', content, 'utf8');
console.log('Successfully transformed Granite to PavingAndLandscape');
