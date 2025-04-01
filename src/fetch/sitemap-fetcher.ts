import { IFetcher } from '../interfaces/IFetcher';
import { httpRequest } from '../utils/HttpClient';

export class SitemapFetcher implements IFetcher<string> {
  public async fetchContent(url: string): Promise<string> {

    const response = await httpRequest<string>(url, undefined, 'Fetching sitemap content');

    if (response.error) {
      throw new Error(`Failed to fetch sitemap from ${url}: ${response.error}`);
    }

    if (!response.data) {
      throw new Error(`No content received from ${url}`);
    }

    return response.data;
  }
}