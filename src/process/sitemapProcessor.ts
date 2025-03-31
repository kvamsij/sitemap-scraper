import { SitemapUrlFetcher } from '../fetch/sitemapUrlFetcher';
import { UrlFilter } from '../filter/urlFilter';
import { FileWriter } from '../write/fileWriter';
import logger from '../log/Logger';

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
    concurrencyLimit = 5 // Default concurrency limit
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

  private async processSitemapBatch(
    sitemaps: string[],
    visited: Set<string>,
    format: 'csv' | 'json' | 'txt'
  ): Promise<string[]> {
    if (sitemaps.length === 0) {
      this.log('No sitemaps to process in this batch.');
      return [];
    }

    const promises = sitemaps.map((sitemap) =>
      this.fetchUrlsRecursively(sitemap, visited, format)
    );
    const results = await Promise.all(promises);
    return results.flat(); // Flatten the array of arrays
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
    try {
      const sitemapContent = await this.sitemapFetcher.fetchSitemapContent(sitemap);

      if (!this.sitemapFetcher.isSitemapContent(sitemapContent)) {
        this.log(`The content at ${sitemap} is not a valid sitemap.`);
        return [];
      }

      let allUrls: string[] = [];
      if (this.sitemapFetcher.isSitemapIndex(sitemapContent)) {
        this.log(`Processing sitemap index: ${sitemap}`);
        const nestedSitemaps = await this.sitemapFetcher.extractNestedSitemaps(sitemapContent);

        if (nestedSitemaps.length === 0) {
          this.log(`No nested sitemaps found in ${sitemap}.`);
          return [];
        }

        this.log(`Nested sitemaps found: ${nestedSitemaps.length}`);
        nestedSitemaps.forEach((nested, index) => this.log(`  ${index + 1}. ${nested}`));

        // Process nested sitemaps in batches with concurrency control
        for (let i = 0; i < nestedSitemaps.length; i += this.concurrencyLimit) {
          const batch = nestedSitemaps.slice(i, i + this.concurrencyLimit);
          const batchUrls = await this.processSitemapBatch(batch, visited, format);
          allUrls = allUrls.concat(batchUrls);
        }
      } else if (this.sitemapFetcher.isSingleSitemap(sitemapContent)) {
        this.log(`Processing single sitemap: ${sitemap}`);
        const pageUrls = this.sitemapFetcher.extractPageUrls(sitemapContent);
        this.log(`Extracted ${pageUrls.length} URLs from sitemap: ${sitemap}`);
        pageUrls.forEach((url, index) => this.log(`  ${index + 1}. ${url}`));

        // Filter product URLs using UrlFilter
        const productUrls = pageUrls.filter((url) => this.urlFilter.isProductUrl(url));
        this.log(`Product URLs identified: ${productUrls.length}`);
        productUrls.forEach((url, index) => this.log(`  ${index + 1}. ${url}`));

        allUrls = allUrls.concat(productUrls);

        // Write product URLs to the chosen format
        if (productUrls.length > 0) {
          this.log(`Writing ${productUrls.length} product URLs to file...`);
          await this.fileWriter.writeUrlsToFile(productUrls, format);
        } else {
          this.log(`No product URLs found in ${sitemap}. Skipping file writing.`);
        }
      }

      return allUrls;
    } catch (error) {
      logger.error(`Error fetching sitemap ${sitemap}: ${(error as Error).message}`);
      return [];
    }
  }
}
