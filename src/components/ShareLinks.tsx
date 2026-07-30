import { useEffect, useState } from 'react';
import { Check, Copy, Linkedin, Share2 } from 'lucide-react';

/**
 * Share controls for a project page, post, or case study.
 *
 * The page's social card is generated at build time by scripts/prerender-meta.mjs
 * — that script is what makes a shared link show this page's own title, summary
 * and cover image rather than the homepage's. If a shared card ever looks wrong,
 * check that script before changing anything here.
 *
 * Behaviour is intentionally layered rather than clever:
 *  - Copy link always works, including in browsers that block clipboard access.
 *  - LinkedIn is a direct share URL, because that is what it is mostly used for.
 *  - The native share sheet only appears where the browser actually provides one
 *    (phones, mostly), so desktop never gets a button that does nothing.
 */
const ShareLinks = ({ title, label = 'Share this page' }: { title: string; label?: string }) => {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  // Read on the client only: `navigator.share` is absent during the build, and a
  // component that assumed otherwise would render a dead button on desktop.
  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(timer);
  }, [copied]);

  const url = typeof window === 'undefined' ? '' : window.location.href;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard API needs a secure context and permission. Fall back to a
      // selection-based copy so the button still does its job.
      const field = document.createElement('textarea');
      field.value = url;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand('copy');
        setCopied(true);
      } catch {
        // Nothing left to try: leave the button unchanged rather than claiming
        // success. The URL is in the address bar either way.
      }
      document.body.removeChild(field);
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // A cancelled share sheet rejects. That is not an error worth surfacing.
    }
  };

  const buttonBase =
    'inline-flex items-center justify-center gap-2 rounded-xl border border-subtle bg-surface px-4 py-2.5 font-inter text-sm font-bold text-heading outline-none transition-all hover:bg-surface-overlay hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-subtle bg-surface-elevated p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <span className="font-inter text-sm font-bold text-heading">{label}</span>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={copyLink} className={buttonBase} aria-label="Copy link to this page">
          {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
          {copied ? 'Link copied' : 'Copy link'}
        </button>

        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonBase}
          aria-label="Share this page on LinkedIn"
        >
          <Linkedin size={15} />
          LinkedIn
        </a>

        {canNativeShare && (
          <button type="button" onClick={nativeShare} className={buttonBase} aria-label="Open the share menu">
            <Share2 size={15} />
            More
          </button>
        )}
      </div>

      {/* Announced to screen readers, which otherwise get no signal that the
          button did anything: the label change alone is a visual cue. */}
      <span aria-live="polite" role="status" className="sr-only">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  );
};

export default ShareLinks;
