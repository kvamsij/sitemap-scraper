import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export interface HttpResponse<T> {
  data?: AxiosResponse<T>['data']; // Use AxiosResponse's data type
  headers?: AxiosResponse['headers']; // Use AxiosResponse's headers type
  error?: string; // Use string for error messages
}

export async function httpRequest<T>(
  url: string,
  config?: AxiosRequestConfig,
  context?: string // Optional context for error messages
): Promise<HttpResponse<T>> {
  try {
    const response = await axios.get<T>(url, config);
    return { data: response.data, headers: response.headers }; // Include headers in the response
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = context
      ? `${context}: Failed to fetch resource: ${url} - ${axiosError.message}`
      : `Failed to fetch resource: ${url} - ${axiosError.message}`;
    return { error: errorMessage }; // Return the full error message
  }
}
