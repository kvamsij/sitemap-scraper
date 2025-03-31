import logger from '../log/Logger';
import { AppError, FetchError, ParseError, WriteError } from '../errors/AppError';

export class ErrorHandler {
  public static handleError(error: unknown): void {
    if (error instanceof FetchError) {
      logger.error(`[FetchError] Failed to fetch resource: ${error.message}`);
      if (error.details) {
        logger.error(`Resource: ${error.details}`);
      }
    } else if (error instanceof ParseError) {
      logger.error(`[ParseError] Failed to parse resource: ${error.message}`);
      if (error.details) {
        logger.error(`Details: ${error.details}`);
      }
    } else if (error instanceof WriteError) {
      logger.error(`[WriteError] Failed to write to file: ${error.message}`);
      if (error.details) {
        logger.error(`File Path: ${error.details}`);
      }
    } else if (error instanceof AppError) {
      logger.error(`[${error.name}] ${error.message}`);
      if (error.details) {
        logger.error(`Details: ${error.details}`);
      }
    } else if (error instanceof Error) {
      logger.error(`[UnknownError] ${error.message}`);
      logger.error('Exiting application due to an unknown error.');
      process.exit(1); // Exit the application for unknown errors
    } else {
      logger.error(`[UnknownError] ${JSON.stringify(error)}`);
      logger.error('Exiting application due to an unknown error.');
      process.exit(1); // Exit the application for unknown errors
    }
  }
}
