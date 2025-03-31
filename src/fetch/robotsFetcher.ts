import axios from 'axios';
import logger from '../log/Logger';

export class RobotsFetcher {
  private domain: string;

  constructor(domain: string) {
    this.domain = domain;
  }

  public async fetchRobotsTxt(): Promise<string> {
    const robotsUrl = `${this.domain}/robots.txt`;
    try {
      const response = await axios.get(robotsUrl);
      logger.info(`Fetched robots.txt from ${this.domain}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch robots.txt from ${this.domain}: ${(error as Error).message}`);
      throw error;
    }
  }
}
