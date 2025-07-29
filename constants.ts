import type { Role, Badge } from './types';

// ROLES
export const ROLES: { [key: string]: Role } = {
  ADMIN: { id: 'role-admin', name: 'Admin', color: 'bg-red-500', icon: '👑', permissions: ['*'] },
  EXPERT: { id: 'role-expert', name: 'Uzman', color: 'bg-indigo-500', icon: '🧠', permissions: ['manage_messages'] },
  ACTIVE: { id: 'role-active', name: 'Aktif', color: 'bg-green-500', icon: '🔥', permissions: [] },
  NEWBIE: { id: 'role-newbie', name: 'Yeni Üye', color: 'bg-gray-500', icon: '🔰', permissions: [] },
};

// BADGES
export const BADGES: { [key: string]: Badge } = {
    MSG_100: { id: 'badge-msg-100', name: 'Gezgin', icon: '💬', description: '100 mesaj gönderdi.' },
    CAM_ON: { id: 'badge-cam-on', name: 'Kameraman', icon: '📸', description: 'İlk kez kamerasını açtı.'}
};

export const DEFAULT_SERVER_ICON = 'https://picsum.photos/seed/default/128/128';
