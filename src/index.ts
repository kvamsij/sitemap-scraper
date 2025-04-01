import readline from 'readline';
import { RobotsFetcher } from './fetch/robots-fetcher';
import { SitemapFetcher } from './fetch/sitemap-fetcher';
import { UrlFetcher } from './fetch/url-fetcher';
import { RobotsProcessor } from './process/robots-processor';
import { SitemapProcessor } from './process/sitemap-processor';
import { UrlProcessor } from './process/url-processor';
import { UrlFilter } from './filter/url-filter';
import { FileWriter } from './write/file-writer';
import { Processor } from './process/index';
import { WorkflowContext, WorkflowStep } from './process/workflow-types';
import logger from './log/Logger';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

logger.info('Application started');

function normalizeDomain(domain: string): string {
  if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
    return `https://${domain}`;
  }
  return domain;
}

rl.question('Enter a domain name (e.g., https://example.com): ', (domain) => {
  const normalizedDomain = normalizeDomain(domain);
  rl.question('Choose an output format (csv, json, txt): ', async (format) => {
    if (!['csv', 'json', 'txt'].includes(format)) {
      logger.error('Invalid format. Please choose from csv, json, or txt.');
      rl.close();
      return;
    }

    try {
      // Initialize fetchers
      const robotsFetcher = new RobotsFetcher();
      const sitemapFetcher = new SitemapFetcher();
      const urlFetcher = new UrlFetcher();

      // Initialize filters and file writer
      const urlFilter = new UrlFilter();
      const fileWriter = new FileWriter(normalizedDomain);

      // Define workflow steps
      const steps: WorkflowStep[] = [
        new RobotsProcessor(robotsFetcher),
        new SitemapProcessor(sitemapFetcher),
        new UrlProcessor(urlFetcher, urlFilter),
      ];

      // Initialize the processor
      const processor = new Processor(steps);

      // Define the initial workflow context
      const context: WorkflowContext = {
        domain: normalizedDomain,
        sitemaps: [],
        visited: new Set<string>(),
        allSitemapUrls: [],
        productUrls: [],
      };

      // Execute the workflow
      await processor.process(context);

      // Write the extracted product URLs to a file
      const productUrls = context.productUrls.map((entry) => entry.url);
      await fileWriter.writeUrlsToFile(productUrls, format as 'csv' | 'json' | 'txt');

      logger.info(`Process complete! Extracted product URLs have been saved in the ${format} format.`);
    } catch (error) {
      logger.error(`An error occurred: ${(error as Error).message}`);
    } finally {
      rl.close();
    }
  });
});
