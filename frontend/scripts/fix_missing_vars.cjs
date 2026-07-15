const fs = require('fs');
let code = fs.readFileSync('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/pages/categories/Sandstone.jsx', 'utf8');

const missingLines = `];

const DEFAULT_DESCRIPTION = 'premium quality sandstone, sourced from verified quarries.';
const DEFAULT_FEATURES = ['Natural stone finish', 'Scratch resistant', 'Easy to maintain'];

// Build Lookup Map
const graniteTypesMap = {};

const TOUCH_OPTIONS = ["Polished", "Honed", "Leather", "Flamed", "Lapato", "Bush Hammered", "Antique", "Sandblasted"];
const TYPE_OPTIONS = ["Kota Stone", "Agra Sandstone", "Raj Green Sandstone", "Teakwood Sandstone", "Dholpur Sandstone"];
const THICKNESS_RANGE = [16, 18, 20, 22, 24, 26, 28, 30];

`;

code = code.replace(/\{ name: 'Kota Stone'[^\n]*\n\/\/ Merge Data/m, `{ name: 'Kota Stone', image: 'https://www.bhandarimarblecompany.com/wp-content/uploads/2024/05/Kota-stone-300x224.png', category: 'Grey' }\n` + missingLines + `// Merge Data`);

fs.writeFileSync('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/pages/categories/Sandstone.jsx', code);
