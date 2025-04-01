import { IParser } from './IParser';
import { XmlParser } from './xml-parser';
import { HtmlParser } from './html-parser';

export class ParserFactory {
  public static createParser(type: 'xml' | 'html', baseDomain?: string): IParser {
    if (type === 'xml') {
      return new XmlParser();
    } else if (type === 'html') {
      if (!baseDomain) {
        throw new Error('baseDomain is required for HtmlParser');
      }
      return new HtmlParser(baseDomain);
    } else {
      throw new Error(`Unsupported parser type: ${type}`);
    }
  }
}
