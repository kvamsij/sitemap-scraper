
export class RobotsParser {
  private robotsContent: string;

  constructor(robotsContent: string) {
    this.robotsContent = robotsContent;
  }

  public getSitemapUrls(): string[] {
    const sitemapUrls: string[] = [];
    const lines = this.robotsContent.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.toLowerCase().startsWith('sitemap:')) {
        const url = trimmedLine.substring(8).trim();
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
      const trimmedLine = line.trim();
      if (trimmedLine.toLowerCase().startsWith('disallow:')) {
        const path = trimmedLine.split(':')[1]?.trim();
        if (path) {
          disallowedPaths.push(path);
        }
      }
    }

    return Array.from(new Set(disallowedPaths)).filter((path) => path !== '/');
  }
}
