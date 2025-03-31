import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import slugify from 'slugify';

export class FileWriter {
  private domain: string;
  private baseDir: string;

  constructor(domain: string, baseDir = 'output') {
    // Remove protocol (http:// or https://) before slugifying
    const domainWithoutProtocol = domain.replace(/^https?:\/\//, '');
    this.domain = slugify(domainWithoutProtocol.replace(/\./g, '-'), { lower: true, strict: true }); // Replace dots with hyphens
    this.baseDir = baseDir;
    this.ensureBaseDir(); // Ensure the base directory exists
  }

  private ensureBaseDir(): void {
    if (!fs.existsSync(this.baseDir)) {
      console.log(`Creating base directory: ${this.baseDir}`);
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  private ensureDomainFolder(): string {
    const domainFolder = path.join(this.baseDir, this.domain);
    if (!fs.existsSync(domainFolder)) {
      console.log(`Creating folder: ${domainFolder}`);
      fs.mkdirSync(domainFolder, { recursive: true });
    } else {
      console.log(`Folder already exists: ${domainFolder}`);
    }
    return domainFolder;
  }

  public async writeUrlsToFile(urls: string[], format: 'csv' | 'json' | 'txt'): Promise<void> {
    if (urls.length === 0) {
      console.log('No URLs to write to the file.');
      return;
    }

    console.log(`Writing ${urls.length} URLs to file in ${format} format...`); // Debug log

    const domainFolder = this.ensureDomainFolder();
    const filePath = path.join(domainFolder, `product_urls.${format}`);
    console.log(`Resolved file path: ${filePath}`);

    try {
      if (format === 'csv') {
        const csvWriter = createObjectCsvWriter({
          path: filePath,
          header: [{ id: 'url', title: 'URL' }],
        });
        const records = urls.map((url) => ({ url }));
        await csvWriter.writeRecords(records);
      } else if (format === 'json') {
        fs.writeFileSync(filePath, JSON.stringify(urls, null, 2));
      } else if (format === 'txt') {
        fs.writeFileSync(filePath, urls.join('\n'));
      }

      console.log(`Successfully wrote ${urls.length} URLs to ${filePath}`);
    } catch (error) {
      console.error(`Failed to write URLs to file: ${(error as Error).message}`);
    }
  }
}
