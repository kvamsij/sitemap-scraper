# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Fixed
- Corrected inconsistent casing for `sitemapProcessor.ts` file to resolve TypeScript import conflict.
- Corrected case-sensitive import issue for `SitemapProcessor` in `index.ts`.
- Renamed `fetchUrlsRecursively` to `process` in `SitemapProcessor` to resolve method mismatch error.
- Fixed missing arguments (`visited` and `format`) when calling `SitemapProcessor.process` in `index.ts`.
- Corrected syntax issues in `index.ts` for `WorkflowStep` and `WorkflowContext` definitions.
- Verified and fixed import paths for `WorkflowStep` and `WorkflowContext` in `robots-processor.ts`, `sitemap-processor.ts`, and `url-processor.ts`.
- Corrected syntax issues and incomplete code in `index.ts` for `Processor` instantiation and execution.
- Added missing imports for `RobotsFetcher`, `SitemapFetcher`, and `UrlFilter` in `index.ts`.
- Resolved TypeScript error in `SitemapFetcher` by ensuring it fully implements the `ISitemapFetcher` interface.
- Added `domain` property to `WorkflowContext` to resolve TypeScript error in `RobotsProcessor`.
- Updated `Processor` class to accept an initial `WorkflowContext` with the `domain` property.
- Updated `index.ts` to pass the `domain` property to the `WorkflowContext`.

### Changed
- Refactored `index.ts` to use the pipeline workflow with `Processor` and `WorkflowStep` implementations.
- Updated `index.ts` to initialize and pass `WorkflowContext` to the `Processor`.
- Replaced direct fetcher and parser calls with `RobotsProcessor`, `SitemapProcessor`, and `UrlProcessor`.
- Used `FileWriter` to save extracted product URLs in the specified format.
- Renamed files in the `process` folder for consistency:
  - `robotsProcessor.ts` → `robots-processor.ts`
  - `SitemapProcessor.ts` → `sitemap-processor.ts`
  - `urlProcessor.ts` → `url-processor.ts`
- Renamed files for consistency:
  - `robotsFetcher.ts` → `robots-fetcher.ts`
  - `SitemapFetcher.ts` → `sitemap-fetcher.ts`
  - `UrlFilter.ts` → `url-filter.ts`
  - `fileWriter.ts` → `file-writer.ts`
