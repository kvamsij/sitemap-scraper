# Sitemap Scraper

## Description

The Sitemap Scraper is a tool that accepts a domain name as input, reads the `robots.txt` file, and extracts sitemap URLs. It handles both standard and `.gz` compressed sitemaps, filters product-specific sitemaps, and recursively fetches URLs from nested sitemaps. The tool also respects the `robots.txt` rules by filtering out disallowed URLs and identifies product URLs using configurable patterns. The extracted data can be logged and written to a file in the desired format.

## Features

- **Domain Validation**:
  - Validates domain name input and ensures it is properly formatted (e.g., adds `https://` if missing).
- **Fetch and Parse `robots.txt`**:
  - Extracts sitemap URLs and disallowed paths from the `robots.txt` file.
- **Sitemap Handling**:
  - Handles both standard and `.gz` compressed sitemaps.
  - Recursively processes nested sitemaps.
  - Filters product-specific sitemaps based on their paths.
- **URL Filtering**:
  - Filters out URLs that match disallowed paths in `robots.txt`.
  - Identifies product URLs using configurable patterns (e.g., `/product/`, `/item/`, `/sku/`, `/p/`, `/products/`, and query parameters like `?productId=`).
- **Output Formats**:
  - Saves extracted product URLs to a file in the desired format (`csv`, `json`, or `txt`).
- **Logging**:
  - Logs events and errors for better debugging.
- **Concurrency Control**:
  - Processes sitemaps in batches with a configurable concurrency limit.

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

3. Choose an output format (`csv`, `json`, or `txt`) when prompted.

4. The application will:
   - Validate the domain.
   - Fetch and parse the `robots.txt` file.
   - Extract sitemap URLs and disallowed paths.
   - Filter product-specific sitemaps.
   - Recursively fetch URLs from nested sitemaps.
   - Filter out URLs that match disallowed paths.
   - Identify and display product URLs based on configurable patterns.
   - Save the extracted product URLs to a file in the chosen format.

## Folder Structure

```
src/
  ├── input/                # Handles domain name input
  ├── fetch/                # Fetches robots.txt and sitemaps
  ├── parse/                # Parses robots.txt
  ├── filter/               # Filters product-specific sitemaps and URLs
  ├── log/                  # (Future) Logging system
  ├── write/                # Writes data to files
  ├── process/              # Processes sitemaps and URLs
  ├── tests/                # Unit tests
```

## Output Organization

- Extracted product URLs are saved in a folder named after the slugified domain (e.g., `example-com` for `example.com`).
- Supported output formats:
  - **CSV**: A `.csv` file with a single column for URLs.
  - **JSON**: A `.json` file containing an array of URLs.
  - **TXT**: A `.txt` file with one URL per line.

Example folder structure for the domain `example.com`:
```
output/
  ├── example-com/
      ├── product_urls.csv
      ├── product_urls.json
      ├── product_urls.txt
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
- A file containing the extracted URLs in the desired format.

## License

This project is licensed under the ISC License.