import readline from 'readline';
import { DomainInput } from './input/domainInput';
import { RobotsFetcher } from './fetch/robotsFetcher';
import { RobotsParser } from './parse/robotsParser';
import { ProductSitemapFilter } from './filter/productSitemapFilter';
import { SitemapUrlFetcher } from './fetch/sitemapUrlFetcher';
import { SitemapFetcher } from './process/SitemapFetcher'; // Import SitemapFetcher
import { UrlFilter } from './filter/urlFilter';
import { SitemapProcessor } from './process/sitemapProcessor';
import { FileWriter } from './write/fileWriter';
import logger from './log/Logger';
import { ErrorHandler } from './utils/ErrorHandler';
import { httpRequest } from './utils/HttpClient';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const verbose = false; // Disable verbose logging

logger.info('Application started');

rl.question('Enter a domain name (e.g., example.com): ', (domain) => {
  rl.question('Choose an output format (csv, json, txt): ', async (format) => {
    if (!['csv', 'json', 'txt'].includes(format)) {
      logger.error('Invalid format. Please choose from csv, json, or txt.');
      rl.close();
      return;
    }

    try {
      const domainInput = new DomainInput(domain);
      logger.info(`Validated domain: ${domainInput.getDomain()}`);

      // Pass an implementation of IFetcher to RobotsFetcher
      const fetcher = new RobotsFetcher(domainInput.getDomain(), {
        fetchContent: async (url: string) => {
          const response = await httpRequest<string>(url);
          return { data: response.data, error: response.error }; // Return structured response
        },
      });

      const robotsTxt = await fetcher.fetchRobotsTxt();
      if (!robotsTxt) return;

      logger.info('Fetched robots.txt content');
      const parser = new RobotsParser(robotsTxt);
      const sitemaps = parser.getSitemapUrls();
      const disallowedPaths = parser.getDisallowedPaths();

      const filter = new ProductSitemapFilter(sitemaps);
      const productSitemaps = filter.getProductSitemaps();

      const urlFilter = new UrlFilter(disallowedPaths);
      const sitemapUrlFetcher = new SitemapUrlFetcher();
      const sitemapFetcher = new SitemapFetcher(sitemapUrlFetcher); // Instantiate SitemapFetcher
      const fileWriter = new FileWriter(domainInput.getDomain());
      const sitemapProcessor = new SitemapProcessor(sitemapFetcher, urlFilter, fileWriter, verbose);

      const visitedSitemaps = new Set<string>();
      const sitemapsToProcess = productSitemaps.length > 0 ? productSitemaps : sitemaps;

      for (const sitemap of sitemapsToProcess) {
        await sitemapProcessor.fetchUrlsRecursively(sitemap, visitedSitemaps, format as 'csv' | 'json' | 'txt');
      }

      logger.info(`Process complete! Extracted product URLs have been saved in the ${format} format.`);
    } catch (error) {
      ErrorHandler.handleError(error); // Centralized error handling
    } finally {
      rl.close();
    }
  });
});
