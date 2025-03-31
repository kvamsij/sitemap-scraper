import { ProductSitemapFilter } from '../filter/productSitemapFilter';

describe('ProductSitemapFilter', () => {
  const sitemapUrls = [
    'https://example.com/sitemap.xml',
    'https://example.com/product-sitemap.xml',
    'https://example.com/category-sitemap.xml',
    'https://example.com/product-feed.xml',
  ];

  it('should filter product-specific sitemaps', () => {
    const filter = new ProductSitemapFilter(sitemapUrls);
    const productSitemaps = filter.getProductSitemaps();

    expect(productSitemaps).toEqual([
      'https://example.com/product-sitemap.xml',
      'https://example.com/product-feed.xml',
    ]);
  });

  it('should return an empty array if no product-specific sitemaps exist', () => {
    const nonProductSitemaps = [
      'https://example.com/sitemap.xml',
      'https://example.com/category-sitemap.xml',
    ];
    const filter = new ProductSitemapFilter(nonProductSitemaps);
    const productSitemaps = filter.getProductSitemaps();

    expect(productSitemaps).toEqual([]);
  });
});
