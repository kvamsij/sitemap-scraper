import { IParser } from '../interfaces/IParser';
import { XmlParser } from './xml-parser';
import { HtmlParser } from './html-parser';
import { RobotsParser } from './robots-parser'; // Import RobotsParser

export class ParserFactory {
  public static createParser(type: 'xml' | 'html' | 'robots', baseDomain?: string): IParser {
    if (type === 'xml') {
      return new XmlParser();
    } else if (type === 'html') {
      if (!baseDomain) {
        throw new Error('baseDomain is required for HtmlParser');
      }
      return new HtmlParser(baseDomain);
    } else if (type === 'robots') {
      return new RobotsParser(''); // Pass an empty string for now; content will be set later
    } else {
      throw new Error(`Unsupported parser type: ${type}`);
    }
  }
}
