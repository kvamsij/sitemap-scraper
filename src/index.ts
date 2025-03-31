import readline from 'readline';
import { DomainInput } from './input/domainInput';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter a domain name: ', (domain) => {
  try {
    const domainInput = new DomainInput(domain);
    console.log(`Validated domain: ${domainInput.getDomain()}`);
    // Proceed with the next steps, e.g., fetching robots.txt
  } catch (error) {
    console.error((error as Error).message);
  } finally {
    rl.close();
  }
});
