/**
 * Central export file for all type definitions
 * Import types from here throughout the application
 */

export * from './auth.types';
export * from './worker.types';
export * from './job.types';
export * from './contract.types';
export * from './contactRequest.types';
export * from './survey.types';

// Common utility types
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}
