import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

export type BaseStyles = {
  container?: ViewStyle;
  text?: TextStyle;
  image?: ImageStyle;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  status: 'success' | 'error';
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type ApiError = {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, any>;
};
