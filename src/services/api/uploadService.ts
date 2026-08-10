import { File, UploadType } from 'expo-file-system';
import { createApiError } from './errorHandler';
import { logger } from './logger';
import { secureStorage } from '@/services/storage/secureStorage';
import type { UploadProgress } from './types';

export type UploadFile = {
  uri: string;
  type: string;
  name: string;
  size?: number;
};

export type UploadOptions = {
  file: UploadFile;
  url: string;
  fieldName?: string;
  onProgress?: (progress: UploadProgress) => void;
  headers?: Record<string, string>;
  extraFields?: Record<string, any>;
  signal?: AbortSignal;
};

export type ChunkUploadOptions = {
  file: UploadFile;
  chunkSize: number;
  url: string;
  onProgress?: (progress: UploadProgress) => void;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

class UploadService {
  private activeUploads: Map<
    string,
    { task: ReturnType<typeof File.prototype.createUploadTask>; id: string }
  > = new Map();
  private uploadIdCounter = 0;

  async uploadFile(options: UploadOptions): Promise<any> {
    const uploadId = `upload_${++this.uploadIdCounter}`;

    try {
      const sourceFile = new File(options.file.uri);
      const token = await this.getAuthToken();
      const headers: Record<string, string> = {
        ...options.headers,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const task = sourceFile.createUploadTask(options.url, {
        httpMethod: 'POST',
        uploadType: UploadType.MULTIPART,
        fieldName: options.fieldName || 'file',
        headers,
        onProgress: (data) => {
          if (options.onProgress) {
            const progress: UploadProgress = {
              loaded: data.bytesSent,
              total: data.totalBytes,
              progress:
                data.totalBytes > 0 ? Math.round((data.bytesSent / data.totalBytes) * 100) : 0,
            };
            options.onProgress(progress);
          }
        },
      });

      this.activeUploads.set(uploadId, { task, id: uploadId });

      const result = await task.uploadAsync();
      logger.info('Upload successful', { uploadId, url: options.url });
      return result;
    } catch (error) {
      if ((error as any)?.name === 'AbortError') {
        logger.warn('Upload cancelled', { uploadId });
        throw new Error('Upload cancelled');
      }
      logger.error('Upload failed', { uploadId, error: (error as Error).message });
      throw createApiError(error);
    } finally {
      this.activeUploads.delete(uploadId);
    }
  }

  async uploadWithRetry(options: UploadOptions, maxRetries = 3): Promise<any> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.uploadFile(options);
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries) {
          const delay = 1000 * Math.pow(2, attempt - 1);
          logger.warn(`Upload retry attempt ${attempt}/${maxRetries}`, { delay });
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Upload failed');
  }

  cancelUpload(uploadId: string): void {
    const entry = this.activeUploads.get(uploadId);
    if (entry) {
      entry.task.cancel();
      this.activeUploads.delete(uploadId);
      logger.info('Upload cancelled', { uploadId });
    }
  }

  cancelAllUploads(): void {
    this.activeUploads.forEach((entry) => entry.task.cancel());
    this.activeUploads.clear();
    logger.info('All uploads cancelled');
  }

  getActiveUploads(): string[] {
    return Array.from(this.activeUploads.keys());
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      return await secureStorage.getAccessToken();
    } catch {
      return null;
    }
  }
}

export const uploadService = new UploadService();
