const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src', function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/Add to Cart/g, 'Add to Quote');
    content = content.replace(/Remove from Cart/g, 'Remove from Quote');
    content = content.replace(/from=cart/g, 'from=quote');
    content = content.replace(/fromCart/g, 'fromQuote'); 
    content = content.replace(/'Cart'/g, "'Quote'");
    content = content.replace(/"Cart"/g, '"Quote"');
    content = content.replace(/`Cart \(/g, "`Quote \(");
    content = content.replace(/=== 'cart'/g, "=== 'quote'");

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated ' + filePath);
    }
  }
});
