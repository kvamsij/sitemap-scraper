import { IFetcher } from '../interfaces/IFetcher';
import { XmlParser } from '../parsers/xml-parser';
import { WorkflowContext, WorkflowStep } from './workflow-types';
import logger from '../log/Logger';

export class SitemapProcessor implements WorkflowStep {
  private sitemapFetcher: IFetcher<string>;
  private verbose: boolean;
  private concurrencyLimit: number;

  constructor(
    sitemapFetcher: IFetcher<string>,
    verbose = true,
    concurrencyLimit = 5
  ) {
    this.sitemapFetcher = sitemapFetcher;
    this.verbose = verbose;
    this.concurrencyLimit = concurrencyLimit;
  }

  private log(message: string): void {
    if (this.verbose) console.log(message);
  }

  public async execute(context: WorkflowContext): Promise<void> {
    logger.info('Processing sitemaps...');
    const parser = new XmlParser();
    for (const sitemap of context.sitemaps) {
      const sitemapContent = await this.sitemapFetcher.fetchContent(sitemap);
      logger.debug(`Fetched sitemap content from ${sitemap}: ${sitemapContent.substring(0, 200)}...`);

      const nestedSitemaps = parser.extractNestedSitemaps(sitemapContent);
      logger.info(`Extracted nested sitemaps from ${sitemap}: ${nestedSitemaps}`);

      context.allSitemapUrls.push(...nestedSitemaps);
    }

    logger.info(`Updated WorkflowContext in SitemapProcessor:`);
    logger.debug(`All Sitemap URLs: ${context.allSitemapUrls}`);
  }
}