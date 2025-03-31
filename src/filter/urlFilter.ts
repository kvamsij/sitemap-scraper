export class UrlFilter {
  private disallowedPaths: string[];
  private productPatterns: string[];

  constructor(
    disallowedPaths: string[],
    productPatterns: string[] = [
      'product',
      'item',
      'sku',
      'shop',
      'buy',
      'detail',
      'store',
      '/p/',
      '/products/',
      '\\d+$', // URLs ending with numeric IDs
      '\\?productId=',
      '\\?sku=',
      '\\?itemId='
    ]
  ) {
    this.disallowedPaths = disallowedPaths;
    this.productPatterns = productPatterns;
  }

  public isUrlAllowed(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const fullPath = urlObj.pathname + urlObj.search; // Include query string in the path
      for (const path of this.disallowedPaths) {
        const regex = new RegExp(
          '^' +
            path
              .replace(/\*/g, '.*') // Convert wildcard (*) to regex (.*)
              .replace(/\?/g, '.') + // Convert wildcard (?) to regex (.)
            '$'
        );
        if (regex.test(fullPath)) {
          return false; // URL matches a disallowed path
        }
      }
      return true; // URL is allowed
    } catch (error) {
      console.error(`Invalid URL: ${url}`);
      return false; // Treat invalid URLs as disallowed
    }
  }

  public isProductUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const fullPath = urlObj.pathname + urlObj.search; // Include query string in the path

      // Refine patterns to avoid false positives
      const refinedPatterns = [
        '/product/\\d+', // URLs like /product/12345
        '/item/\\d+', // URLs like /item/67890
        '/sku/\\d+', // URLs like /sku/456
        '/shop/', // URLs containing /shop/
        '/buy/', // URLs containing /buy/
        '/detail/', // URLs containing /detail/
        '/store/', // URLs containing /store/
        '/p/', // URLs containing /p/
        '/products/', // URLs containing /products/
        '\\?productId=\\d+', // Query parameter ?productId=123
        '\\?sku=\\d+', // Query parameter ?sku=456
        '\\?itemId=\\d+' // Query parameter ?itemId=789
      ];

      return refinedPatterns.some((pattern) => {
        const regex = new RegExp(pattern, 'i'); // Case-insensitive matching
        return regex.test(fullPath);
      });
    } catch (error) {
      console.error(`Invalid URL: ${url}`);
      return false; // Treat invalid URLs as non-product URLs
    }
  }
}
