import type { ISession, IUser } from 'database';
import type { Socket } from 'socket.io';

// ---------------------------------------------------------------------------
// Typed socket interface
// ---------------------------------------------------------------------------
// Every connected socket — authenticated or not — carries an ISession.
// Authenticated sockets additionally carry an IUser.
// ---------------------------------------------------------------------------

export interface AuthenticatedSocket extends Socket {
  /** Always present after middleware. Upserted from sessionId on handshake. */
  session: ISession;
}
