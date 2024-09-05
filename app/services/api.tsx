import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface ApiResponse {
  message: string;
}

interface ApiClient {
  get: <T = ApiResponse>(url: string) => Promise<AxiosResponse<T>>;
}

const apiClient: AxiosInstance & ApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL as string, 
});

export const getData = async (): Promise<string> => {
  try {
    const response = await apiClient.get<ApiResponse>('/data');
    return response.data.message;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
