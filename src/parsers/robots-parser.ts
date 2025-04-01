import logger from '../log/Logger';

export class RobotsParser {
  private robotsContent: string;

  constructor(robotsContent: string) {
    this.robotsContent = robotsContent;
  }

  public getSitemapUrls(): string[] {
    logger.info('Parsing sitemap URLs from robots.txt...');
    const sitemapUrls: Set<string> = new Set();
    const lines = this.getLines();

    for (const line of lines) {
      const url = this.extractDirectiveValue(line, 'sitemap');
      if (url) {
        sitemapUrls.add(url);
      }
    }

    logger.info(`Found ${sitemapUrls.size} unique sitemap URLs.`);
    return Array.from(sitemapUrls);
  }

  public getDisallowedPaths(): string[] {
    logger.info('Parsing disallowed paths from robots.txt...');
    const disallowedPaths: Set<string> = new Set();
    const lines = this.getLines();

    for (const line of lines) {
      const path = this.extractDirectiveValue(line, 'disallow');
      if (path && path !== '/') {
        disallowedPaths.add(path);
      }
    }

    logger.info(`Found ${disallowedPaths.size} unique disallowed paths.`);
    return Array.from(disallowedPaths);
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
