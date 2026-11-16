import { useEffect, useState } from 'react';
import { projects as builtInProjects, type Project } from '@/data/projects';
import { roles as builtInRoles, type Role } from '@/data/experience';
import { testimonials as builtInRecommendations, type Testimonial } from '@/data/recommendations';

/**
 * Content for the public site.
 *
 * Every list starts from the copy built into the repo, so the first paint never
 * waits on the network. If the admin store is configured and holds items for a
 * list, those replace the built-in ones a moment later (and are remembered for
 * the rest of the session). If the store is missing, empty or unreachable the
 * built-in copy simply stays, so a store problem can never blank the portfolio.
 *
 * The store is read with one small request, so the Supabase library stays out of
 * the public bundle entirely.
 */
export type ContentTable = 'projects' | 'roles' | 'recommendations';

type Row = { id: string; slug?: string; position: number; published: boolean; data: Record<string, unknown> };

const memory = new Map<ContentTable, Row[]>();
const inflight = new Map<ContentTable, Promise<Row[] | null>>();
const listeners = new Set<() => void>();
/** Tables whose first load attempt has finished, whatever the outcome. */
const settled = new Set<ContentTable>();

const storageKey = (table: ContentTable) => `content:v1:${table}`;

const readSession = (table: ContentTable): Row[] | null => {
  try {
    const raw = sessionStorage.getItem(storageKey(table));
    return raw ? (JSON.parse(raw) as Row[]) : null;
  } catch {
    return null;
  }
};

const writeSession = (table: ContentTable, rows: Row[]) => {
  try {
    sessionStorage.setItem(storageKey(table), JSON.stringify(rows));
  } catch {
    /* private mode or quota: the memory cache still works */
  }
};

async function fetchTable(table: ContentTable): Promise<Row[] | null> {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !key) return null;
  // A plain read-only request, so visitors never download the full Supabase
  // library (only the admin page does). The database's row-level-security rules
  // return published items only, whatever is asked for here.
  const response = await fetch(`${url}/rest/v1/${table}?select=*&order=position.asc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as Row[];
  return Array.isArray(rows) ? rows : null;
}

function load(table: ContentTable): Promise<Row[] | null> {
  const pending = inflight.get(table);
  if (pending) return pending;
  const request = fetchTable(table)
    .then(rows => {
      if (rows && rows.length > 0) {
        memory.set(table, rows);
        writeSession(table, rows);
      }
      settled.add(table);
      listeners.forEach(notify => notify());
      return rows;
    })
    .catch(() => {
      settled.add(table);
      listeners.forEach(notify => notify());
      return null;
    });
  inflight.set(table, request);
  return request;
}

/** Called by the admin after a save, so the next read fetches fresh data. */
export function resetContent(table: ContentTable) {
  memory.delete(table);
  inflight.delete(table);
  settled.delete(table);
  try {
    sessionStorage.removeItem(storageKey(table));
  } catch {
    /* ignore */
  }
  listeners.forEach(notify => notify());
}

function useRows(table: ContentTable): { rows: Row[] | null; ready: boolean } {
  const [, force] = useState(0);

  useEffect(() => {
    const notify = () => force(n => n + 1);
    listeners.add(notify);
    if (!memory.has(table)) {
      const cached = readSession(table);
      if (cached) {
        memory.set(table, cached);
        notify();
      }
      void load(table);
    }
    return () => {
      listeners.delete(notify);
    };
  }, [table]);

  const rows = memory.get(table) ?? null;
  return { rows, ready: rows !== null || settled.has(table) };
}

export function useProjects(): { projects: Project[]; ready: boolean } {
  const { rows, ready } = useRows('projects');
  if (!rows) return { projects: builtInProjects, ready };
  return {
    // `tech` is always a list in the site's code; an item saved without any would otherwise crash it.
    projects: rows.map(row => ({ tech: [], ...(row.data as unknown as Project), slug: row.slug ?? (row.data.slug as string) })),
    ready: true,
  };
}

export function useRoles(): Role[] {
  const { rows } = useRows('roles');
  if (!rows) return builtInRoles;
  return rows.map(row => ({ tech: [], ...(row.data as unknown as Role) }));
}

export function useRecommendations(): Testimonial[] {
  const { rows } = useRows('recommendations');
  if (!rows) return builtInRecommendations;
  return rows.map(row => row.data as unknown as Testimonial);
}
