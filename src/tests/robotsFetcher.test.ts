import { RobotsFetcher } from '../fetch/robotsFetcher';

describe('RobotsFetcher', () => {
  const mockFetcher = {
    fetchContent: jest.fn(),
  };

  it('should fetch robots.txt successfully', async () => {
    const domain = 'https://example.com';
    const robotsTxtContent = 'User-agent: *\nDisallow: /private/';
    mockFetcher.fetchContent.mockResolvedValueOnce({ data: robotsTxtContent });

    const fetcher = new RobotsFetcher(domain, mockFetcher);
    const result = await fetcher.fetchRobotsTxt();

    expect(result).toBe(robotsTxtContent);
    expect(mockFetcher.fetchContent).toHaveBeenCalledWith(`${domain}/robots.txt`);
  });

  it('should throw an error if fetching robots.txt fails', async () => {
    const domain = 'https://example.com';
    mockFetcher.fetchContent.mockResolvedValueOnce({ error: 'Network error' });

    const fetcher = new RobotsFetcher(domain, mockFetcher);

    await expect(fetcher.fetchRobotsTxt()).rejects.toThrow(
      'Failed to fetch robots.txt from https://example.com/robots.txt: Network error'
    );
  });
});
