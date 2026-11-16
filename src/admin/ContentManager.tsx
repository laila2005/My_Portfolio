import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Download, Eye, EyeOff, ExternalLink, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { ContentTable } from '@/hooks/useContent';
import { createRow, deleteRow, importBuiltIn, listRows, slugify, swapRows, updateRow, type AdminRow } from './api';
import { TABLES, tidy, type Data } from './forms';

type Editing = { row: AdminRow | null; data: Data };

const ContentManager = ({ table, onNotice }: { table: ContentTable; onNotice: (message: string) => void }) => {
  const config = TABLES[table];
  const [rows, setRows] = useState<AdminRow[] | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [formError, setFormError] = useState('');
  const [toDelete, setToDelete] = useState<AdminRow | null>(null);

  const refresh = useCallback(async () => {
    try {
      setRows(await listRows(table));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load.');
    }
  }, [table]);

  useEffect(() => {
    setRows(null);
    void refresh();
  }, [refresh]);

  const run = async (job: () => Promise<void>, success?: string) => {
    setBusy(true);
    setError('');
    try {
      await job();
      await refresh();
      if (success) onNotice(success);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!editing) return;
    const problem = config.check(editing.data);
    if (problem) {
      setFormError(problem);
      return;
    }
    setFormError('');
    const data = tidy(editing.data);
    setBusy(true);
    try {
      if (editing.row) {
        await updateRow(table, editing.row.id, { data });
      } else {
        let slug: string | undefined;
        if (table === 'projects') {
          const taken = new Set((rows ?? []).map(r => r.slug));
          const base = slugify(String(data.title)) || 'project';
          slug = base;
          for (let n = 2; taken.has(slug); n += 1) slug = `${base}-${n}`;
          data.slug = slug;
        }
        await createRow(table, data, slug);
      }
      await refresh();
      setEditing(null);
      onNotice(`Saved. Your ${config.singular} is live on the site.`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  };

  const list = rows ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-poppins text-xl font-bold text-heading">{config.title}</h2>
        <Button onClick={() => { setFormError(''); setEditing({ row: null, data: config.blank() }); }}>
          <Plus size={16} className="mr-2" /> Add {config.singular}
        </Button>
      </div>

      {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 font-inter text-sm text-red-500">{error}</p>}

      {rows === null && !error && (
        <p className="flex items-center gap-2 font-inter text-sm text-body"><Loader2 size={16} className="animate-spin" /> Loading…</p>
      )}

      {rows !== null && list.length === 0 && (
        <div className="rounded-2xl border border-dashed border-subtle bg-surface-elevated p-6 text-center">
          <p className="font-inter text-sm text-body">
            Nothing here yet. Your site is showing its built-in {config.title.toLowerCase()}. Import them to edit, reorder and hide them from here.
          </p>
          <Button className="mt-4" variant="outline" disabled={busy} onClick={() => run(async () => { await importBuiltIn(table); }, `Imported the built-in ${config.title.toLowerCase()}.`)}>
            <Download size={16} className="mr-2" /> Import what's on my site now
          </Button>
        </div>
      )}

      <ul className="space-y-3">
        {list.map((row, index) => {
          const { title, subtitle } = config.describe(row.data);
          return (
            <li key={row.id} className={`rounded-2xl border border-subtle bg-surface-elevated p-4 ${row.published ? '' : 'opacity-60'}`}>
              <div className="flex items-start gap-3">
                <div className="flex flex-col">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" aria-label="Move up" disabled={busy || index === 0} onClick={() => run(() => swapRows(table, row, list[index - 1]))}>
                    <ArrowUp size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" aria-label="Move down" disabled={busy || index === list.length - 1} onClick={() => run(() => swapRows(table, row, list[index + 1]))}>
                    <ArrowDown size={14} />
                  </Button>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-poppins font-bold text-heading">
                    {title}
                    {!row.published && <span className="ml-2 rounded-full bg-gray-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-subtle">Hidden</span>}
                  </p>
                  {subtitle && <p className="line-clamp-2 font-inter text-sm text-body">{subtitle}</p>}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => { setFormError(''); setEditing({ row, data: row.data }); }}>
                  <Pencil size={14} className="mr-1.5" /> Edit
                </Button>
                <Button size="sm" variant="outline" disabled={busy} onClick={() => run(() => updateRow(table, row.id, { published: !row.published }), row.published ? 'Hidden from the site.' : 'Visible on the site again.')}>
                  {row.published ? <EyeOff size={14} className="mr-1.5" /> : <Eye size={14} className="mr-1.5" />}
                  {row.published ? 'Hide' : 'Show'}
                </Button>
                {table === 'projects' && row.slug && (
                  <Button size="sm" variant="ghost" asChild>
                    <a href={`/projects/${row.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} className="mr-1.5" /> View</a>
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="ml-auto text-red-500 hover:text-red-500" onClick={() => setToDelete(row)}>
                  <Trash2 size={14} className="mr-1.5" /> Delete
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <Sheet open={!!editing} onOpenChange={open => !open && !busy && setEditing(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          {editing && (
            <>
              <SheetHeader>
                <SheetTitle className="font-poppins">{editing.row ? `Edit ${config.singular}` : `Add a ${config.singular}`}</SheetTitle>
                <SheetDescription>Changes go live on your site as soon as you save.</SheetDescription>
              </SheetHeader>
              <div className="my-5">
                <config.Form value={editing.data} onChange={data => setEditing({ ...editing, data })} isNew={!editing.row} />
              </div>
              {formError && <p role="alert" className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 font-inter text-sm text-red-500">{formError}</p>}
              <SheetFooter className="sticky bottom-0 -mx-6 gap-2 border-t border-subtle bg-background px-6 py-4">
                <Button variant="outline" disabled={busy} onClick={() => setEditing(null)}>Cancel</Button>
                <Button disabled={busy} onClick={save}>
                  {busy && <Loader2 size={16} className="mr-2 animate-spin" />}
                  Save
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!toDelete} onOpenChange={open => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {config.singular}?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete ? `"${config.describe(toDelete.data).title}" will be removed from your site. This cannot be undone. Use Hide if you might want it back.` : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const target = toDelete;
                setToDelete(null);
                if (target) void run(() => deleteRow(table, target.id), 'Deleted.');
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContentManager;
