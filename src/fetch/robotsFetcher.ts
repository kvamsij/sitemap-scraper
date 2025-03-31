import logger from '../log/Logger';
import { httpRequest } from '../utils/HttpClient';

export class RobotsFetcher {
  private domain: string;

  constructor(domain: string) {
    this.domain = domain;
  }

  public async fetchRobotsTxt(): Promise<string> {
    const robotsUrl = `${this.domain}/robots.txt`;
    const response = await httpRequest<string>(robotsUrl, undefined, 'RobotsFetcher.fetchRobotsTxt');
    logger.info(`Fetched robots.txt from ${this.domain}`);
    return response.data; // Access response.data
  }
}
