export class ProductSitemapFilter {
  private sitemapUrls: string[];

  constructor(sitemapUrls: string[]) {
    this.sitemapUrls = sitemapUrls;
  }

  public getProductSitemaps(): string[] {
    return this.sitemapUrls.filter((url) =>
      url.toLowerCase().includes('product')
    );
  }
}
