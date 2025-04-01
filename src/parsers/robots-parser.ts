import logger from '../log/Logger';
import { IParser } from '../interfaces/IParser';

export class RobotsParser implements IParser {
  private robotsContent: string;

  constructor(robotsContent: string) {
    this.robotsContent = robotsContent;
  }

  public extractUrls(): string[] {
    logger.info('Extracting URLs is not applicable for robots.txt.');
    return [];
  }

  public extractSitemapsAndDisallowedPaths(): { sitemaps: string[]; disallowedPaths: string[] } {
    logger.info('Parsing sitemap URLs and disallowed paths from robots.txt...');
    const sitemapUrls: Set<string> = new Set();
    const disallowedPaths: Set<string> = new Set();
    const lines = this.getLines();

    for (const line of lines) {
      const sitemapUrl = this.extractDirectiveValue(line, 'sitemap');
      if (sitemapUrl) {
        sitemapUrls.add(sitemapUrl);
      }

      const disallowedPath = this.extractDirectiveValue(line, 'disallow');
      if (disallowedPath && disallowedPath !== '/') {
        disallowedPaths.add(disallowedPath);
      }
    }

    logger.info(`Found ${sitemapUrls.size} unique sitemap URLs and ${disallowedPaths.size} disallowed paths.`);
    return {
      sitemaps: Array.from(sitemapUrls),
      disallowedPaths: Array.from(disallowedPaths),
    };
  }

  private getLines(): string[] {
    return this.robotsContent.split('\n').map((line) => line.trim());
  }

  private extractDirectiveValue(line: string, directive: string): string | null {
    if (line.toLowerCase().startsWith(`${directive}:`)) {
      return line.substring(directive.length + 1).trim();
    }
    return null;
  }
}
