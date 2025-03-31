import logger from '../log/Logger';

export class RobotsParser {
  private robotsContent: string;

  constructor(robotsContent: string) {
    this.robotsContent = robotsContent;
  }

  public getSitemapUrls(): string[] {
    const sitemapUrls: string[] = [];
    const lines = this.robotsContent.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim(); // Trim leading/trailing whitespace
      if (trimmedLine.toLowerCase().startsWith('sitemap:')) {
        const url = trimmedLine.substring(8).trim(); // Extract everything after "Sitemap:"
        if (url) {
          sitemapUrls.push(url);
        }
      }
    }

    return sitemapUrls;
  }

  public getDisallowedPaths(): string[] {
    const disallowedPaths: string[] = [];
    const lines = this.robotsContent.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim(); // Trim leading/trailing whitespace
      if (trimmedLine.toLowerCase().startsWith('disallow:')) {
        const path = trimmedLine.split(':')[1]?.trim(); // Trim the path
        if (path) {
          disallowedPaths.push(path);
        }
      }
    }

    // Remove duplicates and empty entries
    return Array.from(new Set(disallowedPaths)).filter((path) => path !== '/');
  }

  public parse(): void {
    logger.info('Parsing robots.txt content...');
  }
}
