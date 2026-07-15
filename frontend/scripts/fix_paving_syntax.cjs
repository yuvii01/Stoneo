const fs = require('fs');
let text = fs.readFileSync('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/pages/categories/PavingAndLandscape.jsx', 'utf8');

// The file currently has a broken map closure.
// Let's just find where 'const ALL_PRODUCTS = PAVING_PRODUCTS.map...' starts
// and find 'export default function PavingAndLandscape' and replace everything in between.

const regex = /const ALL_PRODUCTS = PAVING_PRODUCTS\.map\([\s\S]*?export default function PavingAndLandscape\(\)/;
const replacement = `const ALL_PRODUCTS = PAVING_PRODUCTS.map((csvItem, index) => {
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

export default function PavingAndLandscape()`;

text = text.replace(regex, replacement);
fs.writeFileSync('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/pages/categories/PavingAndLandscape.jsx', text, 'utf8');
