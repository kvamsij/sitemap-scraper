import axios from 'axios';
import { RobotsFetcher } from '../fetch/robotsFetcher';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RobotsFetcher', () => {
  it('should fetch robots.txt successfully', async () => {
    const domain = 'https://example.com';
    const robotsTxtContent = 'User-agent: *\nDisallow: /private/';
    mockedAxios.get.mockResolvedValueOnce({ data: robotsTxtContent });

    const fetcher = new RobotsFetcher(domain);
    const result = await fetcher.fetchRobotsTxt();

    expect(result).toBe(robotsTxtContent);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${domain}/robots.txt`, undefined); // Include the second argument as undefined
  });

  it('should throw an error if fetching robots.txt fails', async () => {
    const domain = 'https://example.com';
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error')); // Mock the rejected value

    const fetcher = new RobotsFetcher(domain);

    await expect(fetcher.fetchRobotsTxt()).rejects.toThrow(
      'RobotsFetcher.fetchRobotsTxt: Failed to fetch resource: https://example.com/robots.txt - Network error'
    );
  });
});
