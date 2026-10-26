import { Hono } from 'hono';

// The example is a fragment, not a runnable service: it exists to show where the rules in
// AGENTS.md land in code. Owner scoping (rule 1) is the handoff between handler and query.

export interface Note {
  id: string;
  ownerId: string;
  body: string;
  createdAt: string;
  deletedAt: string | null;
}

export function createNotesRoute(notes: { listByOwner(ownerId: string): Promise<Note[]> }) {
  const app = new Hono();
  app.get('/v1/notes', async (c) => {
    const ownerId = c.get('userId');
    return c.json(await notes.listByOwner(ownerId));
  });
  return app;
}
