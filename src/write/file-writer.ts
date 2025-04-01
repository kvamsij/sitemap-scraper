import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import slugify from 'slugify';
import logger from '../log/Logger';
import { WriteError } from '../errors/AppError';
import { IFileWriter } from '../interfaces/IFileWriter';

export class FileWriter implements IFileWriter {
  private domain: string;
  private baseDir: string;

  constructor(domain: string, baseDir = 'output') {
    const domainWithoutProtocol = domain.replace(/^https?:\/\//, '');
    this.domain = slugify(domainWithoutProtocol.replace(/\./g, '-'), { lower: true, strict: true });
    this.baseDir = baseDir;
    this.ensureBaseDir();
  }

  private ensureBaseDir(): void {
    if (!fs.existsSync(this.baseDir)) {
      logger.info(`Creating base directory: ${this.baseDir}`);
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  private ensureDomainFolder(): string {
    const domainFolder = path.join(this.baseDir, this.domain);
    if (!fs.existsSync(domainFolder)) {
      logger.info(`Creating folder: ${domainFolder}`);
      fs.mkdirSync(domainFolder, { recursive: true });
    } else {
      logger.info(`Folder already exists: ${domainFolder}`);
    }
    return domainFolder;
  }

  public async writeUrlsToFile(urls: string[], format: 'csv' | 'json' | 'txt'): Promise<void> {
    if (urls.length === 0) {
      logger.warn('No URLs to write to the file.');
      return;
    }

    logger.info(`Writing ${urls.length} URLs to file in ${format} format...`);
    logger.debug(`URLs to be written: ${JSON.stringify(urls)}`);

    const domainFolder = this.ensureDomainFolder();
    const filePath = path.join(domainFolder, `product_urls.${format}`);
    logger.info(`Resolved file path: ${filePath}`);

    try {
      if (format === 'csv') {
        const csvWriter = createObjectCsvWriter({
          path: filePath,
          header: [{ id: 'url', title: 'URL' }],
        });
        const records = urls.map((url) => ({ url }));
        await csvWriter.writeRecords(records);
      } else if (format === 'json') {
        fs.writeFileSync(filePath, JSON.stringify(urls, null, 2), 'utf-8');
      } else if (format === 'txt') {
        fs.writeFileSync(filePath, urls.join('\n'), 'utf-8');
      }

      logger.info(`Successfully wrote ${urls.length} URLs to ${filePath}`);
    } catch (error) {
      throw new WriteError(`Failed to write URLs to file: ${filePath}`, (error as Error).message);
    }
  }
}