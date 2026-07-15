const fs = require('fs');

let sandstone = fs.readFileSync('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/pages/categories/Granite.jsx', 'utf8');

const csvProductsBlock = `const CSV_PRODUCTS = [
  { name: 'Agra Red Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/agra-red/agra-red-sawn-wet-sandstone-tiles.jpg', category: 'Red' },
  { name: 'Autumn Brown Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/autumn-brown/automn-brown-sandstone-honed-surface-cut-to-size-tiles.jpg', category: 'Brown' },
  { name: 'Bansi Pink Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/bansi-pink/bansi-pink-sandstone-honed-finish-tiles.jpg', category: 'Pink' },
  { name: 'Camel Dust Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/camel-dust/camel-dust-sandstone-natural-paving-tiles.jpg', category: 'Beige' },
  { name: 'Chocolate Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/chocolate/chocolate-sandstone-natural-finish-calibrated-tiles.jpg', category: 'Brown' },
  { name: 'Sagar Black Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/sagar-black/sagar-black-natural-wet-sandstone-paving-exterior-tiles.jpg', category: 'Black' },
  { name: 'Dholpur Beige Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/dholpur-beige/dholpur-beige-sandstone-natural-finish-tiles.jpg', category: 'Beige' },
  { name: 'Modak Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/modak/modak-sandstone-natural-surface-hand-split-tiles.jpg', category: 'Brown' },
  { name: 'Mandana Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/mandana/mandana-red-sandstone-natural-tile-exporter-india.jpg', category: 'Red' },
  { name: 'Jodhpur Pink Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/jodhpur-pink/jodhpur-pink-sandstone-honed-tiles.jpg', category: 'Pink' },
  { name: 'Jodhpur Brown Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/jodhpur-brown/jodhpur-brown-sandstone-honed-finish-tiles.jpg', category: 'Brown' },
  { name: 'Jaisalmer Yellow Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/jaisalmer-yellow/jaisalmer-yellow-sandstone-honed-polished-cut-to-size-tiles.jpg', category: 'Yellow' },
  { name: 'Mint Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/mint/white-mint-natural-split-surface-sandstone-tile.jpg', category: 'Green' },
  { name: 'Yellow Mint Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/yellow-mint/yellow-mint-sandstone-natural-finish-calibrated-tiles.jpg', category: 'Yellow' },
  { name: 'Pink Mint Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/pink-mint/pink-mint-sandstone-cut-to-size-natural-tiles.jpg', category: 'Pink' },
  { name: 'Lalitpur Grey Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/lalitpur-grey/lalitpur-grey-sandstone-natural-patio-pack-tiles.jpg', category: 'Grey' },
  { name: 'Lalitpur Yellow Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/lalitpur-yellow/lalitpur-yellow-sandstone-natural-split-finish-tiles.jpg', category: 'Yellow' },
  { name: 'Raveena Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/raveena/raveena-sandstone-natural-paving-tile-setts.jpg', category: 'Brown' },
  { name: 'Kandla Grey Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/kandla-grey/kandla-grey-sandstone-natural-finish-tiles.jpg', category: 'Grey' },
  { name: 'Raj Green Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/raj-green/raj-green-natural-sandstone-floor-covering-tiles.jpg', category: 'Green' },
  { name: 'Fossil Mint Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/fossil-mint/fossil-mint-sandstone-paving-tiles.jpg', category: 'Green' },
  { name: 'Teak Wood Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/teak-wood/teakwood-sandstone-honed-paving-tiles.jpg', category: 'Brown' },
  { name: 'Rainbow Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/rainbow/rainbow-sandstone-swan-finish-paving-tiles.jpg', category: 'Multicolor' },
  { name: 'Panther Sandstone', image: 'https://www.royalindianstones.com/assets/img/products/sandstone/panther/panter-sandstone-patio-pack-paving-tiles.jpg', category: 'Brown' },
  { name: 'Kota Stone', image: 'https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Kota-stone-300x224.png', category: 'Grey' }
];`;

sandstone = sandstone.replace(/const CSV_PRODUCTS = \[[\s\S]*?\n\];/m, csvProductsBlock);

sandstone = sandstone.replace(/export default function Granite/g, 'export default function Sandstone');
sandstone = sandstone.replace(/const ORIGIN_OPTIONS = \["South India", "North India", "Imported"\];/g, 'const TYPE_OPTIONS = ["Kota Stone", "Agra Sandstone", "Raj Green Sandstone", "Teakwood Sandstone", "Dholpur Sandstone"];');

