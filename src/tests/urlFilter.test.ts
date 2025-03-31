import { UrlFilter } from '../filter/urlFilter';

describe('UrlFilter', () => {
  it('should allow URLs not in the disallowed paths', () => {
    const disallowedPaths = ['/private', '/tmp'];
    const filter = new UrlFilter(disallowedPaths);

    expect(filter.isUrlAllowed('https://example.com/page1')).toBe(true);
    expect(filter.isUrlAllowed('https://example.com/public/page')).toBe(true);
  });

  it('should disallow URLs in the disallowed paths', () => {
    const disallowedPaths = ['/private', '/tmp'];
    const filter = new UrlFilter(disallowedPaths);

    expect(filter.isUrlAllowed('https://example.com/private/page')).toBe(false);
    expect(filter.isUrlAllowed('https://example.com/tmp/file')).toBe(false);
    expect(filter.isUrlAllowed('https://example.com/search?q=test')).toBe(true);
  });

  it('should identify product URLs correctly', () => {
    const filter = new UrlFilter();

    expect(filter.isProductUrl('https://example.com/product/123')).toBe(true);
    expect(filter.isProductUrl('https://example.com/item/456')).toBe(true);
    expect(filter.isProductUrl('https://example.com/page')).toBe(false);
  });
});
