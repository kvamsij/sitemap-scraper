export interface FetchResponse {
  data?: string;
  error?: string;
}

export interface IFetcher {
  fetchContent(url: string): Promise<FetchResponse>;
}
