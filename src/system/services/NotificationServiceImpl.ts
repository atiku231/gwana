import type { NotificationService } from '../types/system.types';

export class NotificationServiceImpl implements NotificationService {
  private notifications: Map<string, any> = new Map();

  show(title: string, message: string): void {
    const id = Date.now().toString();
    this.notifications.set(id, { title, message });
    
    // Could trigger a toast or notification UI here
    console.log(`Notification: ${title} - ${message}`);
  }

  dismiss(id: string): void {
    this.notifications.delete(id);
  }
}
