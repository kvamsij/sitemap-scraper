import { ParserFactory } from './parser-factory';
import { IParser } from './IParser';

export class ContentParser {
  private parser: IParser;

  constructor(content: string, baseDomain?: string) {
    const type = this.identifyContentType(content);
    this.parser = ParserFactory.createParser(type, baseDomain);
  }

  private identifyContentType(content: string): 'xml' | 'html' {
    if (content.trim().startsWith('<')) {
      if (content.includes('<urlset') || content.includes('<sitemapindex')) {
        return 'xml';
      }
    }
    return 'html';
  }

  public extractUrls(content: string): string[] {
    return this.parser.extractUrls(content);
  }

  public extractNestedSitemaps(content: string): string[] {
    if (this.parser.extractNestedSitemaps) {
      return this.parser.extractNestedSitemaps(content);
    }

    // For HTML, look for links that might point to sitemaps
    return this.extractPotentialSitemapsFromHtml(content);
  }

  private extractPotentialSitemapsFromHtml(content: string): string[] {
    const urls = this.parser.extractUrls(content); // Extract all links
    return urls.filter((url) => url.endsWith('.xml') || url.toLowerCase().includes('sitemap'));
  }
}
