import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { FetchError } from '../errors/AppError';

export async function httpRequest<T>(
  url: string,
  config?: AxiosRequestConfig,
  context?: string // New parameter for error context
): Promise<AxiosResponse<T>> {
  try {
    const response = await axios.get<T>(url, config);
    return response; // Return the entire response object
  } catch (error) {
    const errorMessage = `Failed to fetch resource: ${url} - ${(error as Error).message}`;
    throw new FetchError(url, errorMessage, context ? `${context}: ${errorMessage}` : errorMessage);
  }
}
