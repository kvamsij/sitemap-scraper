import { IFetcher } from '../interfaces/IFetcher';
import { XmlParser } from '../parsers/xml-parser';
import { WorkflowContext, WorkflowStep } from './workflow-types';

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
    const parser = new XmlParser();

    for (const sitemap of context.sitemaps) {
      const sitemapContent = await this.sitemapFetcher.fetchContent(sitemap);
      const nestedSitemaps = parser.extractNestedSitemaps(sitemapContent);
      context.allSitemapUrls.push(...nestedSitemaps);
    }
  }
}