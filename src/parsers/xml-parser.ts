import { IParser } from '../interfaces/IParser';
import * as cheerio from 'cheerio';

export class XmlParser implements IParser {
  public extractUrls(content: string): string[] {
    const $ = cheerio.load(content, { xmlMode: true });
    const urls: string[] = [];

    $('url > loc').each((_, element) => {
      const url = $(element).text();
      if (url) {
        urls.push(url);
      }
    });

    return urls;
  }

  public extractNestedSitemaps(content: string): string[] {
    const $ = cheerio.load(content, { xmlMode: true });
    const sitemaps: string[] = [];

    $('sitemap > loc').each((_, element) => {
      const sitemap = $(element).text();
      if (sitemap) {
        sitemaps.push(sitemap);
      }
    });

    return sitemaps;
  }
}
