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
    let changed = false;

    if (content.includes('Add to Demands')) {
      content = content.replace(/Add to Demands/g, 'Add to Cart');
      changed = true;
    }
    
    // Pattern: Added! <span ...>X</span>
    const regex1 = /\(\s*<span[^>]*>\s*Added!\s*<span[^>]*>[^<]*<\/span>\s*<\/span>\s*\)/g;
    if (regex1.test(content)) {
      content = content.replace(regex1, '"Remove from Cart"');
      changed = true;
    }
    
    const regex3 = /"Added!"/g;
    if (regex3.test(content)) {
      content = content.replace(regex3, '"Remove from Cart"');
      changed = true;
    }

    const regex2 = /backgroundColor:\s*'#4CAF50'/g;
    if (regex2.test(content)) {
      content = content.replace(regex2, "backgroundColor: '#d9534f'");
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated ' + filePath);
    }
  }
});
