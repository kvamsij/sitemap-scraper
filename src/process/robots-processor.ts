import { IFetcher } from '../interfaces/IFetcher';
import { RobotsParser } from '../parsers/robots-parser';
import { WorkflowStep, WorkflowContext } from './workflow-types';
import logger from '../log/Logger';

export class RobotsProcessor implements WorkflowStep {
  private robotsFetcher: IFetcher<string>;

  constructor(robotsFetcher: IFetcher<string>) {
    this.robotsFetcher = robotsFetcher;
  }

  public async execute(context: WorkflowContext): Promise<void> {
    logger.info('Processing robots.txt...');
    const robotsTxt = await this.robotsFetcher.fetchContent(context.domain);
    if (!robotsTxt) {
      logger.warn('No robots.txt found.');
      return;
    }

    logger.info('Fetched robots.txt content:');
    logger.debug(robotsTxt);

    const parser = new RobotsParser(robotsTxt);
    const { sitemaps, disallowedPaths } = parser.extractSitemapsAndDisallowedPaths();

    if (!sitemaps || !disallowedPaths) {
      logger.error('Failed to parse robots.txt content.');
      return;
    }

    logger.info(`Parsed sitemaps: ${sitemaps}`);
    logger.info(`Parsed disallowed paths: ${disallowedPaths}`);

    context.sitemaps.push(...sitemaps);
    context.disallowedPaths.push(...disallowedPaths);

    logger.info(`Updated WorkflowContext in RobotsProcessor:`);
    logger.debug(`Sitemaps: ${context.sitemaps}`);
    logger.debug(`Disallowed Paths: ${context.disallowedPaths}`);
  }
}