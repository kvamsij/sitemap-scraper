import { CsvWriter } from '../write/csvWriter';
import { createObjectCsvWriter } from 'csv-writer';

jest.mock('csv-writer', () => ({
  createObjectCsvWriter: jest.fn(),
}));

describe('CsvWriter', () => {
  const filePath = 'test_output.csv';
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
  });

  it('should write URLs to a CSV file', async () => {
    const urls = ['https://example.com/product/123', 'https://example.com/item/456'];
    const mockWriteRecords = jest.fn().mockResolvedValueOnce(undefined);
    (createObjectCsvWriter as jest.Mock).mockReturnValue({ writeRecords: mockWriteRecords });

    const csvWriter = new CsvWriter(filePath);
    await csvWriter.writeUrlsToFile(urls);

    expect(createObjectCsvWriter).toHaveBeenCalledWith({
      path: filePath,
      header: [{ id: 'url', title: 'URL' }],
    });
    expect(mockWriteRecords).toHaveBeenCalledWith([
      { url: 'https://example.com/product/123' },
      { url: 'https://example.com/item/456' },
    ]);
  });

  it('should not write to a file if the URL list is empty', async () => {
    const urls: string[] = [];
    const mockWriteRecords = jest.fn();
    (createObjectCsvWriter as jest.Mock).mockReturnValue({ writeRecords: mockWriteRecords });

    const csvWriter = new CsvWriter(filePath);
    await csvWriter.writeUrlsToFile(urls);

    expect(createObjectCsvWriter).not.toHaveBeenCalled();
    expect(mockWriteRecords).not.toHaveBeenCalled();
  });

  it('should handle errors during file writing', async () => {
    const urls = ['https://example.com/product/123'];
    const mockWriteRecords = jest.fn().mockRejectedValueOnce(new Error('File system error'));
    (createObjectCsvWriter as jest.Mock).mockReturnValue({ writeRecords: mockWriteRecords });

    const csvWriter = new CsvWriter(filePath);
    await expect(csvWriter.writeUrlsToFile(urls)).resolves.not.toThrow();

    expect(createObjectCsvWriter).toHaveBeenCalledWith({
      path: filePath,
      header: [{ id: 'url', title: 'URL' }],
    });
    expect(mockWriteRecords).toHaveBeenCalledWith([{ url: 'https://example.com/product/123' }]);
  });
});
