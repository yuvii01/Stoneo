const fs = require('fs');
let content = fs.readFileSync('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/pages/categories/PavingAndLandscape.jsx', 'utf8');

// Update ALL_PRODUCTS map
const allProductsRegex = /const ALL_PRODUCTS = PAVING_PRODUCTS\.map\(\(csvItem, index\) => \{[\s\S]*?return \{/;
const replacementMap = `const ALL_PRODUCTS = PAVING_PRODUCTS.map((csvItem, index) => {
  const nameLower = csvItem.name.toLowerCase();
  
  let color = 'Grey'; // default
  for (let c of COLOR_OPTIONS) {
    if (nameLower.includes(c.toLowerCase())) {
      color = c;
      break;
    }
  }

  // Determine Subcategory
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

  const thickness = [];
  const numThickness = (index % 3) + 2;
  for (let i = 0; i < numThickness; i++) {
    thickness.push(THICKNESS_RANGE[(index + i) % THICKNESS_RANGE.length]);
  }

  return {`;
content = content.replace(allProductsRegex, replacementMap);

// Update return to return subCat instead of category
content = content.replace(/category: csvItem\.category \|\| 'Stones',/, "category: subCat,");

// Update useEffect searchParams logic
const searchParamsRegex = /useEffect\(\(\) => \{[\s\S]*?\}, \[searchParams\]\);/;
const replacementParams = `useEffect(() => {
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
content = content.replace(searchParamsRegex, replacementParams);

// Update the Sidebar JSX for Type
const sidebarTypeRegex = /<h4>Type<\/h4>[\s\S]*?<\/div>\n              <\/div>/;
const replacementSidebar = `<h4>Type</h4>
                
                <div className="filter-subcategory-group" style={{marginBottom: '15px'}}>
                  <h5 style={{fontSize:'14px', marginBottom:'8px', color:'#333', fontWeight: 'bold'}}>Cobbles &rsaquo;</h5>
                  {['Granite Cobbles', 'Sandstone Cobbles', 'Limestone Cobbles'].map(cat => (
                    <label key={cat} className="filter-checkbox-label" style={{marginLeft: '10px'}}>
                      <input type="checkbox" checked={filters.category.includes(cat)} onChange={() => handleFilterChange('category', cat)} />
                      {cat}
                    </label>
                  ))}
                </div>

                <div className="filter-subcategory-group" style={{marginBottom: '15px'}}>
                  <h5 style={{fontSize:'14px', marginBottom:'8px', color:'#333', fontWeight: 'bold'}}>Brick & Travertine &rsaquo;</h5>
                  {['Paving Bricks', 'Sandstone Pavers', 'Travertine Pavers'].map(cat => (
                    <label key={cat} className="filter-checkbox-label" style={{marginLeft: '10px'}}>
                      <input type="checkbox" checked={filters.category.includes(cat)} onChange={() => handleFilterChange('category', cat)} />
                      {cat}
                    </label>
                  ))}
                </div>

                <div className="filter-subcategory-group" style={{marginBottom: '15px'}}>
                  <h5 style={{fontSize:'14px', marginBottom:'8px', color:'#333', fontWeight: 'bold'}}>Stones & Others &rsaquo;</h5>
                  {['Landscaping Pebbles', 'Stepping Stones'].map(cat => (
                    <label key={cat} className="filter-checkbox-label" style={{marginLeft: '10px'}}>
                      <input type="checkbox" checked={filters.category.includes(cat)} onChange={() => handleFilterChange('category', cat)} />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>`;
content = content.replace(sidebarTypeRegex, replacementSidebar);

fs.writeFileSync('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/pages/categories/PavingAndLandscape.jsx', content, 'utf8');
console.log('Done mapping subcategories!');
