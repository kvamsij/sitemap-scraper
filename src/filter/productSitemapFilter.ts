export class ProductSitemapFilter {
  private sitemapUrls: string[];

  constructor(sitemapUrls: string[]) {
    this.sitemapUrls = sitemapUrls;
  }

  public getProductSitemaps(): string[] {
    return this.sitemapUrls.filter((url) => {
      const urlObj = new URL(url);
      const path = urlObj.pathname.toLowerCase();
      return path.includes('product'); // Match "product" in the path
    });
  }
}
