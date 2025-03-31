import { createObjectCsvWriter } from 'csv-writer';

export class CsvWriter {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  public async writeUrlsToFile(urls: string[]): Promise<void> {
    if (urls.length === 0) {
      console.log('No URLs to write to the file.');
      return;
    }

    const csvWriter = createObjectCsvWriter({
      path: this.filePath,
      header: [{ id: 'url', title: 'URL' }],
    });

    const records = urls.map((url) => ({ url }));

    try {
      await csvWriter.writeRecords(records);
      console.log(`Successfully wrote ${urls.length} URLs to ${this.filePath}`);
    } catch (error) {
      console.error(`Failed to write URLs to file: ${(error as Error).message}`);
    }
  }
}
