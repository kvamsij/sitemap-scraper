export interface IFetcher<T> {
  fetchContent(param: T): Promise<string>;
}
