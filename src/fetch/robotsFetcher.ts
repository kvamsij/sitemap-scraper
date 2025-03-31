import { IFetcher } from '../interfaces/IFetcher';
import { FetchError } from '../errors/AppError';

export class RobotsFetcher {
  private domain: string;
  private fetcher: IFetcher;

  constructor(domain: string, fetcher: IFetcher) {
    this.domain = domain;
    this.fetcher = fetcher;
  }

  public async fetchRobotsTxt(): Promise<string> {
    const robotsUrl = `${this.domain}/robots.txt`;
    const response = await this.fetcher.fetchContent(robotsUrl);

    if (response.error) {
      throw new FetchError(
        robotsUrl,
        response.error,
        `Failed to fetch robots.txt from ${robotsUrl}: ${response.error}`
      );
    }

    if (!response.data) {
      throw new FetchError(robotsUrl, 'No content received');
    }

    return response.data;
  }
}
