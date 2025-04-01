import { ParserFactory } from './parser-factory';
import { IParser } from '../interfaces/IParser';
import logger from '../log/Logger';

export class ContentParser {
  private parser: IParser;

  constructor(content: string, baseDomain?: string) {
    const type = this.identifyContentType(content);
    this.parser = ParserFactory.createParser(type, baseDomain);
  }

  private identifyContentType(content: string): 'xml' | 'html' | 'robots' {
    if (content.trim().startsWith('<')) {
      if (content.includes('<urlset') || content.includes('<sitemapindex')) {
        return 'xml';
      }
    } else if (content.toLowerCase().includes('user-agent') && content.toLowerCase().includes('disallow')) {
      return 'robots';
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

  public extractSitemapsAndDisallowedPaths(content: string): { sitemaps: string[]; disallowedPaths: string[] } | null {
    if (this.parser.extractSitemapsAndDisallowedPaths) {
      const result = this.parser.extractSitemapsAndDisallowedPaths(content);
      logger.info(`Extracted sitemaps: ${result.sitemaps}`);
      logger.info(`Extracted disallowed paths: ${result.disallowedPaths}`);
      return result;
    }
    logger.warn('extractSitemapsAndDisallowedPaths is not implemented for this parser.');
    return null;
  }

  private extractPotentialSitemapsFromHtml(content: string): string[] {
    const urls = this.parser.extractUrls(content); // Extract all links
    return urls.filter((url) => url.endsWith('.xml') || url.toLowerCase().includes('sitemap'));
  }
}
