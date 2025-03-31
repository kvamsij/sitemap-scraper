import { SitemapUrlFetcher } from '../fetch/sitemapUrlFetcher';
import axios from 'axios';
import zlib from 'zlib';

jest.mock('axios');
const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;

describe('SitemapUrlFetcher', () => {
  const xmlSitemap = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>https://example.com/page1</loc></url>
      <url><loc>https://example.com/page2</loc></url>
    </urlset>
  `;

  const gzippedSitemap = zlib.gzipSync(xmlSitemap);

  it('should fetch and return raw content from a standard XML sitemap', async () => {
    mockedAxiosGet.mockResolvedValueOnce({ data: xmlSitemap, headers: { 'content-type': 'application/xml' } });

    const fetcher = new SitemapUrlFetcher();
    const content = await fetcher.fetchSitemapContent('https://example.com/sitemap.xml');

    expect(content).toBe(xmlSitemap);
  });

  it('should fetch and return raw content from a gzipped sitemap', async () => {
    mockedAxiosGet.mockResolvedValueOnce({ data: gzippedSitemap, headers: { 'content-type': 'application/gzip' } });

    const fetcher = new SitemapUrlFetcher();
    const content = await fetcher.fetchSitemapContent('https://example.com/sitemap.xml.gz');

    expect(content).toBe(xmlSitemap);
  });

  it('should throw an error if fetching the sitemap fails', async () => {
    const sitemapUrl = 'https://example.com/sitemap.xml';
    mockedAxiosGet.mockRejectedValueOnce(new Error('Network error')); // Simulate a network error

    const fetcher = new SitemapUrlFetcher();

    await expect(fetcher.fetchSitemapContent(sitemapUrl)).rejects.toThrow(
      'SitemapUrlFetcher.fetchSitemapContent: Failed to fetch resource: https://example.com/sitemap.xml - Network error'
    );
  });
});
