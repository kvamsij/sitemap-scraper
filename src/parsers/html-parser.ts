import { IParser } from './IParser';
import * as cheerio from 'cheerio';
import { URL } from 'url';

export class HtmlParser implements IParser {
  private baseDomain: string;

  constructor(baseDomain: string) {
    this.baseDomain = new URL(baseDomain).hostname; // Extract the hostname from the base domain
  }

  public extractUrls(content: string): string[] {
    const $ = cheerio.load(content);
    const urls: string[] = [];

    $('a[href]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        const url = new URL(href, `https://${this.baseDomain}`); // Resolve relative URLs
        if (url.hostname === this.baseDomain) {
          urls.push(url.href);
        }
      }
    });

    return urls;
  }

  public extractNestedSitemaps(content: string): string[] {
    const urls = this.extractUrls(content);
    return urls.filter((url) => url.endsWith('.xml') || url.toLowerCase().includes('sitemap'));
  }
}
