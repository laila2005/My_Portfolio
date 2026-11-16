import { track } from '@vercel/analytics';

/**
 * Records a named interaction in Vercel Web Analytics. Page views (including
 * which project pages are opened) are collected automatically; these events add
 * the actions a recruiter takes. Analytics must never break the page, so every
 * failure, including a blocker removing the script, is swallowed.
 */
export const trackEvent = (name: string, data?: Record<string, string | number | boolean>) => {
  try {
    track(name, data);
  } catch {
    /* ignore */
  }
};
