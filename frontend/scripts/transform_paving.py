import re

with open(r'c:\Users\yuvra\OneDrive\Desktop\Stoneo\frontend\src\pages\categories\Granite.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
content = re.sub(r"import \{ GRANITE_TYPES \} from '\.\./\.\./utils/constants';\n", '', content)
content = re.sub(r"import \{ useDemand \} from '\.\./\.\./context/DemandContext';\n", "import { useDemand } from '../../context/DemandContext';\nimport PAVING_PRODUCTS from '../../utils/paving_landscape.json';\n", content)

# 2. Data
content = re.sub(r'const CSV_PRODUCTS = \[.*?\];', '', content, flags=re.DOTALL)
content = re.sub(r'const DEFAULT_DESCRIPTION =.*?const THICKNESS_RANGE = \[16, 18, 20, 22, 24, 26, 28, 30\];', '', content, flags=re.DOTALL)

replacementAllProducts = '''
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

  return {
    id: `paving-${index}`,
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
'''
content = re.sub(r'const ALL_PRODUCTS = CSV_PRODUCTS\.map\(.*?\}\);', replacementAllProducts, content, flags=re.DOTALL)

# 3. Component name
content = content.replace('export default function Granite()', 'export default function PavingAndLandscape()')

# 4. Filters state
content = re.sub(r'const \[filters, setFilters\] = useState\(\{.*?\}\);', '''const [filters, setFilters] = useState({
    category: [],
    color: [],
    thickness: []
  });''', content, flags=re.DOTALL)

# 5. searchParams logic & handleFilterChange
searchParamsStr = '''useEffect(() => {
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
  }, [searchParams]);'''
content = re.sub(r"useEffect\(\(\) => \{[\s\S]*?origin: \['Imported'\] \}\)\);\n    \}\n  \}, \[searchParams\]\);", searchParamsStr, content, flags=re.DOTALL)

filterChangeStr = '''const handleFilterChange = (category, value) => {
    setFilters(prev => {
      const current = prev[category] || [];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };'''
content = re.sub(r'const handleFilterChange = \([\s\S]*?\n  \};', filterChangeStr, content, flags=re.DOTALL)

# 6. Filtered List Logic
filterLogicStr = '''const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(p => {
      const matchesUrlCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesType = filters.category.length === 0 || filters.category.includes(p.category);
      const matchesColor = filters.color.length === 0 || filters.color.includes(p.color);
      const matchesThickness = filters.thickness.length === 0 || filters.thickness.some(th => p.thickness.includes(th));

      return matchesUrlCategory && matchesType && matchesColor && matchesThickness;
    });
  }, [categoryFilter, filters]);'''
content = re.sub(r'const filteredProducts = useMemo\(\(\) => \{[\s\S]*?return matchesUrlCategory && matchesColor && matchesOrigin && matchesTouch && matchesThickness;\n    \}\);\n  \}, \[categoryFilter, filters\]\);', filterLogicStr, content, flags=re.DOTALL)

# 7. Update SEO and Header
content = content.replace('pageKey="granite"', 'pageKey="paving-landscape"')
content = content.replace("name: 'Granite', path: '/category/granite'", "name: 'Paving & Landscape', path: '/category/paving-landscape'")
content = content.replace("Our {categoryFilter !== 'All' ? categoryFilter : ''} Granite Collections", "Our Paving & Landscape Collections")
content = content.replace("Browse our premium selection of {categoryFilter.toLowerCase()} imported varieties", "Premium selection of cobbles, pavers, and landscaping stones.")

# 8. Sidebar Filters update
originFilterStr = '''<h4>Type</h4>
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
              </div>'''
content = re.sub(r'<h4>Origin<\/h4>[\s\S]*?<\/div>\n              <\/div>', originFilterStr, content, flags=re.DOTALL)

content = re.sub(r'<h4>Touch<\/h4>[\s\S]*?<\/div>\n              <\/div>', '', content, flags=re.DOTALL)

content = content.replace("{[16, 18, 20, 22, 24, 26, 28, 30]", "{['10mm', '16mm', '20mm', '30mm', '40mm', '50mm', '60mm']")
content = content.replace("{th} mm", "{th}")

content = content.replace("filters.origin.length > 0 || filters.color.length > 0 || filters.touch.length > 0 || filters.thickness.length > 0 || filters.minPrice > 50 || filters.maxPrice < 250", 'filters.category.length > 0 || filters.color.length > 0 || filters.thickness.length > 0')

categoryMapStr = '''{filters.category.map(cat => (
                    <div key={cat} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {cat}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('category', cat)}>×</span>
                    </div>
                  ))}'''
content = re.sub(r'\{filters\.origin\.map\(org => \([\s\S]*?<\/div>\n                  \)\)\}', categoryMapStr, content, flags=re.DOTALL)

content = re.sub(r'\{filters\.touch\.map\(tch => \([\s\S]*?<\/div>\n                  \)\)\}', '', content, flags=re.DOTALL)

content = content.replace('<span className="origin">{product.origin}</span>', '<span className="origin">{product.category}</span>')
content = content.replace("Thickness: {product.thickness.join(', ')} mm", "Thickness: {product.thickness.join(', ')}")

content = content.replace("<strong>Origin:</strong> {selectedProduct.origin}", "<strong>Category:</strong> {selectedProduct.category}")
content = content.replace("<strong>Thickness:</strong> {selectedProduct.thickness.join(', ')} mm", "<strong>Thickness:</strong> {selectedProduct.thickness.join(', ')}")
content = content.replace("<strong>Available Touch:</strong> {selectedProduct.touch.join(', ')}", "<strong>Color:</strong> {selectedProduct.color}")

content = re.sub(r'granite buying guide', 'Paving & Landscape Buying Guide', content, flags=re.IGNORECASE)
content = re.sub(r'>Granite<', '>Paving & Landscape<', content, flags=re.IGNORECASE)
content = re.sub(r'>GRANITE<', '>PAVING AND LANDSCAPE<', content, flags=re.IGNORECASE)

with open(r'c:\Users\yuvra\OneDrive\Desktop\Stoneo\frontend\src\pages\categories\PavingAndLandscape.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
