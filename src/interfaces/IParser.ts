export interface IParser {
  extractUrls(content: string): string[];
  extractNestedSitemaps?(content: string): string[]; // Optional for HTML parsers

  // New method for extracting sitemaps and disallowed paths (specific to robots.txt)
  extractSitemapsAndDisallowedPaths?(content: string): { sitemaps: string[]; disallowedPaths: string[] };
}
