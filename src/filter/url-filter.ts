export interface UrlFilterStrategy {
  isProductUrl(url: string): boolean;
}

export class DefaultUrlFilterStrategy implements UrlFilterStrategy {
  public isProductUrl(url: string): boolean {
    return /\/product\/|\/item\/|\/sku\/|\/p\/|\/products\//i.test(url) || /\?productId=/.test(url);
  }
}

export class UrlFilter {
  private disallowedPaths: string[];
  private strategy: UrlFilterStrategy;

  constructor(disallowedPaths: string[] = [], strategy: UrlFilterStrategy = new DefaultUrlFilterStrategy()) {
    this.disallowedPaths = disallowedPaths;
    this.strategy = strategy;
  }

  public isUrlAllowed(url: string): boolean {
    return !this.disallowedPaths.some((path) => url.includes(path));
  }

  public isProductUrl(url: string): boolean {
    return this.strategy.isProductUrl(url);
  }
}