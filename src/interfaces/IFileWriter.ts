export interface IFileWriter {
  writeUrlsToFile(urls: string[], format: 'txt' | 'csv' | 'json'): Promise<void>;
}