- Removed file-writing logic from `Processor` to adhere to SRP.
- Delegated file-writing logic to `FileWriter` in `Processor`.
- Refactored `Processor` to use a pipeline approach for extensibility.
- Updated `RobotsProcessor`, `SitemapProcessor`, and `UrlProcessor` to implement a common `WorkflowStep` interface.
- Moved `WorkflowStep` and `WorkflowContext` definitions to `workflow-types.ts` for better modularity.
- Updated imports in `index.ts`, `robots-processor.ts`, `sitemap-processor.ts`, and `url-processor.ts` to use `workflow-types.ts`.
- Updated `RobotsParser` to ensure sitemap URLs are unique.
- Added unit tests in `robotsParser.test.ts` to verify unique sitemap URLs.
- Updated `SitemapProcessor` to use `SitemapHandler` for processing individual sitemaps.
- Renamed `index.ts` to `app-processor.ts` for better clarity.
- Renamed `sitemap-handler.ts` to `processor-handler.ts` for consistency.
- Updated imports in `sitemap-processor.ts` to reflect the new filename for `processor-handler.ts`.
- Moved the logic for processing sitemaps back into `SitemapProcessor` to adhere to SRP.
- Refactored `SitemapProcessor` to focus on filtering and processing sitemap URLs.
- Refactored `UrlProcessor` to handle filtering and processing individual URLs.
- Renamed `productSitemapFilter.ts` to `sitemap-filters.ts`.
- Updated the class name from `ProductSitemapFilter` to `SitemapFilters`.
- Updated `SitemapProcessor` to use `SitemapFilters` for filtering product-specific sitemaps.
- Moved the logic from `src\process\index.ts` to the main `index.ts` file to make it the entry point for the application.
- Updated `RobotsFetcher`, `SitemapFetcher`, `UrlFilter`, and `FileWriter` to implement their respective interfaces.
- Updated the main workflow in `index.ts` to use interfaces instead of concrete classes.
- Refactored `RobotsFetcher` to use `httpRequest` from `HttpClient.ts` for consistent HTTP request handling.
- Refactored `SitemapFetcher` to use `httpRequest` from `HttpClient.ts` for consistent HTTP request handling.
- Renamed `sitemapUrlFetcher.ts` to `url-fetcher.ts` for consistency.
- Refactored `SitemapUrlFetcher` to `UrlFetcher` to improve clarity and modularity.
- Updated imports in `sitemap-processor.ts` to reflect the new filename for `url-fetcher.ts`.
- Refactored `UrlFetcher` to focus only on fetching and processing URLs.
- Refactored `SitemapFetcher` to handle all sitemap-related logic.
- Updated `UrlProcessor` to use the refactored `UrlFetcher`.
- Updated `UrlFetcher` to use the `httpRequest` function from `HttpClient.ts` for fetching sitemap content.
- Updated `SitemapFetcher` to use the `httpRequest` function from `HttpClient.ts` for fetching sitemap content.
- Refactored `RobotsParser` to include error handling, logging, and reusable helper methods.
- Updated unit tests for `RobotsParser` to cover edge cases and ensure full coverage.
- Renamed `parse` folder to `parsers`.
- Updated `SitemapFetcher` to use `XmlParser` and `HtmlParser` for parsing sitemaps based on content type.
- Replaced `XmlParser` and `HtmlParser` with a unified `CheerioParser` for handling both XML and HTML parsing.
- Updated `SitemapFetcher` to use `CheerioParser` for parsing sitemaps.
- Updated `SitemapFetcher` to use `SitemapParser` and `UrlParser` from the `xml-parsers` folder.
- Refactored `HtmlParser` to use `cheerio` instead of `jsdom` for parsing HTML content.
- Refactored `XmlParser` to use `cheerio` for XML parsing.
- Updated `ContentParser` to find nested sitemaps for both XML and HTML content.
- Updated `HtmlParser` to support extracting potential nested sitemaps by filtering links for `.xml` files or URLs containing "sitemap".
- Updated `HtmlParser` to filter links by the same domain as the `baseDomain` parameter.
- Updated `HtmlParser` to accept a `baseDomain` parameter for filtering links by domain.
- Updated `ParserFactory` to pass `baseDomain` to `HtmlParser`.
- Updated `ContentParser` to accept and pass `baseDomain` to the `ParserFactory`.
- Refactored `RobotsFetcher` to focus solely on fetching `robots.txt` content.
- Refactored `SitemapFetcher` to focus solely on fetching sitemap content.
- Refactored `UrlFetcher` to focus solely on fetching content from URLs.
- Removed parsing functionality from fetchers and delegated it to processors.
- Created a generic `IFetcher` interface for unified fetching functionality.
- Updated `IRobotsFetcher` and `ISitemapFetcher` to extend `IFetcher`.
- Updated `UrlFetcher`, `RobotsFetcher`, and `SitemapFetcher` to implement `IFetcher`.
- Updated `IFetcher` interface to be generic (`IFetcher<T>`) to support different parameter types.
- Updated `RobotsFetcher` to implement `IFetcher<string>` and accept a domain as input.
- Updated `SitemapFetcher` to implement `IFetcher<string>` and accept a URL as input.
- Updated `UrlFetcher` to implement `IFetcher<string>` and accept a URL as input.
- Updated `RobotsProcessor` to use the generic `IFetcher<string>` interface for fetching robots.txt content.
- Updated `SitemapProcessor` to use the generic `IFetcher<string>` interface for fetching sitemap content and delegate parsing to `XmlParser`.
- Updated `UrlProcessor` to use the generic `IFetcher<string>` interface for fetching page content and delegate filtering to `UrlFilter`.

### Removed
- Removed the dependency on `ProcessHandler` from `SitemapProcessor`.
- Deleted the `processor-handler.ts` file as it is no longer needed.
- Removed `ProcessorHandler` as its functionality has been distributed between `SitemapProcessor` and `UrlProcessor`.
- Deleted `src\process\index.ts` as its logic has been moved to the main `index.ts`.
- Deleted `IRobotsFetcher.ts` as its functionality is now covered by the generic `IFetcher<T>` interface.
- Deleted `ISitemapFetcher.ts` as its functionality is now covered by the generic `IFetcher<T>` interface.

### Added
- Created `RobotsProcessor` to handle fetching and parsing `robots.txt`.
- Refactored `SitemapProcessor` to focus on processing sitemap URLs and filtering product-specific sitemaps.
- Created `UrlProcessor` to fetch and filter product URLs from sitemap XML content.
- Renamed `SitemapProcessor` to `index.ts` and refactored it into the `Processor` class to orchestrate the workflow.
- Created `SitemapHandler` class to handle the logic for processing a single sitemap.
- Created interfaces for key components:
  - `IRobotsFetcher`
  - `ISitemapFetcher`
  - `IUrlFilter`
  - `IFileWriter`
- Created `XmlParser` to handle parsing of XML sitemaps.
- Created `HtmlParser` to handle parsing of HTML sitemaps.
- Created `SitemapParser` in `xml-parsers` to handle parsing of nested sitemaps from XML content.
- Created `UrlParser` in `xml-parsers` to handle extracting page URLs from XML content.
- Created `IParser` interface to define the contract for all parsers.
- Implemented `XmlParser` for parsing XML sitemaps.
- Implemented `HtmlParser` for parsing HTML sitemaps.
- Created `ParserFactory` to dynamically create parsers based on the input type.
- Updated `ContentParser` to use `ParserFactory` for dynamic parser selection.
- Created `ContentParser` in `parsers/index.ts` to identify content type (XML or HTML) and use the appropriate parser via the `ParserFactory`.
