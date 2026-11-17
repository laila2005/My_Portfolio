import { useEffect, useState } from 'react';

/**
 * Where the Resume button points.
 *
 * It starts at the PDF built into the site, so the button always works. If an
 * uploaded CV is recorded in the store (see the CV tab in /admin) that replaces
 * it a moment after the first paint, and is remembered for the rest of the
 * session. Any failure leaves the built-in PDF in place.
 *
 * Like useContent, this is one small read-only request, so the Supabase library
 * stays out of the public bundle.
 */
export const BUILT_IN_CV = '/Laila_Mohamed_CV.pdf';

const KEY = 'cv:v1';
const listeners = new Set<() => void>();
let current: string | null = null;
let loaded = false;

const base = () => (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? '';

/** Only ever link to a file in our own store, whatever the row says. */
const safe = (url: unknown): url is string =>
  typeof url === 'string' && base() !== '' && url.startsWith(`${base()}/storage/v1/object/public/`);

const readSession = () => {
  try {
    const stored = sessionStorage.getItem(KEY);
    return safe(stored) ? stored : null;
  } catch {
    return null;
  }
};

async function load() {
  if (loaded) return;
  loaded = true;
  const url = base();
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !key) return;
  try {
    const response = await fetch(`${url}/rest/v1/site_settings?key=eq.cv&select=value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!response.ok) return;
    const rows = (await response.json()) as { value?: { url?: unknown } }[];
    const found = rows[0]?.value?.url;
    current = safe(found) ? found : null;
    try {
      if (current) sessionStorage.setItem(KEY, current);
      else sessionStorage.removeItem(KEY);
    } catch {
      /* private mode: the in-memory value still works */
    }
    listeners.forEach(notify => notify());
  } catch {
    /* offline or blocked: keep the built-in CV */
  }
}

/** Called by the admin after an upload or removal, so the next read is fresh. */
export function resetCv() {
  current = null;
  loaded = false;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach(notify => notify());
}

export function useCvUrl(): string {
  const [, force] = useState(0);

  useEffect(() => {
    const notify = () => force(n => n + 1);
    listeners.add(notify);
    if (current === null) {
      const cached = readSession();
      if (cached) {
        current = cached;
        notify();
      }
    }
    // Wait a moment so this never competes with the first paint.
    const timer = window.setTimeout(() => void load(), 600);
    return () => {
      window.clearTimeout(timer);
      listeners.delete(notify);
    };
  }, []);

  return current ?? BUILT_IN_CV;
}
