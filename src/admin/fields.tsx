import { useId, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { uploadImage } from './api';

/**
 * A labelled control. Pass `htmlFor` when the child is a single input so the
 * label is tied to it (click-to-focus, screen readers); otherwise the label
 * names the whole group of controls instead.
 */
export const Field = ({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}) => {
  const labelId = useId();
  return (
    <div className="space-y-1.5" role={htmlFor ? undefined : 'group'} aria-labelledby={htmlFor ? undefined : labelId}>
      {htmlFor ? (
        <Label htmlFor={htmlFor} className="font-inter text-sm font-bold text-heading">{label}</Label>
      ) : (
        <span id={labelId} className="block font-inter text-sm font-bold leading-none text-heading">{label}</span>
      )}
      {children}
      {hint && <p className="font-inter text-xs leading-snug text-subtle">{hint}</p>}
    </div>
  );
};

export const TextField = ({
  label,
  value,
  onChange,
  hint,
  placeholder,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
}) => {
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <Input id={id} value={value ?? ''} placeholder={placeholder} onChange={event => onChange(event.target.value)} />
    </Field>
  );
};

export const AreaField = ({
  label,
  value,
  onChange,
  hint,
  rows = 4,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  hint?: string;
  rows?: number;
}) => {
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <Textarea id={id} rows={rows} value={value ?? ''} onChange={event => onChange(event.target.value)} />
    </Field>
  );
};

export const SwitchRow = ({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) => (
  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-subtle bg-surface p-3">
    <input
      type="checkbox"
      checked={checked}
      onChange={event => onChange(event.target.checked)}
      className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
    />
    <span>
      <span className="block font-inter text-sm font-bold text-heading">{label}</span>
      {hint && <span className="block font-inter text-xs text-subtle">{hint}</span>}
    </span>
  </label>
);

/** Chips for short labels, such as technology names. Enter or comma adds one. */
export const TagsField = ({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  hint?: string;
}) => {
  const [draft, setDraft] = useState('');
  const tags = value ?? [];
  const add = () => {
    const next = draft.split(',').map(part => part.trim()).filter(Boolean);
    if (next.length) onChange([...tags, ...next.filter(tag => !tags.includes(tag))]);
    setDraft('');
  };
  return (
    <Field label={label} hint={hint ?? 'Type a name and press Enter.'}>
      <div className="flex flex-wrap gap-2 rounded-xl border border-subtle bg-surface p-2">
        {tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
            {tag}
            <button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(tags.filter(t => t !== tag))}>
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={event => setDraft(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault();
              add();
            }
          }}
          onBlur={add}
          placeholder="Add…"
          className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 font-inter text-sm text-heading outline-none placeholder:text-subtle"
        />
      </div>
    </Field>
  );
};

/** One item per line, for bullet lists. */
export const LinesField = ({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  hint?: string;
}) => (
  <Field label={label} hint={hint ?? 'One bullet per line.'}>
    <Textarea
      rows={5}
      value={(value ?? []).join('\n')}
      onChange={event => onChange(event.target.value.split('\n'))}
      onBlur={event => onChange(event.target.value.split('\n').map(line => line.trim()).filter(Boolean))}
    />
  </Field>
);

/** An image address with an upload button. */
export const ImageField = ({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  hint?: string;
}) => {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };

  return (
    <Field label={label} hint={hint}>
      <div className="flex gap-3">
        {value ? (
          <img src={value} alt="" className="h-16 w-24 flex-shrink-0 rounded-lg border border-subtle object-cover" />
        ) : (
          <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-lg border border-dashed border-subtle text-subtle">
            <ImagePlus size={20} />
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <Input value={value ?? ''} placeholder="https://… or upload" onChange={event => onChange(event.target.value)} />
          <input ref={input} type="file" accept="image/*" hidden onChange={event => pick(event.target.files?.[0])} />
          <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => input.current?.click()}>
            {busy ? <Loader2 size={14} className="mr-2 animate-spin" /> : <ImagePlus size={14} className="mr-2" />}
            {busy ? 'Uploading…' : 'Upload image'}
          </Button>
          {error && <p className="font-inter text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </Field>
  );
};

const move = <T,>(list: T[], from: number, to: number) => {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

/** A reorderable list of small sub-forms. */
export function ListField<T>({
  label,
  hint,
  items,
  onChange,
  blank,
  addLabel,
  render,
}: {
  label: string;
  hint?: string;
  items: T[] | undefined;
  onChange: (items: T[]) => void;
  blank: () => T;
  addLabel: string;
  render: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
}) {
  const list = items ?? [];
  return (
    <Field label={label} hint={hint}>
      <div className="space-y-3">
        {list.map((item, index) => (
          <div key={index} className="space-y-3 rounded-xl border border-subtle bg-surface p-3">
            {render(item, patch => onChange(list.map((it, i) => (i === index ? { ...it, ...patch } : it))), index)}
            <div className="flex gap-1">
              <Button type="button" variant="ghost" size="sm" aria-label="Move up" onClick={() => onChange(move(list, index, index - 1))}>
                <ArrowUp size={14} />
              </Button>
              <Button type="button" variant="ghost" size="sm" aria-label="Move down" onClick={() => onChange(move(list, index, index + 1))}>
                <ArrowDown size={14} />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="ml-auto text-red-500" onClick={() => onChange(list.filter((_, i) => i !== index))}>
                <X size={14} className="mr-1" /> Remove
              </Button>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...list, blank()])}>
          <Plus size={14} className="mr-1" /> {addLabel}
        </Button>
      </div>
    </Field>
  );
}
