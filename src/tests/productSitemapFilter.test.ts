import { ProductSitemapFilter } from '../filter/productSitemapFilter';

describe('ProductSitemapFilter', () => {
  const sitemapUrls = [
    'https://example.com/sitemap.xml',
    'https://example.com/sitemap_products_1.xml?from=123&to=456',
    'https://example.com/sitemap_pages_1.xml',
    'https://example.com/sitemap_products_2.xml',
    'https://example.com/sitemap_blogs_1.xml',
  ];

  it('should filter product-specific sitemaps', () => {
    const filter = new ProductSitemapFilter(sitemapUrls);
    const productSitemaps = filter.getProductSitemaps();

    expect(productSitemaps).toEqual([
      'https://example.com/sitemap_products_1.xml?from=123&to=456',
      'https://example.com/sitemap_products_2.xml',
    ]);
  });

  it('should return an empty array if no product-specific sitemaps exist', () => {
    const nonProductSitemaps = [
      'https://example.com/sitemap.xml',
      'https://example.com/sitemap_pages_1.xml',
      'https://example.com/sitemap_blogs_1.xml',
    ];
    const filter = new ProductSitemapFilter(nonProductSitemaps);
    const productSitemaps = filter.getProductSitemaps();

    expect(productSitemaps).toEqual([]);
  });
});
