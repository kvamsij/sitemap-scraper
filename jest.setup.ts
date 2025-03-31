
// Mock all logger methods to suppress logs during tests
jest.mock('./src/log/Logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));
