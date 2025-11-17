import type { StorageService } from '../types/system.types';

export class StorageServiceImpl implements StorageService {
  async get<T>(key: string, defaultValue?: T): Promise<T> {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue as T;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Failed to get ${key} from storage:`, error);
      return defaultValue as T;
    }
  }

  async set(key: string, value: any): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set ${key} in storage:`, error);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key} from storage:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}
