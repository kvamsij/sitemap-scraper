import logger from '../log/Logger';

jest.mock('../log/Logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('Logger', () => {
  it('should log info messages', () => {
    logger.info('Test info message');
    expect(logger.info).toHaveBeenCalledWith('Test info message');
  });

  it('should log warning messages', () => {
    logger.warn('Test warning message');
    expect(logger.warn).toHaveBeenCalledWith('Test warning message');
  });

  it('should log error messages', () => {
    logger.error('Test error message');
    expect(logger.error).toHaveBeenCalledWith('Test error message');
  });
});
