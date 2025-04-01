import { ParserFactory } from './parser-factory';
import { IParser } from './IParser';

export class ContentParser {
  private parser: IParser;

  constructor(type: 'xml' | 'html') {
    this.parser = ParserFactory.createParser(type);
  }

  public extractUrls(content: string): string[] {
    return this.parser.extractUrls(content);
  }

  public extractNestedSitemaps(content: string): string[] {
    if (this.parser.extractNestedSitemaps) {
      return this.parser.extractNestedSitemaps(content);
    }
    throw new Error('Nested sitemaps are not supported for this parser type.');
  }
}
