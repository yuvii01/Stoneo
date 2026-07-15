const fs = require('fs');
const combined = JSON.parse(fs.readFileSync('./combined_marbles.json', 'utf8'));
let code = fs.readFileSync('./src/pages/categories/Granite.jsx', 'utf8');

// Replace CSV_PRODUCTS
const newCSVProducts = combined.indian + '\n' + combined.imported;
code = code.replace(/const CSV_PRODUCTS = \[([\s\S]*?)\];/, 'const CSV_PRODUCTS = [' + newCSVProducts + '];');

// Replace names
code = code.replace(/Granite/g, 'Marble');
code = code.replace(/granite/g, 'marble');
code = code.replace(/GRANITE/g, 'MARBLE');

// Customize arrays
code = code.replace(/const ORIGIN_OPTIONS = \[.*?\];/, 'const ORIGIN_OPTIONS = ["Makrana", "Dungri", "Italian", "Carrara", "Statuario", "Banswara", "Ambaji", "Agaria"];');
code = code.replace(/const TOUCH_OPTIONS = \[.*?\];/, 'const TOUCH_OPTIONS = ["Polished", "Honed", "Leathered", "Brushed", "Bush-Hammered", "Sandblasted"];');

// Update Touch UI checkboxes
code = code.replace(/\{.*?Polished.*?Sandblasted.*?\}/, '{["Polished", "Honed", "Leathered", "Brushed", "Bush-Hammered", "Sandblasted"].map(tch => (');

// Update Origin UI checkboxes
code = code.replace(/\{.*?South India.*Imported.*?\}/, '{["Makrana", "Dungri", "Italian", "Carrara", "Statuario", "Banswara", "Ambaji", "Agaria"].map(org => (');

// Update color swatches map in JSX
code = code.replace(/\{\s*name:\s*'Black',\s*hex:\s*'#000000'\s*\}(?:[\s\S]*?)\{\s*name:\s*'Orange',\s*hex:\s*'#ffa500'\s*\}/, 
`{ name: 'White', hex: '#ffffff' },
{ name: 'Black', hex: '#000000' },
{ name: 'Green', hex: '#2e8b57' },
{ name: 'Pink', hex: '#ffc0cb' },
{ name: 'Brown', hex: '#8b4513' },
{ name: 'Grey', hex: '#808080' },
{ name: 'Yellow', hex: '#ffd700' },
{ name: 'Beige', hex: '#f5f5dc' },
{ name: 'Red', hex: '#ff0000' },
{ name: 'Blue', hex: '#0000ff' }`);

fs.writeFileSync('./src/pages/categories/Marble.jsx', code);
