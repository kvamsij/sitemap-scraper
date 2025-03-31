import { SitemapUrlFetcher } from '../fetch/sitemapUrlFetcher';
import logger from '../log/Logger';

export class SitemapFetcher {
  private sitemapUrlFetcher: SitemapUrlFetcher;

  constructor(sitemapUrlFetcher: SitemapUrlFetcher) {
    this.sitemapUrlFetcher = sitemapUrlFetcher;
  }

  public async fetchAndParseSitemap(sitemapUrl: string): Promise<{ content: string; isIndex: boolean }> {
    logger.info(`Fetching sitemap: ${sitemapUrl}`);
    const content = await this.sitemapUrlFetcher.fetchSitemapContent(sitemapUrl);

    const isIndex = this.sitemapUrlFetcher.isSitemapIndex(content);
    return { content, isIndex };
  }

  public extractNestedSitemaps(content: string): Promise<string[]> {
    return this.sitemapUrlFetcher.extractNestedSitemaps(content);
  }

  public extractPageUrls(content: string): string[] {
    return this.sitemapUrlFetcher.extractPageUrls(content);
  }
}
