import logger from '../log/Logger';
import { AppError, FetchError, ParseError, WriteError } from '../errors/AppError';
import fs from 'fs';
import path from 'path';

export class ErrorHandler {
  private static errorLogPath = path.join('logs', 'errors.log');

  private static logErrorToFile(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(this.errorLogPath, logMessage, 'utf-8');
  }

  public static handleError(error: unknown): void {
    let errorMessage = '';

    if (error instanceof FetchError) {
      errorMessage = `[FetchError] Failed to fetch resource: ${error.message}`;
      logger.error(errorMessage);
      if (error.details) {
        logger.error(`Resource: ${error.details}`);
        errorMessage += `\nResource: ${error.details}`;
      }
    } else if (error instanceof ParseError) {
      errorMessage = `[ParseError] Failed to parse resource: ${error.message}`;
      logger.error(errorMessage);
      if (error.details) {
        logger.error(`Details: ${error.details}`);
        errorMessage += `\nDetails: ${error.details}`;
      }
    } else if (error instanceof WriteError) {
      errorMessage = `[WriteError] Failed to write to file: ${error.message}`;
      logger.error(errorMessage);
      if (error.details) {
        logger.error(`File Path: ${error.details}`);
        errorMessage += `\nFile Path: ${error.details}`;
      }
    } else if (error instanceof AppError) {
      errorMessage = `[${error.name}] ${error.message}`;
      logger.error(errorMessage);
      if (error.details) {
        logger.error(`Details: ${error.details}`);
        errorMessage += `\nDetails: ${error.details}`;
      }
    } else if (error instanceof Error) {
      errorMessage = `[UnknownError] ${error.message}`;
      logger.error(errorMessage);
      logger.error('Exiting application due to an unknown error.');
      this.logErrorToFile(errorMessage);
      process.exit(1); // Exit the application for unknown errors
    } else {
      errorMessage = `[UnknownError] ${JSON.stringify(error)}`;
      logger.error(errorMessage);
      logger.error('Exiting application due to an unknown error.');
      this.logErrorToFile(errorMessage);
      process.exit(1); // Exit the application for unknown errors
    }

    // Log the error to the error log file
    this.logErrorToFile(errorMessage);
  }
}
