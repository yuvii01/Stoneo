const fs = require('fs');
let content = fs.readFileSync('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/pages/categories/PavingAndLandscape.jsx', 'utf8');

const regex = /const newCategories = new Set\(\[\.\.\.prev\.category, \.\.\.groupCategories\]\);\n        return \{ \.\.\.prev, category: Array\.from\(newCategories\) \};\n      \}\n    \}\);\n  const paginatedProducts = filteredProducts\.slice\(startIndex, endIndex\);/

const replacement = `const newCategories = new Set([...prev.category, ...groupCategories]);
        return { ...prev, category: Array.from(newCategories) };
      }
    });
  };

  // 3. Filtered List Logic
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(p => {
      const matchesUrlCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesType = filters.category.length === 0 || filters.category.includes(p.category);
      const matchesColor = filters.color.length === 0 || filters.color.includes(p.color);
      const matchesThickness = filters.thickness.length === 0 || filters.thickness.some(th => p.thickness.includes(th));

      return matchesUrlCategory && matchesType && matchesColor && matchesThickness;
    });
  }, [categoryFilter, filters]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);`;

content = content.replace(regex, replacement);
fs.writeFileSync('c:/Users/yuvra/OneDrive/Desktop/Stoneo/frontend/src/pages/categories/PavingAndLandscape.jsx', content, 'utf8');
