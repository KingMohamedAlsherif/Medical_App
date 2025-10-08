import { ChatSession, Message, TriageLog, User } from '@/types';
import { nanoid } from 'nanoid';
import { database } from './database';

/**
 * Enhanced session store with user authentication support
 */
class SessionStore {
  private sessions = new Map<string, ChatSession>();
  private triageLogs = new Map<string, TriageLog[]>();

  /**
   * Create a new chat session
   */
  createSession(userId?: string): ChatSession {
    const user = userId ? database.getUserById(userId) : undefined;
    
    const session: ChatSession = {
      id: nanoid(),
      userId,
      user: user || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: []
    };
    
    this.sessions.set(session.id, session);
    this.triageLogs.set(session.id, []);
    
    return session;
  }

  /**
   * Create a session for authenticated user
   */
  createAuthenticatedSession(user: User): ChatSession {
    return this.createSession(user.id);
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): ChatSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Add message to session
   */
  addMessage(sessionId: string, content: string, sender: 'user' | 'ai'): Message | null {
    const session = this.getSession(sessionId);
    if (!session) return null;

    const message: Message = {
      id: nanoid(),
      sessionId,
      content,
      sender,
      timestamp: new Date()
    };

    session.messages.push(message);
    session.updatedAt = new Date();
    
    return message;
  }

  /**
   * Get all messages for a session
   */
  getMessages(sessionId: string): Message[] {
    const session = this.getSession(sessionId);
    return session ? session.messages : [];
  }

  /**
   * Add triage log entry
   */
  addTriageLog(log: TriageLog): void {
    const logs = this.triageLogs.get(log.sessionId) || [];
    logs.push(log);
    this.triageLogs.set(log.sessionId, logs);
  }

  /**
   * Get triage logs for a session
   */
  getTriageLogs(sessionId: string): TriageLog[] {
    return this.triageLogs.get(sessionId) || [];
  }

  /**
   * Get all sessions (for admin purposes)
   */
  getAllSessions(): ChatSession[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Delete session (cleanup)
   */
  deleteSession(sessionId: string): boolean {
    const deleted = this.sessions.delete(sessionId);
    this.triageLogs.delete(sessionId);
    return deleted;
  }

  /**
   * Get session count
   */
  getSessionCount(): number {
    return this.sessions.size;
  }

  /**
   * Clear old sessions (cleanup task)
   */
  clearOldSessions(olderThanHours: number = 24): number {
    const cutoffTime = new Date(Date.now() - (olderThanHours * 60 * 60 * 1000));
    let deletedCount = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.updatedAt < cutoffTime) {
        this.deleteSession(sessionId);
        deletedCount++;
      }
    }

    return deletedCount;
  }
}

// Singleton instance
export const sessionStore = new SessionStore();

export default SessionStore;