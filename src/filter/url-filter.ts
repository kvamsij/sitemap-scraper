export interface UrlFilterStrategy {
  isProductUrl(url: string): boolean;
}

export class UrlFilter {
  private disallowedPaths: string[];
  private productUrlPatterns: RegExp[];

  constructor(disallowedPaths: string[] = [], productUrlPatterns: string[] = []) {
    // Add common disallowed paths like /blog/, /faq/, etc.
    const defaultDisallowedPaths = ['/blog/', '/faq/', '/contact', '/about', '/terms', '/privacy'];
    this.disallowedPaths = [...defaultDisallowedPaths, ...disallowedPaths];

    // Default patterns for product URLs
    const defaultPatterns = [
      '/p/', // Common product path
      '/product/', // Explicit "product" path
      '/item/', // Explicit "item" path
      '/shop/', // Explicit "shop" path
      '/detail/', // Explicit "detail" path
      '/sku/', // SKU-based paths
      '\\d{5,}', // Numeric IDs (e.g., /12345/)
      '\\w{5,}', // Alphanumeric IDs (e.g., /abc123/)
      '\\?product_id=', // Query parameter for product ID
      '\\?sku=', // Query parameter for SKU
      '\\?item=', // Query parameter for item
    ];

    // Combine default patterns with user-provided patterns
    this.productUrlPatterns = [...defaultPatterns, ...productUrlPatterns].map((pattern) => new RegExp(pattern, 'i'));
  }

  public isProductUrl(url: string): boolean {
    if (!url) return false;

    // Check if the URL contains any disallowed paths
    const isDisallowed = this.disallowedPaths.some((path) => url.includes(path));
    if (isDisallowed) {
      return false; // Exclude URLs with disallowed paths
    }

    // Check if the URL matches any product URL patterns
    const isProduct = this.productUrlPatterns.some((regex) => regex.test(url));
    return isProduct;
  }
}