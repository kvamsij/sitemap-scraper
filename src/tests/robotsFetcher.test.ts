import { RobotsFetcher } from '../fetch/robotsFetcher';
import axios from 'axios';

jest.mock('axios'); // Ensure axios is mocked
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RobotsFetcher', () => {
  it('should fetch robots.txt successfully', async () => {
    const domain = 'https://example.com';
    const robotsContent = 'User-agent: *\nDisallow: /private/';
    mockedAxios.get.mockResolvedValueOnce({ data: robotsContent }); // Mock the resolved value

    const fetcher = new RobotsFetcher(domain);
    const result = await fetcher.fetchRobotsTxt();

    expect(result).toBe(robotsContent);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${domain}/robots.txt`);
  });

  it('should throw an error if fetching robots.txt fails', async () => {
    const domain = 'https://example.com';
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error')); // Mock the rejected value

    const fetcher = new RobotsFetcher(domain);

    await expect(fetcher.fetchRobotsTxt()).rejects.toThrow(
      'Failed to fetch robots.txt from https://example.com/robots.txt: Network error'
    );
  });
});
