import { IFetcher } from '../interfaces/IFetcher';
import { RobotsParser } from '../parse/robotsParser';
import { WorkflowStep, WorkflowContext } from './workflow-types';

export class RobotsProcessor implements WorkflowStep {
  private robotsFetcher: IFetcher<string>;

  constructor(robotsFetcher: IFetcher<string>) {
    this.robotsFetcher = robotsFetcher;
  }

  public async execute(context: WorkflowContext): Promise<void> {
    const robotsTxt = await this.robotsFetcher.fetchContent(context.domain);
    if (!robotsTxt) {
      console.log('No robots.txt found.');
      return;
    }

    const parser = new RobotsParser(robotsTxt);
    context.sitemaps = parser.getSitemapUrls();
  }
}