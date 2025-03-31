import { SitemapUrlFetcher } from '../fetch/sitemapUrlFetcher';
import { UrlFilter } from '../filter/urlFilter';
import logger from '../log/Logger';
import { FileWriter } from '../write/fileWriter';

export class SitemapProcessor {
  private sitemapFetcher: SitemapUrlFetcher;
  private urlFilter: UrlFilter;
  private verbose: boolean;
  private fileWriter: FileWriter;
  private concurrencyLimit: number;

  constructor(
    sitemapFetcher: SitemapUrlFetcher,
    urlFilter: UrlFilter,
    fileWriter: FileWriter,
    verbose = true,
    concurrencyLimit = 5
  ) {
    this.sitemapFetcher = sitemapFetcher;
    this.urlFilter = urlFilter;
    this.fileWriter = fileWriter;
    this.verbose = verbose;
    this.concurrencyLimit = concurrencyLimit;
  }

  private log(message: string): void {
    if (this.verbose) logger.info(message);
  }

  private async processNestedSitemaps(
    nestedSitemaps: string[],
    visited: Set<string>,
    format: 'csv' | 'json' | 'txt'
  ): Promise<string[]> {
    let allUrls: string[] = [];
    for (let i = 0; i < nestedSitemaps.length; i += this.concurrencyLimit) {
      const batch = nestedSitemaps.slice(i, i + this.concurrencyLimit);
      const batchUrls = await Promise.all(
        batch.map((sitemap) => this.fetchUrlsRecursively(sitemap, visited, format))
      );
      allUrls = allUrls.concat(batchUrls.flat());
    }
    return allUrls;
  }

  public async fetchUrlsRecursively(
    sitemap: string,
    visited: Set<string>,
    format: 'csv' | 'json' | 'txt'
  ): Promise<string[]> {
    if (visited.has(sitemap)) {
      this.log(`Skipping already visited sitemap: ${sitemap}`);
      return [];
    }
    visited.add(sitemap);

    this.log(`\nFetching all URLs from sitemap: ${sitemap}`);
    const sitemapContent = await this.sitemapFetcher.fetchSitemapContent(sitemap);

    if (!this.sitemapFetcher.isSitemapContent(sitemapContent)) {
      this.log(`The content at ${sitemap} is not a valid sitemap.`);
      return [];
    }

    if (this.sitemapFetcher.isSitemapIndex(sitemapContent)) {
      this.log(`Processing sitemap index: ${sitemap}`);
      const nestedSitemaps = await this.sitemapFetcher.extractNestedSitemaps(sitemapContent);
      return this.processNestedSitemaps(nestedSitemaps, visited, format);
    }

    if (this.sitemapFetcher.isSingleSitemap(sitemapContent)) {
      this.log(`Processing single sitemap: ${sitemap}`);
      const pageUrls = this.sitemapFetcher.extractPageUrls(sitemapContent);
      const productUrls = pageUrls.filter((url) => this.urlFilter.isProductUrl(url));

      if (productUrls.length > 0) {
        this.log(`Writing ${productUrls.length} product URLs to file...`);
        await this.fileWriter.writeUrlsToFile(productUrls, format);
      } else {
        this.log(`No product URLs found in ${sitemap}. Skipping file writing.`);
      }

      return productUrls;
    }

    return [];
  }
}
