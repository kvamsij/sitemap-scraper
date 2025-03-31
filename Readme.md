# Sitemap Scraper

## Overview

The Sitemap Scraper is a tool designed to extract and process sitemap URLs from a given domain. It reads the `robots.txt` file, identifies sitemaps, and extracts product-specific URLs. The extracted data can be saved in various formats (`csv`, `json`, or `txt`) for further analysis.

## Features

- Fetch and parse `robots.txt` files.
- Extract sitemap URLs, including `.gz` compressed sitemaps.
- Filter product-specific sitemaps and URLs.
- Write extracted URLs to files in `csv`, `json`, or `txt` formats.
- Centralized logging for progress tracking and debugging.
- Configurable concurrency for processing large sitemaps efficiently.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd sitemap-scraper_v0
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Usage

1. Start the application:
   ```bash
   npm start
   ```

2. Follow the prompts:
   - Enter a domain name (e.g., `example.com`).
   - Choose an output format (`csv`, `json`, or `txt`).

3. The extracted URLs will be saved in the `output/` directory, organized by the domain name.

## Folder Structure

```
src/
├── input/                # Handles domain name input
├── fetch/                # Fetches robots.txt and sitemaps
├── parse/                # Parses robots.txt
├── filter/               # Filters product-specific sitemaps and URLs
├── log/                  # Centralized logging system
├── write/                # Writes data to files
├── process/              # Processes sitemaps and URLs
├── tests/                # Unit tests
```

## Scripts

- `npm start`: Run the application.
- `npm test`: Run unit tests using Jest.
- `npm run lint`: Lint the codebase using ESLint.
- `npm run format`: Format the codebase using Prettier.
- `npm run build`: Compile TypeScript files to JavaScript.

## Configuration

- Logging: Logs are saved in the `logs/` directory.
- Output: Extracted URLs are saved in the `output/` directory, organized by domain.

## Testing

Run unit tests:
```bash
npm test
```

## Dependencies

- `axios`: For HTTP requests.
- `csv-writer`: For writing CSV files.
- `xml2js`: For parsing XML sitemaps.
- `slugify`: For generating slugified folder names.
- `winston`: For centralized logging.

## Development Standards

- **Test-Driven Development (TDD)**: Unit tests are written for all modules.
- **SOLID Principles**: The code adheres to SOLID principles for maintainability.
- **Code Quality**: ESLint and Prettier are used to ensure code quality.

## License

This project is licensed under the ISC License.