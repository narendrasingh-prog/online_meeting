export interface StoredSession {
  id: string;
  userId: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  createdAt: number;
}

export interface SessionStore {
  sessions: StoredSession[];
  activeSessionId: string | null;
}
