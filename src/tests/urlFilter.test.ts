import { UrlFilter } from '../filter/urlFilter';

describe('UrlFilter', () => {
  const disallowedPaths = ['/private/*', '/tmp/*', '/search?*'];
  const productPatterns = [
    'product',
    'item',
    'sku',
    'shop',
    'buy',
    'detail',
    'store',
    '/p/',
    '/products/',
    '/product/\\d+$',
    '\\?productId=',
    '\\?sku=',
    '\\?itemId='
  ];

  it('should allow URLs not matching disallowed paths', () => {
    const filter = new UrlFilter(disallowedPaths, productPatterns);
    expect(filter.isUrlAllowed('https://example.com/page1')).toBe(true);
    expect(filter.isUrlAllowed('https://example.com/public/page')).toBe(true);
  });

  it('should disallow URLs matching disallowed paths', () => {
    const filter = new UrlFilter(disallowedPaths, productPatterns);
    expect(filter.isUrlAllowed('https://example.com/private/page')).toBe(false);
    expect(filter.isUrlAllowed('https://example.com/tmp/file')).toBe(false);
    expect(filter.isUrlAllowed('https://example.com/search?q=test')).toBe(false);
  });

  it('should identify product URLs', () => {
    const filter = new UrlFilter(disallowedPaths, productPatterns);
    expect(filter.isProductUrl('https://example.com/product/123')).toBe(true);
    expect(filter.isProductUrl('https://example.com/p/item-name')).toBe(true);
    expect(filter.isProductUrl('https://example.com/sku/456')).toBe(true);
    expect(filter.isProductUrl('https://example.com/shop/buy-now')).toBe(true);
    expect(filter.isProductUrl('https://example.com/products/item-name')).toBe(true);
    expect(filter.isProductUrl('https://example.com/item/67890')).toBe(true);
    expect(filter.isProductUrl('https://example.com/page1')).toBe(false); // Ensure non-product URLs are excluded
    expect(filter.isProductUrl('https://example.com/?productId=123')).toBe(true);
    expect(filter.isProductUrl('https://example.com/?sku=456')).toBe(true);
    expect(filter.isProductUrl('https://example.com/?itemId=789')).toBe(true);
  });

  it('should handle empty disallowed paths and product patterns', () => {
    const filter = new UrlFilter([], []);
    expect(filter.isUrlAllowed('https://example.com/page1')).toBe(true);
    expect(filter.isProductUrl('https://example.com/page1')).toBe(false);
  });
});
