import sys

with open("c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/pages/categories/Granite.jsx", "r", encoding="utf8") as f:
    text = f.read()

csv_block = """const CSV_PRODUCTS = [
  { "name": "Agra Red Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/agra-red/agra-red-sawn-wet-sandstone-tiles.jpg", "category": "Red" },
  { "name": "Autumn Brown Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/autumn-brown/automn-brown-sandstone-honed-surface-cut-to-size-tiles.jpg", "category": "Brown" },
  { "name": "Bansi Pink Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/bansi-pink/bansi-pink-sandstone-honed-finish-tiles.jpg", "category": "Pink" },
  { "name": "Camel Dust Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/camel-dust/camel-dust-sandstone-natural-paving-tiles.jpg", "category": "Beige" },
  { "name": "Chocolate Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/chocolate/chocolate-sandstone-natural-finish-calibrated-tiles.jpg", "category": "Brown" },
  { "name": "Sagar Black Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/sagar-black/sagar-black-natural-wet-sandstone-paving-exterior-tiles.jpg", "category": "Black" },
  { "name": "Dholpur Beige Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/dholpur-beige/dholpur-beige-sandstone-natural-finish-tiles.jpg", "category": "Beige" },
  { "name": "Modak Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/modak/modak-sandstone-natural-surface-hand-split-tiles.jpg", "category": "Brown" },
  { "name": "Mandana Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/mandana/mandana-red-sandstone-natural-tile-exporter-india.jpg", "category": "Red" },
  { "name": "Jodhpur Pink Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/jodhpur-pink/jodhpur-pink-sandstone-honed-tiles.jpg", "category": "Pink" },
  { "name": "Jodhpur Brown Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/jodhpur-brown/jodhpur-brown-sandstone-honed-finish-tiles.jpg", "category": "Brown" },
  { "name": "Jaisalmer Yellow Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/jaisalmer-yellow/jaisalmer-yellow-sandstone-honed-polished-cut-to-size-tiles.jpg", "category": "Yellow" },
  { "name": "Mint Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/mint/white-mint-natural-split-surface-sandstone-tile.jpg", "category": "Green" },
  { "name": "Yellow Mint Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/yellow-mint/yellow-mint-sandstone-natural-finish-calibrated-tiles.jpg", "category": "Yellow" },
  { "name": "Pink Mint Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/pink-mint/pink-mint-sandstone-cut-to-size-natural-tiles.jpg", "category": "Pink" },
  { "name": "Lalitpur Grey Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/lalitpur-grey/lalitpur-grey-sandstone-natural-patio-pack-tiles.jpg", "category": "Grey" },
  { "name": "Lalitpur Yellow Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/lalitpur-yellow/lalitpur-yellow-sandstone-natural-split-finish-tiles.jpg", "category": "Yellow" },
  { "name": "Raveena Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/raveena/raveena-sandstone-natural-paving-tile-setts.jpg", "category": "Brown" },
  { "name": "Kandla Grey Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/kandla-grey/kandla-grey-sandstone-natural-finish-tiles.jpg", "category": "Grey" },
  { "name": "Raj Green Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/raj-green/raj-green-natural-sandstone-floor-covering-tiles.jpg", "category": "Green" },
  { "name": "Fossil Mint Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/fossil-mint/fossil-mint-sandstone-paving-tiles.jpg", "category": "Green" },
  { "name": "Teak Wood Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/teak-wood/teakwood-sandstone-honed-paving-tiles.jpg", "category": "Brown" },
  { "name": "Rainbow Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/rainbow/rainbow-sandstone-swan-finish-paving-tiles.jpg", "category": "Multicolor" },
  { "name": "Panther Sandstone", "image": "https://www.royalindianstones.com/assets/img/products/sandstone/panther/panter-sandstone-patio-pack-paving-tiles.jpg", "category": "Brown" },
  { "name": "Kota Stone", "image": "https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Kota-stone-300x224.png", "category": "Grey" }
];"""

# Replace imports
text = text.replace("import { GRANITE_TYPES } from '../../utils/constants';", "")

# Replace CSV_PRODUCTS
start = text.find("const CSV_PRODUCTS = [")
end = text.find("];", start) + 2
text = text[:start] + csv_block + text[end:]

# Replace basic keywords
text = text.replace("export default function Granite", "export default function Sandstone")
text = text.replace("premium quality granite", "premium quality sandstone")
text = text.replace("Granite() {", "Sandstone() {")
text = text.replace('pageKey="granite"', 'pageKey="sandstone"')
text = text.replace("name: 'Granite', path: '/category/granite'", "name: 'Sandstone', path: '/category/sandstone'")
text = text.replace("<h1>Our {categoryFilter !== 'All' ? categoryFilter : ''} Granite Collections</h1>", "<h1>Our {categoryFilter !== 'All' ? categoryFilter : ''} Sandstone Collections</h1>")
text = text.replace("<p>Browse our premium selection of {categoryFilter.toLowerCase()} imported varieties</p>", "<p>Browse our premium selection of {categoryFilter.toLowerCase()} sandstone varieties</p>")
text = text.replace("granite-header", "sandstone-header")

