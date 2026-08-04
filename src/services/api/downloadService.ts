import { File, Paths } from 'expo-file-system';
import { createApiError } from './errorHandler';
import { logger } from './logger';
import type { DownloadProgress } from './types';

export type DownloadOptions = {
  url: string;
  fileName?: string;
  onProgress?: (progress: DownloadProgress) => void;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export type DownloadTaskStatus =
  'pending' | 'downloading' | 'paused' | 'completed' | 'failed' | 'cancelled';

export interface DownloadTaskInfo {
  id: string;
  url: string;
  fileName: string;
  status: DownloadTaskStatus;
  progress: number;
  loadedBytes: number;
  totalBytes: number;
  localUri?: string;
  createdAt: number;
  error?: string;
}

class DownloadService {
  private activeDownloads: Map<string, DownloadTaskInfo> = new Map();
  private downloadIdCounter = 0;

  async downloadFile(options: DownloadOptions): Promise<DownloadTaskInfo> {
    const downloadId = `download_${++this.downloadIdCounter}`;
    const fileName = options.fileName || this.extractFileName(options.url);
    const destination = new File(Paths.document, fileName);

    const task: DownloadTaskInfo = {
      id: downloadId,
      url: options.url,
      fileName,
      status: 'downloading',
      progress: 0,
      loadedBytes: 0,
      totalBytes: 0,
      localUri: destination.uri,
      createdAt: Date.now(),
    };

    this.activeDownloads.set(downloadId, task);

    const token = await this.getAuthToken();
    const headers: Record<string, string> = {
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const downloadTask = File.createDownloadTask(options.url, destination, {
      headers,
      onProgress: (data) => {
        task.loadedBytes = data.bytesWritten;
        task.totalBytes = data.totalBytes;
        task.progress =
          data.totalBytes > 0 ? Math.round((data.bytesWritten / data.totalBytes) * 100) : 0;

        if (options.onProgress) {
          options.onProgress({
            loaded: data.bytesWritten,
            total: data.totalBytes,
            progress: task.progress,
          });
        }
      },
    });

    try {
      const result = await downloadTask.downloadAsync();
      if (result) {
        task.status = 'completed';
        task.localUri = result.uri;
        task.progress = 100;
        logger.info('Download completed', { downloadId, fileName });
      }
      return task;
    } catch (error) {
      if (task.status === 'paused') {
        logger.info('Download paused', { downloadId });
        return task;
      }

      task.status = 'failed';
      task.error = (error as Error).message;
      logger.error('Download failed', { downloadId, error: (error as Error).message });
      throw createApiError(error);
    } finally {
      this.activeDownloads.delete(downloadId);
    }
  }

  async pauseDownload(downloadId: string): Promise<void> {
    const task = this.activeDownloads.get(downloadId);
    if (!task) return;

    task.status = 'paused';
    logger.info('Download paused', { downloadId });
  }

  async resumeDownload(downloadId: string): Promise<DownloadTaskInfo | null> {
    const task = this.activeDownloads.get(downloadId);
    if (!task || task.status !== 'paused') return task ?? null;

    task.status = 'downloading';

    const token = await this.getAuthToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const destination = new File(task.localUri || Paths.document, task.fileName);
    const downloadTask = File.createDownloadTask(task.url, destination, {
      headers,
      onProgress: (data) => {
        task.loadedBytes = data.bytesWritten;
        task.totalBytes = data.totalBytes;
        task.progress =
          data.totalBytes > 0 ? Math.round((data.bytesWritten / data.totalBytes) * 100) : 0;
      },
    });

    try {
      const result = await downloadTask.downloadAsync();
      if (result) {
        task.status = 'completed';
        task.localUri = result.uri;
        task.progress = 100;
        logger.info('Download resumed and completed', { downloadId });
      }
      return task;
    } catch (error) {
      task.status = 'failed';
      task.error = (error as Error).message;
      logger.error('Download resume failed', { downloadId, error: (error as Error).message });
      throw createApiError(error);
    }
  }

  async cancelDownload(downloadId: string): Promise<void> {
    const task = this.activeDownloads.get(downloadId);
    if (!task) return;

    task.status = 'cancelled';
    logger.info('Download cancelled', { downloadId });
  }

  getDownloadTask(downloadId: string): DownloadTaskInfo | undefined {
    return this.activeDownloads.get(downloadId);
  }

  getAllDownloadTasks(): DownloadTaskInfo[] {
    return Array.from(this.activeDownloads.values());
  }

  getActiveDownloads(): DownloadTaskInfo[] {
    return Array.from(this.activeDownloads.values()).filter(
      (task) => task.status === 'downloading' || task.status === 'pending'
    );
  }

  clearCompleted(): void {
    this.activeDownloads.forEach((task, id) => {
      if (task.status === 'completed' || task.status === 'cancelled') {
        this.activeDownloads.delete(id);
      }
    });
  }

  private extractFileName(url: string): string {
    try {
      const parts = url.split('/');
      const fileName = parts[parts.length - 1] || 'download';
      return decodeURIComponent(fileName);
    } catch {
      return 'download';
    }
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      const { MMKV } = await import('react-native-mmkv');
      const mmkv = new MMKV();
      return mmkv.getString('access_token') ?? null;
    } catch {
      return null;
    }
  }
}

export const downloadService = new DownloadService();
