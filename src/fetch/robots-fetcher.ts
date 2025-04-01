import { IFetcher } from '../interfaces/IFetcher';
import { httpRequest } from '../utils/HttpClient';
import { FetchError } from '../errors/AppError';

export class RobotsFetcher implements IFetcher<string> {
  public async fetchContent(domain: string): Promise<string> {
    const robotsUrl = `${domain}/robots.txt`;
    const response = await httpRequest<string>(robotsUrl, undefined, 'Fetching robots.txt');

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