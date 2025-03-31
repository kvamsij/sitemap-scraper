import { DomainInput } from '../input/domainInput';

describe('DomainInput', () => {
  it('should accept a valid domain name', () => {
    const input = new DomainInput('example.com');
    expect(input.getDomain()).toBe('https://example.com');
  });

  it('should accept a valid domain name with http', () => {
    const input = new DomainInput('http://example.com');
    expect(input.getDomain()).toBe('http://example.com');
  });

  it('should accept a valid domain name with https', () => {
    const input = new DomainInput('https://example.com');
    expect(input.getDomain()).toBe('https://example.com');
  });

  it('should throw an error for an invalid domain name', () => {
    expect(() => new DomainInput('invalid_domain')).toThrow('Invalid domain name: invalid_domain');
  });
});
