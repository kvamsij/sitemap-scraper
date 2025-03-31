import { parseStringPromise } from 'xml2js';
import zlib from 'zlib';
import { FetchError, ParseError } from '../errors/AppError';
import logger from '../log/Logger';
import { httpRequest } from '../utils/HttpClient';

export class SitemapUrlFetcher {
  public async fetchSitemapContent(sitemapUrl: string): Promise<string> {
    const response = await httpRequest<Buffer>(
      sitemapUrl,
      { responseType: 'arraybuffer' },
      'SitemapUrlFetcher.fetchSitemapContent'
    );

    if (response.error) {
      throw new FetchError(
        sitemapUrl,
        response.error,
        response.error // Use the full error message from httpRequest
      );
    }

    if (!response.data) {
      throw new FetchError(sitemapUrl, 'No content received');
    }

    const contentType = response.headers?.['content-type'];

    if (contentType === 'application/gzip') {
      return zlib.gunzipSync(response.data).toString('utf-8');
    } else {
      return response.data.toString();
    }
  }

  public async fetchAllUrls(sitemapUrl: string): Promise<string[]> {
    const urls: string[] = [];
    const sitemapUrlsToProcess: string[] = [sitemapUrl];

    while (sitemapUrlsToProcess.length > 0) {
      const currentSitemapUrl = sitemapUrlsToProcess.pop()!;
      logger.info(`Processing sitemap: ${currentSitemapUrl}`);

      const sitemapContent = await this.fetchSitemapContent(currentSitemapUrl);

      if (!this.isSitemapContent(sitemapContent)) {
        logger.warn(`The content at ${currentSitemapUrl} is not a valid sitemap.`);
        continue;
      }

      const nestedSitemaps = await this.extractNestedSitemaps(sitemapContent);
      sitemapUrlsToProcess.push(...nestedSitemaps);

      const pageUrls = this.extractPageUrls(sitemapContent);
      urls.push(...pageUrls);
    }

    return urls;
  }

  public isSitemapContent(content: string): boolean {
    return content.includes('<urlset') || content.includes('<sitemapindex');
  }

  public isSitemapIndex(content: string): boolean {
    return content.includes('<sitemapindex');
  }

  public isSingleSitemap(content: string): boolean {
    return content.includes('<urlset');
  }

  public async extractNestedSitemaps(sitemapContent: string): Promise<string[]> {
    const parsed = await parseStringPromise(sitemapContent, { explicitArray: false }).catch((error) => {
      throw new ParseError('sitemap content', error.message);
    });
    const sitemaps: string[] = [];

    if (parsed.sitemapindex && parsed.sitemapindex.sitemap) {
      const sitemapEntries = Array.isArray(parsed.sitemapindex.sitemap)
        ? parsed.sitemapindex.sitemap
        : [parsed.sitemapindex.sitemap];

      for (const entry of sitemapEntries) {
        if (entry.loc) {
          sitemaps.push(entry.loc);
        }
      }
    }

    return sitemaps;
  }

  public extractPageUrls(sitemapContent: string): string[] {
    const urls: string[] = [];
    const urlRegex = /<loc>(.*?)<\/loc>/g;
    let match;

    while ((match = urlRegex.exec(sitemapContent)) !== null) {
      urls.push(match[1]);
    }

    return urls;
  }
}
