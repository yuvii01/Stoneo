import { Helmet } from 'react-helmet-async';
import { getPageSEO, SEO_CONFIG } from '../utils/seo';

/**
 * SEO Head Component
 * Manages meta tags, title, and canonical URLs for each page
 */
export default function SEOHead({ 
  pageKey,
  title,
  description,
  keywords,
  image,
  author,
  published,
  updated,
  structured 
}) {
  // Get default page metadata
  let seo = getPageSEO(pageKey);

  // Allow overrides
  if (title) seo.title = title;
  if (description) seo.description = description;
  if (keywords) seo.keywords = keywords;
  if (image) seo.ogImage = image;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seo.title}</title>
      <meta name="title" content={seo.title} />
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seo.canonical} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={seo.ogType} />
      <meta property="og:url" content={seo.ogUrl} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.ogImage} />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seo.ogUrl} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.ogImage} />
      
      {/* Article Metadata (if applicable) */}
      {author && <meta name="author" content={author} />}
      {published && <meta property="article:published_time" content={published} />}
      {updated && <meta property="article:modified_time" content={updated} />}
      
      {/* Structured Data / JSON-LD */}
      {structured && (
        <script type="application/ld+json">
          {JSON.stringify(structured)}
        </script>
      )}
    </Helmet>
  );
}
