import { IFetcher } from '../interfaces/IFetcher';
import { UrlFilter } from '../filter/url-filter';
import { WorkflowStep, WorkflowContext } from './workflow-types';
import { XmlParser } from '../parsers/xml-parser'; // Import XmlParser
import logger from '../log/Logger';

export class UrlProcessor implements WorkflowStep {
  private urlFetcher: IFetcher<string>;
  private urlFilter: UrlFilter;

  constructor(urlFetcher: IFetcher<string>, urlFilter: UrlFilter) {
    this.urlFetcher = urlFetcher;
    this.urlFilter = urlFilter;
  }

  public async execute(context: WorkflowContext): Promise<void> {
    logger.info('Processing URLs from sitemaps...');
    const xmlParser = new XmlParser(); // Initialize XmlParser

    for (const sitemapUrl of context.allSitemapUrls) {
      try {
        logger.info(`Fetching content from sitemap URL: ${sitemapUrl}`);
        const pageContent = await this.urlFetcher.fetchContent(sitemapUrl);

        logger.debug(`Fetched content from ${sitemapUrl}: ${pageContent.substring(0, 200)}...`);

        let pageUrls: string[] = [];

        // Check if the content is XML and use XmlParser
        if (pageContent.trim().startsWith('<')) {
          logger.info(`Processing as XML content.`);
          pageUrls = xmlParser.extractUrls(pageContent);
          pageUrls = pageUrls.filter((url) => {
            const isProduct = this.urlFilter.isProductUrl(url)
            return isProduct;
          });  
      
        } else {
          logger.info(`Processing ${sitemapUrl} as plain text content.`);
          pageUrls = pageContent
            .split('\n') // Assuming URLs are newline-separated
            .map((url) => url.trim().match(/https?:\/\/[^ ]+/)?.[0] || '') // Extract valid URLs
            .filter((url) => {
              const isProduct = this.urlFilter.isProductUrl(url);
              logger.debug(`URL: ${url}, isProduct: ${isProduct}`);
              return isProduct;
            });
        }

        logger.info(`Filtered product URLs from ${sitemapUrl}: ${pageUrls}`);
        context.productUrls.push(...pageUrls.map((url) => ({ url })));
      } catch (error) {
        logger.error(`Failed to process sitemap URL ${sitemapUrl}: ${(error as Error).message}`);
      }
    }

    logger.info(`Updated WorkflowContext in UrlProcessor:`);
    logger.debug(`Product URLs: ${context.productUrls.map((entry) => entry.url)}`);
  }
}