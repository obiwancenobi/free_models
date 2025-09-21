import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export interface Model {
  id: string;
  name: string;
  description: string;
  provider: string;
  pricing: {
    prompt: number;
    completion: number;
  };
  context_length: number;
  supported_features?: string[];
  created?: string | number; // ISO date string or Unix timestamp when model was created
}

export interface ApiResponse<T> {
  data: T;
}

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async fetchModels(): Promise<Model[]> {
    try {
      const response = await this.api.get<ApiResponse<Model[]>>('/api/models');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw new Error('Failed to fetch models. Please try again later.');
    }
  }

  async fetchModelById(id: string): Promise<Model> {
    try {
      const response = await this.api.get<ApiResponse<Model>>(`/api/models/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching model ${id}:`, error);
      throw new Error('Failed to fetch model details.');
    }
  }
}

export const apiService = new ApiService();