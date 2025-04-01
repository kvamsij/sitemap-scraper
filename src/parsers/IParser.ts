export interface IParser {
  extractUrls(content: string): string[];
  extractNestedSitemaps?(content: string): string[]; // Optional for HTML parsers
}
