import readline from 'readline';
import { DomainInput } from './input/domainInput';
import { RobotsFetcher } from './fetch/robotsFetcher';
import { RobotsParser } from './parse/robotsParser';
import { ProductSitemapFilter } from './filter/productSitemapFilter';
import { SitemapUrlFetcher } from './fetch/sitemapUrlFetcher';
import { UrlFilter } from './filter/urlFilter';
import { SitemapProcessor } from './process/sitemapProcessor';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const verbose = true; // Set to false to reduce logging

rl.question('Enter a domain name: ', async (domain) => {
  try {
    const domainInput = new DomainInput(domain);
    console.log(`\nValidated domain: ${domainInput.getDomain()}`);

    const fetcher = new RobotsFetcher(domainInput.getDomain());
    const robotsTxt = await fetcher.fetchRobotsTxt();
    console.log('\nFetched robots.txt content:');
    console.log(robotsTxt);

    const parser = new RobotsParser(robotsTxt);
    const sitemaps = parser.getSitemapUrls();
    const disallowedPaths = parser.getDisallowedPaths();

    console.log('\nParsed Data:');
    console.log('\nSitemap URLs:');
    sitemaps.forEach((url, index) => console.log(`  ${index + 1}. ${url}`));

    console.log('\nDisallowed Paths:');
    disallowedPaths.forEach((path, index) => console.log(`  ${index + 1}. ${path}`));

    const filter = new ProductSitemapFilter(sitemaps);
    const productSitemaps = filter.getProductSitemaps();

    console.log('\nProduct-Specific Sitemaps:');
    if (productSitemaps.length === 0) {
      console.log('  No product-specific sitemaps found. Processing all sitemaps...');
    } else {
      productSitemaps.forEach((url, index) => console.log(`  ${index + 1}. ${url}`));
    }

    const urlFilter = new UrlFilter(disallowedPaths);
    const sitemapFetcher = new SitemapUrlFetcher();
    const sitemapProcessor = new SitemapProcessor(sitemapFetcher, urlFilter, verbose);

    const visitedSitemaps = new Set<string>();
    const sitemapsToProcess = productSitemaps.length > 0 ? productSitemaps : sitemaps;
    for (const sitemap of sitemapsToProcess) {
      try {
        await sitemapProcessor.fetchUrlsRecursively(sitemap, visitedSitemaps);
      } catch (error) {
        console.error(`Error processing sitemap ${sitemap}: ${(error as Error).message}`);
      }
    }
  } catch (error) {
    console.error((error as Error).message);
  } finally {
    rl.close();
  }
});
