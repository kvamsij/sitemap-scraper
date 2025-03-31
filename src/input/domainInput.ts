export class DomainInput {
  private domain: string;

  constructor(domain: string) {
    if (!this.isValidDomain(domain)) {
      throw new Error(`Invalid domain name: ${domain}`);
    }
    this.domain = domain;
  }

  private isValidDomain(domain: string): boolean {
    const domainRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  }

  public getDomain(): string {
    return this.domain.startsWith('http') ? this.domain : `https://${this.domain}`;
  }
}
