import { WorkflowContext, WorkflowStep } from './workflow-types';
import logger from '../log/Logger';

export class Processor {
  private steps: WorkflowStep[];

  constructor(steps: WorkflowStep[]) {
    this.steps = steps;
  }

  public async process(initialContext: WorkflowContext): Promise<void> {
    const context = initialContext;

    for (const step of this.steps) {
      logger.info(`Executing step: ${step.constructor.name}`);
      await step.execute(context);
      logger.info(`WorkflowContext after ${step.constructor.name}:`);
      // logger.debug(`Sitemaps: ${context.sitemaps}`);
      // logger.debug(`All Sitemap URLs: ${context.allSitemapUrls}`);
      // logger.debug(`Product URLs: ${context.productUrls.map((entry) => entry.url)}`);
    }
  }
}