sandstone = sandstone.replace(/const origin = ORIGIN_OPTIONS\[index % ORIGIN_OPTIONS\.length\];/g, `
  let type = TYPE_OPTIONS[index % TYPE_OPTIONS.length];
  if (csvItem.name.toLowerCase().includes('kota')) type = 'Kota Stone';
  else if (csvItem.name.toLowerCase().includes('agra')) type = 'Agra Sandstone';
  else if (csvItem.name.toLowerCase().includes('raj green')) type = 'Raj Green Sandstone';
  else if (csvItem.name.toLowerCase().includes('teak')) type = 'Teakwood Sandstone';
  else if (csvItem.name.toLowerCase().includes('dholpur')) type = 'Dholpur Sandstone';
`);

sandstone = sandstone.replace(/origin,/g, 'type,');
sandstone = sandstone.replace(/origin:/g, 'type:');
sandstone = sandstone.replace(/filters\.origin\.includes/g, 'filters.type.includes');

// Replace the filter state
sandstone = sandstone.replace(/const \[filters, setFilters\] = useState\(\{\n    origin: \[\]/g, 'const [filters, setFilters] = useState({\n    type: []');
    
// Replace useEffect for search params
sandstone = sandstone.replace(/const type = searchParams\.get\('type'\);[\s\S]*?\}, \[searchParams\]\);/m, `const paramType = searchParams.get('type');
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
    }
  }, [searchParams]);`);
  
sandstone = sandstone.replace(/const matchesOrigin = filters\.origin\.length === 0 \|\| filters\.type\.includes\(p\.type\);/g, 'const matchesType = filters.type.length === 0 || filters.type.includes(p.type);');
sandstone = sandstone.replace(/&& matchesOrigin &&/g, '&& matchesType &&');

sandstone = sandstone.replace(/pageKey="granite"/g, 'pageKey="sandstone"');
sandstone = sandstone.replace(/name: 'Granite', path: '\/category\/granite'/g, 'name: \'Sandstone\', path: \'/category/sandstone\'');
sandstone = sandstone.replace(/<h1>Our \{categoryFilter !== 'All' \? categoryFilter : ''\} Granite Collections<\/h1>/g, '<h1>Our {categoryFilter !== \'All\' ? categoryFilter : \'\'} Sandstone Collections</h1>');
sandstone = sandstone.replace(/<p>Browse our premium selection of \{categoryFilter\.toLowerCase\(\)\} imported varieties<\/p>/g, '<p>Browse our premium selection of {categoryFilter.toLowerCase()} sandstone varieties</p>');
sandstone = sandstone.replace(/granite-header/g, 'sandstone-header');

sandstone = sandstone.replace(/<h4>Origin<\/h4>[\s\S]*?<h5 style=\{\{ fontSize: '14px', margin: '10px 0', color: '#555' \}\}>Imported<\/h5>/m, `<h4>Type</h4>
                <div className="filter-checkbox-group" style={{ marginBottom: '15px' }}>
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
                <div style={{ display: 'none' }}><h5 style={{ fontSize: '14px', margin: '10px 0', color: '#555' }}>Imported</h5>`);
                
sandstone = sandstone.replace(/<\/label>\n                  \}\)\}\n                <\/div>[\s\S]*?<h5 style=\{\{ fontSize: '14px', margin: '10px 0', color: '#555' \}\}>Indian<\/h5>[\s\S]*?<\/label>\n                  \}\)\}\n                <\/div>\n              <\/div>/m, '</div></div>');

sandstone = sandstone.replace(/filters\.origin\.map\(o => \(\n                      <span key=\{o\} className="active-filter-tag">\n                        Origin: \{o\}\n                        <button onClick=\{\(\) => handleFilterChange\('origin', o\)\}>×<\/button>\n                      <\/span>\n                    \)\)/m, `filters.type.map(o => (
                      <span key={o} className="active-filter-tag">
                        Type: {o}
                        <button onClick={() => handleFilterChange('type', o)}>×</button>
                      </span>
                    ))`);
                    
sandstone = sandstone.replace(/premium quality granite/gi, 'premium quality sandstone');
sandstone = sandstone.replace(/Granite\(\) \{/g, 'Sandstone() {');
sandstone = sandstone.replace(/import \{ GRANITE_TYPES \} from '\.\.\/\.\.\/utils\/constants';/g, '');
sandstone = sandstone.replace(/const graniteTypesMap = Object\.fromEntries\(\n  GRANITE_TYPES\.map\(\(g\) => \[g\.name\.toLowerCase\(\)\.trim\(\), g\]\)\n\);/g, 'const graniteTypesMap = {};');
sandstone = sandstone.replace(/filters\.origin/g, 'filters.type');
sandstone = sandstone.replace(/&& matchesOrigin/g, '&& matchesType');
sandstone = sandstone.replace(/const matchesOrigin = filters\.type\.length === 0 \|\| filters\.type\.includes\(p\.type\);/g, 'const matchesType = filters.type.length === 0 || filters.type.includes(p.type);');

fs.writeFileSync('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/pages/categories/Sandstone.jsx', sandstone);
