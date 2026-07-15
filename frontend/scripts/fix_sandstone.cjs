const fs = require('fs');

let sandstone = fs.readFileSync('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/pages/categories/Sandstone.jsx', 'utf8');

sandstone = sandstone.replace(/<h4>Origin<\/h4>\s*<div className="filter-checkbox-group">\s*\{\['South India', 'North India', 'Imported'\]\.map\(org => \([\s\S]*?<label key=\{org\} className="filter-checkbox-label">\s*<input\s*type="checkbox"\s*checked=\{filters\.type\.includes\(org\)\}\s*onChange=\{\(\) => handleFilterChange\('origin', org\)\}\s*\/>\s*\{org\}\s*<\/label>\s*\)\)\}\s*<\/div>\s*<\/div>/m, `<div className="filter-section">
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
              </div>`);

sandstone = sandstone.replace(/<div className="filter-section">\s*<div className="filter-section">/g, '<div className="filter-section">');

sandstone = sandstone.replace(/\{filters\.origin\.map\(o => \([\s\S]*?<span key=\{o\} className="active-filter-tag\">[\s\S]*?Origin: \{o\}[\s\S]*?<button onClick=\{\(\) => handleFilterChange\('origin', o\)\}>×<\/button>[\s\S]*?<\/span>[\s\S]*?\)\)\}/m, `{filters.type.map(o => (
                      <span key={o} className="active-filter-tag">
                        Type: {o}
                        <button onClick={() => handleFilterChange('type', o)}>×</button>
                      </span>
                    ))}`);

fs.writeFileSync('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/pages/categories/Sandstone.jsx', sandstone);
