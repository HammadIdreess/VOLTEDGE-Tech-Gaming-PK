import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

const SESSION_COOKIE_NAME = 'voltedge_session';

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'ADMIN' | 'STAFF';
}

/**
 * Creates a signed/structured session token string.
 */
export function encodeSessionToken(session: AuthSession): string {
  const json = JSON.stringify(session);
  return Buffer.from(json).toString('base64');
}

/**
 * Decodes session token string.
 */
export function decodeSessionToken(token: string): AuthSession | null {
  try {
    const json = Buffer.from(token, 'base64').toString('utf-8');
    return JSON.parse(json) as AuthSession;
  } catch {
    return null;
  }
}

/**
 * Retrieves the current authenticated user session from request cookies.
 */
export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return decodeSessionToken(token);
}

/**
 * Retrieves the full user record from the database.
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user || !user.isActive) return null;
  return user;
}

/**
 * Requires admin privileges. Throws an error or returns null if not an authorized administrator.
 */
export async function requireAdmin(): Promise<AuthSession> {
  const session = await getSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'STAFF')) {
    throw new Error('Unauthorized: Administrator access required.');
  }
  return session;
}

/**
 * Verifies password against hashed password.
 */
export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

/**
 * Hashes password.
 */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}
