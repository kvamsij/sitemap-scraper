import axios from 'axios';
import zlib from 'zlib';
import { parseStringPromise } from 'xml2js';
import logger from '../log/Logger';

export class SitemapUrlFetcher {
  public async fetchSitemapContent(sitemapUrl: string): Promise<string> {
    try {
      const response = await axios.get(sitemapUrl, { responseType: 'arraybuffer' });
      const contentType = response.headers['content-type'];

      if (contentType === 'application/gzip') {
        return zlib.gunzipSync(response.data).toString('utf-8');
      } else {
        return response.data.toString();
      }
    } catch (error) {
      throw new Error(`Failed to fetch or parse sitemap: ${sitemapUrl} - ${(error as Error).message}`);
    }
  }

  public async fetchAllUrls(sitemapUrl: string): Promise<string[]> {
    const urls: string[] = [];
    const sitemapUrlsToProcess: string[] = [sitemapUrl];

    while (sitemapUrlsToProcess.length > 0) {
      const currentSitemapUrl = sitemapUrlsToProcess.pop()!;
      logger.info(`Processing sitemap: ${currentSitemapUrl}`);

      try {
        const sitemapContent = await this.fetchSitemapContent(currentSitemapUrl);

        if (!this.isSitemapContent(sitemapContent)) {
          logger.warn(`The content at ${currentSitemapUrl} is not a valid sitemap.`);
          continue;
        }

        const nestedSitemaps = await this.extractNestedSitemaps(sitemapContent);
        sitemapUrlsToProcess.push(...nestedSitemaps);

        const pageUrls = this.extractPageUrls(sitemapContent);
        urls.push(...pageUrls);
      } catch (error) {
        logger.error(`Error processing sitemap ${currentSitemapUrl}: ${(error as Error).message}`);
      }
    }

    return urls;
  }

  public isSitemapContent(content: string): boolean {
    return content.includes('<urlset') || content.includes('<sitemapindex');
  }

  public isSitemapIndex(content: string): boolean {
    return content.includes('<sitemapindex'); // Check if the content is a sitemap index
  }

  public isSingleSitemap(content: string): boolean {
    return content.includes('<urlset'); // Check if the content is a single sitemap
  }

  public async extractNestedSitemaps(sitemapContent: string): Promise<string[]> {
    try {
      const parsed = await parseStringPromise(sitemapContent, { explicitArray: false });
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
    } catch (error) {
      logger.error(`Failed to parse sitemap content: ${(error as Error).message}`);
      return [];
    }
  }

  public extractPageUrls(sitemapContent: string): string[] {
    const urls: string[] = [];
    const urlRegex = /<loc>(.*?)<\/loc>/g; // Match <loc> tags inside <urlset>
    let match;

    while ((match = urlRegex.exec(sitemapContent)) !== null) {
      urls.push(match[1]);
    }

    return urls;
  }
}
