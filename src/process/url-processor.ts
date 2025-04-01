import { IFetcher } from '../interfaces/IFetcher';
import { UrlFilter } from '../filter/url-filter';
import { WorkflowStep, WorkflowContext } from './workflow-types';

export class UrlProcessor implements WorkflowStep {
  private urlFetcher: IFetcher<string>;
  private urlFilter: UrlFilter;

  constructor(urlFetcher: IFetcher<string>, urlFilter: UrlFilter) {
    this.urlFetcher = urlFetcher;
    this.urlFilter = urlFilter;
  }

  public async execute(context: WorkflowContext): Promise<void> {
    for (const sitemapUrl of context.allSitemapUrls) {
      const pageContent = await this.urlFetcher.fetchContent(sitemapUrl);
      const pageUrls = pageContent.split('\n').filter((url) => this.urlFilter.isProductUrl(url));
      context.productUrls.push(...pageUrls.map((url) => ({ url })));
    }
  }
}