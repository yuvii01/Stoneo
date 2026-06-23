/**
 * SEO Configuration for KMStoneX
 * Manages meta tags, canonical URLs, and structured data
 */

export const SEO_CONFIG = {
  siteName: 'Stoneo India', // 'KMStoneX',
  baseUrl: 'https://stoneo.in', // 'https://kmstonex.in',
  siteDescription: 'Premium granite, marble, and natural stone supplier in India. Expert suppliers for residential and commercial projects.',
  defaultImage: 'https://example.com/og-image.png', // 'https://kmstonex.in/og-image.png',
  phone: '+91-1234567890', // '+91-XXXXXXXXXX',
  email: 'demo@example.com', // 'contact@kmstonex.in',
  socialLinks: {
    facebook: 'https://www.facebook.com/demo', // 'https://www.facebook.com/kmstonex',
    instagram: 'https://www.instagram.com/demo', // 'https://www.instagram.com/kmstonex',
    linkedin: 'https://www.linkedin.com/company/demo', // 'https://www.linkedin.com/company/kmstonex',
  },
};

export const PAGE_METADATA = {
  home: {
    title: 'KMStoneX - Premium Granite, Marble & Natural Stone Supplier in India',
    description: 'Buy premium quality granite, marble, sandstone & tiles at KMStoneX. Expert stone supplier for residential & commercial projects. Get best prices on imported & Indian marble.',
    keywords: 'granite supplier, marble supplier, sandstone, tiles, natural stone, granite in india, marble in india, stone supplier',
    path: '/',
  },
  about: {
    title: 'About KMStoneX - Natural Stone Experts | Quality & Reliability',
    description: 'Learn about KMStoneX - your trusted stone supplier. Discover our commitment to quality, expertise, and customer satisfaction since 2020.',
    keywords: 'about kmstonex, stone supplier, natural stone experts, granite marble supplier',
    path: '/about',
  },
  granite: {
    title: 'Premium Granite Supplier - Best Quality & Prices | KMStoneX',
    description: 'Explore our premium collection of granite varieties. From classic to exotic designs, find the perfect granite for your project. Expert guidance & competitive prices.',
    keywords: 'granite supplier, granite types, granite prices, black granite, granite tiles, premium granite',
    path: '/category/granite',
  },
  marbleImported: {
    title: 'Imported Marble Supplier - International Varieties | KMStoneX',
    description: 'Premium imported marble from around the world. Italian marble, Portuguese marble, Turkish marble & more. Perfect for luxury projects and high-end finishes.',
    keywords: 'imported marble, italian marble, marble supplier, international marble, marble tiles',
    path: '/category/Imported_Marble',
  },
  marbleIndian: {
    title: 'Indian Marble Supplier - Best Quality & Affordable Prices | KMStoneX',
    description: 'High-quality Indian marble at the best prices. Rajasthan marble, Makrana marble, and more. Ideal for all residential and commercial applications.',
    keywords: 'indian marble, rajasthan marble, makrana marble, marble supplier india, domestic marble',
    path: '/category/Indian_Marble',
  },
  sandstone: {
    title: 'Sandstone Supplier - Natural Beauty for Your Project | KMStoneX',
    description: 'Premium quality sandstone for outdoor and indoor applications. Durable, beautiful, and cost-effective. Perfect for landscaping, facades, and interior design.',
    keywords: 'sandstone supplier, sandstone tiles, natural sandstone, landscape sandstone, outdoor stone',
    path: '/category/sandstone',
  },
  getQuote: {
    title: 'Get Quote - Stone Pricing & Estimates | KMStoneX',
    description: 'Request a personalized quote for your stone project. Get competitive pricing on granite, marble, sandstone, and tiles. Fast response guaranteed.',
    keywords: 'get quote, stone pricing, estimate, stone supplier quote, granite price marble price',
    path: '/get-quote',
  },
};

/**
 * Generate SEO meta tags for a page
 * @param {string} pageKey - Key from PAGE_METADATA
 * @param {object} overrides - Override default metadata
 * @returns {object} Meta tag configuration
 */
export const getPageSEO = (pageKey, overrides = {}) => {
  const page = PAGE_METADATA[pageKey] || PAGE_METADATA.home;
  const full = { ...page, ...overrides };

  return {
    title: full.title,
    description: full.description,
    keywords: full.keywords,
    canonical: `${SEO_CONFIG.baseUrl}${full.path}`,
    ogType: 'website',
    ogImage: full.image || SEO_CONFIG.defaultImage,
    ogUrl: `${SEO_CONFIG.baseUrl}${full.path}`,
  };
};

/**
 * Generate Organization Schema for structured data
 */
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SEO_CONFIG.siteName,
  url: SEO_CONFIG.baseUrl,
  logo: `${SEO_CONFIG.baseUrl}/logo.png`,
  description: SEO_CONFIG.siteDescription,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    telephone: SEO_CONFIG.phone,
    email: SEO_CONFIG.email,
  },
  sameAs: Object.values(SEO_CONFIG.socialLinks),
});

/**
 * Generate LocalBusiness Schema
 */
export const getLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': SEO_CONFIG.baseUrl,
  name: SEO_CONFIG.siteName,
  url: SEO_CONFIG.baseUrl,
  telephone: SEO_CONFIG.phone,
  email: SEO_CONFIG.email,
  description: SEO_CONFIG.siteDescription,
  image: SEO_CONFIG.defaultImage,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
  sameAs: Object.values(SEO_CONFIG.socialLinks),
});

/**
 * Generate Product Schema for stone categories
 */
export const getProductSchema = (productName, description, image) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: productName,
  description: description,
  image: image,
  brand: {
    '@type': 'Brand',
    name: SEO_CONFIG.siteName,
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.5',
    reviewCount: '100',
  },
});

/**
 * Format URL for breadcrumbs
 */
export const getBreadcrumbSchema = (breadcrumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${SEO_CONFIG.baseUrl}${item.path}`,
  })),
});
