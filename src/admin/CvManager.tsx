import { useCallback, useEffect, useRef, useState } from 'react';
import { ExternalLink, FileText, Loader2, RotateCcw, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BUILT_IN_CV } from '@/hooks/useCv';
import { getCv, removeCv, uploadCv, type CvRecord } from './api';

const size = (bytes: number) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

/**
 * Replace the CV the Resume button opens, without redeploying. The previous
 * upload is deleted when a new one is saved, and "Use the built-in CV" returns
 * to the PDF shipped with the site.
 */
const CvManager = ({ onNotice }: { onNotice: (message: string) => void }) => {
  const [current, setCurrent] = useState<CvRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const input = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    try {
      setCurrent(await getCv());
      setError('');
    } catch (failure) {
      const message = failure instanceof Error ? failure.message : 'Could not load the CV.';
      setError(
        /site_settings|relation|schema cache/i.test(message)
          ? 'The CV storage is not set up yet. In Supabase, open SQL Editor, paste the whole of supabase/schema.sql and click Run (it is safe to run again), then reload this page.'
          : message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const choose = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      setCurrent(await uploadCv(file));
      onNotice('CV updated. The Resume button now opens it.');
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'The upload failed. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const revert = async () => {
    if (!window.confirm('Go back to the CV built into the site? Your uploaded CV will be deleted.')) return;
    setBusy(true);
    setError('');
    try {
      await removeCv();
      setCurrent(null);
      onNotice('Back to the built-in CV.');
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not remove the uploaded CV.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-5 rounded-2xl border border-subtle bg-surface-elevated p-6">
      <div>
        <h2 className="font-poppins text-lg font-bold text-heading">Your CV</h2>
        <p className="mt-1 font-inter text-sm leading-relaxed text-body">
          Upload a PDF and the <strong>Resume</strong> button on your site opens it straight away, with no redeploy.
          Uploading again replaces the previous file.
        </p>
      </div>

      {loading ? (
        <p className="flex items-center gap-2 font-inter text-sm text-body"><Loader2 size={16} className="animate-spin" /> Loading…</p>
      ) : (
        <div className="flex items-start gap-3 rounded-xl border border-subtle bg-surface p-4">
          <FileText size={22} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            {current ? (
              <>
                <p className="truncate font-inter text-sm font-bold text-heading">{current.name}</p>
                <p className="font-inter text-xs text-body">
                  {size(current.size)} · uploaded {new Date(current.uploadedAt).toLocaleString()}
                </p>
              </>
            ) : (
              <>
                <p className="font-inter text-sm font-bold text-heading">Using the CV built into the site</p>
                <p className="font-inter text-xs text-body">Upload a PDF to replace it.</p>
              </>
            )}
          </div>
          <Button variant="ghost" size="sm" asChild>
            <a href={current?.url ?? BUILT_IN_CV} target="_blank" rel="noopener noreferrer">
              Open <ExternalLink size={13} className="ml-1.5" />
            </a>
          </Button>
        </div>
      )}

      {error && <p role="alert" className="font-inter text-sm text-red-500">{error}</p>}

      <input ref={input} type="file" accept="application/pdf,.pdf" className="sr-only" onChange={choose} aria-label="Choose a CV PDF" />
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => input.current?.click()} disabled={busy || loading}>
          {busy ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Upload size={16} className="mr-2" />}
          {current ? 'Upload a new CV' : 'Upload a CV'}
        </Button>
        {current && (
          <Button variant="outline" onClick={revert} disabled={busy}>
            <RotateCcw size={15} className="mr-2" /> Use the built-in CV
          </Button>
        )}
      </div>
      <p className="font-inter text-xs text-body">PDF only, up to 10 MB.</p>
    </section>
  );
};

export default CvManager;
