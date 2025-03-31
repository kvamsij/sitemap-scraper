import axios from 'axios';

export class RobotsFetcher {
  private domain: string;

  constructor(domain: string) {
    this.domain = domain;
  }

  public async fetchRobotsTxt(): Promise<string> {
    const robotsUrl = `${this.domain}/robots.txt`;
    try {
      const response = await axios.get(robotsUrl);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch robots.txt from ${robotsUrl}: ${(error as Error).message}`);
    }
  }
}
