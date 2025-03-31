import fs from 'fs';
import path from 'path';
import { FileWriter } from '../write/fileWriter';

describe('FileWriter', () => {
  const domain = 'example.com';
  const baseDir = 'test_output';
  const fileWriter = new FileWriter(domain, baseDir);
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.log = jest.fn(); // Mock console.log
    console.error = jest.fn(); // Mock console.error
  });

  afterEach(() => {
    jest.clearAllMocks();
    console.log = originalConsoleLog; // Restore console.log
    console.error = originalConsoleError; // Restore console.error

    const domainFolder = path.join(baseDir, 'example-com'); // Updated to match slugified domain with hyphen
    if (fs.existsSync(domainFolder)) {
      fs.rmSync(domainFolder, { recursive: true, force: true });
    }
  });

  it('should create a folder and write URLs to a CSV file', async () => {
    const urls = ['https://example.com/product/123', 'https://example.com/item/456'];
    await fileWriter.writeUrlsToFile(urls, 'csv');

    const domainFolder = path.join(baseDir, 'example-com'); // Updated to match slugified domain with hyphen
    const filePath = path.join(domainFolder, 'product_urls.csv');
    expect(fs.existsSync(domainFolder)).toBe(true);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('should create a folder and write URLs to a JSON file', async () => {
    const urls = ['https://example.com/product/123', 'https://example.com/item/456'];
    await fileWriter.writeUrlsToFile(urls, 'json');

    const domainFolder = path.join(baseDir, 'example-com'); // Updated to match slugified domain with hyphen
    const filePath = path.join(domainFolder, 'product_urls.json');
    expect(fs.existsSync(domainFolder)).toBe(true);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('should create a folder and write URLs to a TXT file', async () => {
    const urls = ['https://example.com/product/123', 'https://example.com/item/456'];
    await fileWriter.writeUrlsToFile(urls, 'txt');

    const domainFolder = path.join(baseDir, 'example-com'); // Updated to match slugified domain with hyphen
    const filePath = path.join(domainFolder, 'product_urls.txt');
    expect(fs.existsSync(domainFolder)).toBe(true);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('should not create a file if the URL list is empty', async () => {
    const urls: string[] = [];
    await fileWriter.writeUrlsToFile(urls, 'csv');

    const domainFolder = path.join(baseDir, 'example-com'); // Updated to match slugified domain with hyphen
    expect(fs.existsSync(domainFolder)).toBe(false);
  });
});
