import { RobotsParser } from '../parse/robotsParser';

describe('RobotsParser', () => {
  const robotsContent = `
    User-agent: *
    Disallow: /private/
    Disallow: /tmp/
    Sitemap: https://example.com/sitemap.xml
    Sitemap: https://example.com/sitemap2.xml
  `;

  it('should extract sitemap URLs', () => {
    const parser = new RobotsParser(robotsContent);
    const sitemaps = parser.getSitemapUrls();

    expect(sitemaps).toEqual([
      'https://example.com/sitemap.xml',
      'https://example.com/sitemap2.xml',
    ]);
  });

  it('should extract disallowed paths', () => {
    const parser = new RobotsParser(robotsContent);
    const disallowedPaths = parser.getDisallowedPaths();

    expect(disallowedPaths).toEqual(['/private/', '/tmp/']);
  });

  it('should return empty arrays if no sitemaps or disallowed paths exist', () => {
    const emptyContent = `
      User-agent: *
      Allow: /
    `;
    const parser = new RobotsParser(emptyContent);

    expect(parser.getSitemapUrls()).toEqual([]);
    expect(parser.getDisallowedPaths()).toEqual([]);
  });
});
