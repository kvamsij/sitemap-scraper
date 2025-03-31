import axios from 'axios';
import zlib from 'zlib';

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
      console.log(`Processing sitemap: ${currentSitemapUrl}`);

      try {
        const sitemapContent = await this.fetchSitemapContent(currentSitemapUrl);

        if (!this.isSitemapContent(sitemapContent)) {
          console.warn(`The content at ${currentSitemapUrl} is not a valid sitemap.`);
          continue;
        }

        const nestedSitemaps = this.extractNestedSitemaps(sitemapContent);
        sitemapUrlsToProcess.push(...nestedSitemaps);

        const pageUrls = this.extractPageUrls(sitemapContent);
        urls.push(...pageUrls);
      } catch (error) {
        console.error(`Error processing sitemap ${currentSitemapUrl}: ${(error as Error).message}`);
      }
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

  public extractNestedSitemaps(sitemapContent: string): string[] {
    const nestedSitemaps: string[] = [];
    const sitemapRegex = /<sitemap><loc>(.*?)<\/loc><\/sitemap>/g;
    let match;

    while ((match = sitemapRegex.exec(sitemapContent)) !== null) {
      nestedSitemaps.push(match[1]);
    }

    return nestedSitemaps;
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
