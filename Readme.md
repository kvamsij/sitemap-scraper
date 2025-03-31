# Sitemap Scraper

## Description

The Sitemap Scraper is a tool that accepts a domain name as input, reads the `robots.txt` file, and extracts sitemap URLs. It handles both standard and `.gz` compressed sitemaps, filters product-specific sitemaps, and recursively fetches URLs from nested sitemaps. The tool also respects the `robots.txt` rules by filtering out disallowed URLs and identifies product URLs using configurable patterns. The extracted data can be logged and written to a CSV file.

## Features

- Validates domain name input.
- Fetches and parses `robots.txt` to extract sitemap URLs and disallowed paths.
- Filters out URLs that match disallowed paths in `robots.txt`.
- Handles `.gz` compressed sitemaps.
- Filters product-specific sitemaps.
- Recursively processes nested sitemaps.
- Extracts URLs from sitemaps.
- Identifies product URLs using configurable patterns (e.g., `/product/`, `/item/`, `/sku/`, `/p/`, `/products/`, and query parameters like `?productId=`).
- Logs events and errors.

## Setup

### Prerequisites

- Node.js (v16 or later)
- npm (v8 or later)

### Installation

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

4. Run tests to ensure everything is working:
   ```bash
   npm run test
   ```

## Usage

1. Start the application:
   ```bash
   npm start
   ```

2. Enter a domain name when prompted (e.g., `example.com`).

3. The application will:
   - Validate the domain.
   - Fetch and parse the `robots.txt` file.
   - Extract sitemap URLs and disallowed paths.
   - Filter product-specific sitemaps.
   - Recursively fetch URLs from nested sitemaps.
   - Filter out URLs that match disallowed paths.
   - Identify and display product URLs based on configurable patterns.

## Folder Structure

```
src/
  ├── input/                # Handles domain name input
  ├── fetch/                # Fetches robots.txt and sitemaps
  ├── parse/                # Parses robots.txt
  ├── filter/               # Filters product-specific sitemaps and URLs
  ├── log/                  # (Future) Logging system
  ├── write/                # (Future) Writes data to CSV
  ├── tests/                # Unit tests
```

## Development

### Scripts

- **Build**: Compile TypeScript to JavaScript:
  ```bash
  npm run build
  ```

- **Start**: Run the application:
  ```bash
  npm start
  ```

- **Test**: Run unit tests:
  ```bash
  npm run test
  ```

- **Lint**: Check code quality:
  ```bash
  npm run lint
  ```

- **Format**: Format code using Prettier:
  ```bash
  npm run format
  ```

### Standards

- **Test-Driven Development (TDD)**: Write unit tests for each class and method.
- **SOLID Principles**: Ensure maintainable and scalable code.
- **Centralized Logging**: Use `winston` for logging (future implementation).
- **Centralized Error Handling**: Gracefully handle exceptions.

## Deliverables

- A fully functional sitemap scraper.
- Unit tests with high coverage.
- Documentation for usage and development.
- A CSV file containing the extracted URLs (future implementation).

## License

This project is licensed under the ISC License.