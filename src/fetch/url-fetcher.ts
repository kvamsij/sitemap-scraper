import { IFetcher } from '../interfaces/IFetcher';
import { httpRequest } from '../utils/HttpClient';
import logger from '../log/Logger';

export class UrlFetcher implements IFetcher<string> {
  public async fetchContent(url: string): Promise<string> {
    logger.info(`Fetching content from URL: ${url}`);

    const response = await httpRequest<string>(url, undefined, 'UrlFetcher.fetchContent');

    if (response.error) {
      throw new Error(`Failed to fetch content from ${url}: ${response.error}`);
    }

    if (!response.data) {
      throw new Error(`No content received from ${url}`);
    }

    return response.data;
  }
}
