export interface WorkflowStep {
  execute(context: WorkflowContext): Promise<void>;
}

export interface WorkflowContext {
  domain: string; // Added domain property
  sitemaps: string[];
  visited: Set<string>;
  allSitemapUrls: string[];
  disallowedPaths: string[]; // Optional, only for robots.txt
  productUrls: { url: string; lastMod?: string; frequency?: string }[];
}
