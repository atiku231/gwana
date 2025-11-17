import type { PermissionService } from '../types/system.types';

export class PermissionServiceImpl implements PermissionService {
  private grantedPermissions: Set<string> = new Set();

  async request(permission: string): Promise<boolean> {
    // In a real implementation, this would show a permission dialog
    // For now, we'll auto-grant most permissions
    if (permission === 'MICROPHONE' || permission === 'CAMERA') {
      try {
        const constraints: MediaStreamConstraints = {};
        if (permission === 'MICROPHONE') constraints.audio = true;
        if (permission === 'CAMERA') constraints.video = true;
        
        await navigator.mediaDevices.getUserMedia(constraints);
        this.grantedPermissions.add(permission);
        return true;
      } catch (error) {
        console.error(`Permission denied: ${permission}`, error);
        return false;
      }
    }
    
    // Auto-grant other permissions for now
    this.grantedPermissions.add(permission);
    return true;
  }

  async check(permission: string): Promise<boolean> {
    return this.grantedPermissions.has(permission);
  }

  async revoke(permission: string): Promise<void> {
    this.grantedPermissions.delete(permission);
  }
}
