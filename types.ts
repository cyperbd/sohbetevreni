export interface Role {
  id: string;
  name: string;
  color: string; // e.g., 'bg-red-500' or hex '#ff0000'
  icon: string; // Emoji or icon identifier
  permissions: string[]; // e.g., ['kick_members', 'manage_channels']
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface XpEvent {
    reason: string;
    amount: number;
    timestamp: string;
}

export interface User {
  id:string;
  name: string;
  avatarUrl: string;
  password?: string; // For authentication
  serverIds: string[]; // IDs of servers the user is a member of
  status: 'online' | 'offline' | 'idle';
  level: number;
  xp: number;
  xpToNextLevel: number;
  xpHistory: XpEvent[];
  badges: Badge[];
}

// This represents a user within a specific server context
export interface ServerMember {
    user: User;
    roles: Role[];
}

export interface Message {
  id: string;
  author: User; // The base user info
  content: string;
  timestamp: string;
}

export interface Channel {
  id:string;
  name: string;
  messages: Message[];
}

export interface Server {
  id: string; 
  inviteCode: string; // Short, shareable, unique invite code
  name: string;
  imageUrl: string;
  channels: Channel[];
  members: ServerMember[];
  roles: Role[];
  theme: 'cyan' | 'magenta' | 'lime';
}

export interface Invitation {
  id: string;
  serverName: string;
  inviter: string;
  url: string;
}