# Maps and options
text = text.replace("const ORIGIN_OPTIONS = [\"South India\", \"North India\", \"Imported\"];", "const TYPE_OPTIONS = [\"Kota Stone\", \"Agra Sandstone\", \"Raj Green Sandstone\", \"Teakwood Sandstone\", \"Dholpur Sandstone\"];")

text = text.replace("""const graniteTypesMap = Object.fromEntries(
  GRANITE_TYPES.map((g) => [g.name.toLowerCase().trim(), g])
);""", "const graniteTypesMap = {};")


text = text.replace("""  const origin = ORIGIN_OPTIONS[index % ORIGIN_OPTIONS.length];""", """  let type = TYPE_OPTIONS[index % TYPE_OPTIONS.length];
  if (csvItem.name.toLowerCase().includes('kota')) type = 'Kota Stone';
  else if (csvItem.name.toLowerCase().includes('agra')) type = 'Agra Sandstone';
  else if (csvItem.name.toLowerCase().includes('raj green')) type = 'Raj Green Sandstone';
  else if (csvItem.name.toLowerCase().includes('teak')) type = 'Teakwood Sandstone';
  else if (csvItem.name.toLowerCase().includes('dholpur')) type = 'Dholpur Sandstone';""")

text = text.replace("origin,", "type,")
text = text.replace("origin:", "type:")

# Filter state
text = text.replace("""const [filters, setFilters] = useState({
    origin: [],""", """const [filters, setFilters] = useState({
    type: [],""")

# search params useEffect
text = text.replace("""const type = searchParams.get('type');
    if (type === 'south') {
      setFilters(prev => ({ ...prev, origin: ['South India'] }));
    } else if (type === 'north') {
      setFilters(prev => ({ ...prev, origin: ['North India'] }));
    } else if (type === 'imported') {
      setFilters(prev => ({ ...prev, origin: ['Imported'] }));
    }""", """const paramType = searchParams.get('type');
    if (paramType === 'kota_stone') {
      setFilters(prev => ({ ...prev, type: ['Kota Stone'] }));
    } else if (paramType === 'agra_sandstone') {
      setFilters(prev => ({ ...prev, type: ['Agra Sandstone'] }));
    } else if (paramType === 'raj_green_sandstone') {
      setFilters(prev => ({ ...prev, type: ['Raj Green Sandstone'] }));
    } else if (paramType === 'teakwood_sandstone') {
      setFilters(prev => ({ ...prev, type: ['Teakwood Sandstone'] }));
    } else if (paramType === 'dholpur_sandstone') {
      setFilters(prev => ({ ...prev, type: ['Dholpur Sandstone'] }));
    }""")

# matches filters
text = text.replace("const matchesOrigin = filters.origin.length === 0 || filters.origin.includes(p.origin);", "const matchesType = filters.type.length === 0 || filters.type.includes(p.type);")
text = text.replace("&& matchesOrigin &&", "&& matchesType &&")


# Sidebar filter logic
sidebar_origin = """              <div className="filter-section">
                <h4>Origin</h4>
                <div className="filter-checkbox-group">
                  {['South India', 'North India', 'Imported'].map(org => (
                    <label key={org} className="filter-checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.origin.includes(org)}
                        onChange={() => handleFilterChange('origin', org)}
                      />
                      {org}
                    </label>
                  ))}
                </div>
              </div>"""

sidebar_type = """              <div className="filter-section">
                <h4>Type</h4>
                <div className="filter-checkbox-group">
                  {TYPE_OPTIONS.map(org => (
                    <label key={org} className="filter-checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.type.includes(org)}
                        onChange={() => handleFilterChange('type', org)}
                      />
                      {org}
                    </label>
                  ))}
                </div>
              </div>"""
              
text = text.replace(sidebar_origin, sidebar_type)

# Active filters display
active_origin = """                  {filters.origin.map(o => (
                    <div key={o} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {o}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('origin', o)}>×</span>
                    </div>
                  ))}"""
                  
active_type = """                  {filters.type.map(o => (
                    <div key={o} style={{ padding: '4px 12px', background: '#f0f0f0', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {o}
                      <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleFilterChange('type', o)}>×</span>
                    </div>
                  ))}"""
                  
text = text.replace(active_origin, active_type)

text = text.replace("filters.origin.length", "filters.type.length")
text = text.replace("filters.origin", "filters.type")
text = text.replace("filters: { origin: [], color: [], touch: [], thickness: [] }", "filters: { type: [], color: [], touch: [], thickness: [] }")
text = text.replace("setFilters({ origin: [], color: [], touch: [], thickness: [] })", "setFilters({ type: [], color: [], touch: [], thickness: [] })")

with open("c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/pages/categories/Sandstone.jsx", "w", encoding="utf8") as f:
    f.write(text)
