export class AppError extends Error {
  public readonly name: string;
  public readonly details?: string;

  constructor(message: string, details?: string) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InputError extends AppError {
  constructor(details?: string) {
    super('Invalid input provided.', details);
  }
}

export class FetchError extends AppError {
  constructor(resource: string, details?: string, customMessage?: string) {
    super(customMessage || `Failed to fetch resource: ${resource}`, details);
  }
}

export class ParseError extends AppError {
  constructor(resource: string, details?: string) {
    super(`Failed to parse resource: ${resource}`, details);
  }
}

export class ProcessingError extends AppError {
  constructor(details?: string) {
    super('An error occurred during processing.', details);
  }
}

export class WriteError extends AppError {
  constructor(filePath: string, details?: string) {
    super(`Failed to write to file: ${filePath}`, details);
  }
}
