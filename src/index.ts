import readline from 'readline';
import { DomainInput } from './input/domainInput';
import { RobotsFetcher } from './fetch/robotsFetcher';
import { RobotsParser } from './parse/robotsParser';
import { ProductSitemapFilter } from './filter/productSitemapFilter';
import { SitemapUrlFetcher } from './fetch/sitemapUrlFetcher';
import { UrlFilter } from './filter/urlFilter';
import { SitemapProcessor } from './process/sitemapProcessor';
import { FileWriter } from './write/fileWriter';
import logger from './log/Logger';

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

      const fetcher = new RobotsFetcher(domainInput.getDomain());
      const robotsTxt = await fetcher.fetchRobotsTxt();
      logger.info('Fetched robots.txt content');
      // logger.debug(robotsTxt); // Disable detailed robots.txt logging

      const parser = new RobotsParser(robotsTxt);
      const sitemaps = parser.getSitemapUrls();
      const disallowedPaths = parser.getDisallowedPaths();

      logger.info('Parsed Data');
      // logger.info('Disallowed Paths:'); // Disable disallowed paths logging
      // disallowedPaths.forEach((path, index) => logger.info(`  ${index + 1}. ${path}`));

      const filter = new ProductSitemapFilter(sitemaps);
      const productSitemaps = filter.getProductSitemaps();

      logger.info('Product-Specific Sitemaps:');
      // if (productSitemaps.length > 0) {
      //   productSitemaps.forEach((sitemap, index) => logger.info(`  ${index + 1}. ${sitemap}`));
      // }
      if (productSitemaps.length === 0) {
        logger.warn('No product-specific sitemaps found. Processing all sitemaps...');
      }

      const urlFilter = new UrlFilter(disallowedPaths);
      const sitemapFetcher = new SitemapUrlFetcher();
      const fileWriter = new FileWriter(domainInput.getDomain());
      const sitemapProcessor = new SitemapProcessor(sitemapFetcher, urlFilter, fileWriter, verbose);

      const visitedSitemaps = new Set<string>();
      const sitemapsToProcess = productSitemaps.length > 0 ? productSitemaps : sitemaps;
      for (const sitemap of sitemapsToProcess) {
        try {
          // Explicitly cast format to the correct type
          await sitemapProcessor.fetchUrlsRecursively(sitemap, visitedSitemaps, format as 'csv' | 'json' | 'txt');
        } catch (error) {
          logger.error(`Error processing sitemap ${sitemap}: ${(error as Error).message}`);
        }
      }

      logger.info(`Process complete! Extracted product URLs have been saved in the ${format} format.`);
    } catch (error) {
      logger.error(`An error occurred: ${(error as Error).message}`);
    } finally {
      rl.close();
    }
  });
});
