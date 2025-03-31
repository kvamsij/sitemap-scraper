import { SitemapUrlFetcher } from '../fetch/sitemapUrlFetcher';
import { UrlFilter } from '../filter/urlFilter';

export class SitemapProcessor {
  private sitemapFetcher: SitemapUrlFetcher;
  private urlFilter: UrlFilter;
  private verbose: boolean;

  constructor(sitemapFetcher: SitemapUrlFetcher, urlFilter: UrlFilter, verbose = true) {
    this.sitemapFetcher = sitemapFetcher;
    this.urlFilter = urlFilter;
    this.verbose = verbose;
  }

  private log(message: string): void {
    if (this.verbose) console.log(message);
  }

  public async fetchUrlsRecursively(sitemap: string, visited: Set<string>): Promise<string[]> {
    if (visited.has(sitemap)) return [];
    visited.add(sitemap);

    this.log(`\nFetching all URLs from sitemap: ${sitemap}`);
    try {
      const sitemapContent = await this.sitemapFetcher.fetchSitemapContent(sitemap);

      if (!this.sitemapFetcher.isSitemapContent(sitemapContent)) {
        console.warn(`The content at ${sitemap} is not a valid sitemap.`);
        return [];
      }

      let allUrls: string[] = [];
      if (this.sitemapFetcher.isSitemapIndex(sitemapContent)) {
        this.log(`Processing sitemap index: ${sitemap}`);
        const nestedSitemaps = this.sitemapFetcher.extractNestedSitemaps(sitemapContent);
        for (const nestedSitemap of nestedSitemaps) {
          try {
            const nestedUrls = await this.fetchUrlsRecursively(nestedSitemap, visited);
            allUrls = allUrls.concat(nestedUrls);
          } catch (error) {
            console.error(`Error processing nested sitemap ${nestedSitemap}: ${(error as Error).message}`);
          }
        }
      } else if (this.sitemapFetcher.isSingleSitemap(sitemapContent)) {
        this.log(`Processing single sitemap: ${sitemap}`);
        const pageUrls = this.sitemapFetcher.extractPageUrls(sitemapContent);
        const allowedUrls = pageUrls.filter((url) => this.urlFilter.isUrlAllowed(url));
        const productUrls = allowedUrls.filter((url) => this.urlFilter.isProductUrl(url));
        if (productUrls.length > 0) {
          console.log(`\nExtracted Product URLs from ${sitemap}:`);
          productUrls.forEach((url, index) => console.log(`  ${index + 1}. ${url}`));
        } else {
          console.log(`\nNo product URLs found in ${sitemap}.`);
        }
        allUrls = allUrls.concat(productUrls);
      }

      return allUrls;
    } catch (error) {
      console.error(`Error fetching sitemap ${sitemap}: ${(error as Error).message}`);
      return [];
    }
  }
}
