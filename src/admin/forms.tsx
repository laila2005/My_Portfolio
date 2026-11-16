import { AreaField, Field, ImageField, LinesField, ListField, SwitchRow, TagsField, TextField } from './fields';
import { youtubeId } from './api';
import type { ContentTable } from '@/hooks/useContent';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Data = Record<string, any>;

type FormProps = { value: Data; onChange: (next: Data) => void; isNew: boolean };

const useSetter = (value: Data, onChange: (next: Data) => void) => (key: string, next: unknown) =>
  onChange({ ...value, [key]: next });

const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <fieldset className="space-y-4 rounded-2xl border border-subtle bg-surface-elevated p-4 sm:p-5">
    <legend className="px-2 font-poppins text-sm font-bold text-primary">{title}</legend>
    {children}
  </fieldset>
);

const select = 'h-10 w-full rounded-md border border-input bg-background px-3 font-inter text-sm text-heading';

export const ProjectForm = ({ value, onChange }: FormProps) => {
  const set = useSetter(value, onChange);
  return (
    <div className="space-y-5">
      <Group title="The basics">
        <TextField label="Title" value={value.title} onChange={v => set('title', v)} hint="Shown as the card and page heading, e.g. 'FlameLens – NASA Fire-Evidence Dashboard'." />
        <TextField label="One-line summary" value={value.tagline} onChange={v => set('tagline', v)} hint="The line under the title on the project page and in link previews." />
        <AreaField label="Description" value={value.description} onChange={v => set('description', v)} hint="Shown on the project card and the Overview section." />
        <TextField label="Badge (optional)" value={value.status} onChange={v => set('status', v)} hint="A small label on the card, such as '3rd Place' or 'In development'." />
        <SwitchRow label="Show first (featured)" hint="Featured projects appear before the 'See More Projects' button." checked={!!value.featured} onChange={v => set('featured', v)} />
      </Group>

      <Group title="Pictures and video">
        <ImageField label="Cover image" value={value.image} onChange={v => set('image', v)} hint="The picture on the project card." />
        <SwitchRow label="Show the whole cover (don't crop)" hint="Use for wide banners that would otherwise be cut off." checked={value.imageFit === 'contain'} onChange={v => set('imageFit', v ? 'contain' : undefined)} />
        <TextField label="YouTube video (optional)" value={value.video ? `https://youtu.be/${value.video}` : ''} onChange={v => set('video', youtubeId(v) || undefined)} hint="Paste the YouTube link; it plays on the project page." />
        <ListField
          label="Gallery"
          items={value.gallery as { src: string; alt: string; caption?: string }[] | undefined}
          onChange={items => set('gallery', items)}
          blank={() => ({ src: '', alt: '', caption: '' })}
          addLabel="Add a picture"
          hint="Extra pictures shown as a slideshow on the project page."
          render={(item, update) => (
            <>
              <ImageField label="Picture" value={item.src} onChange={v => update({ src: v })} />
              <TextField label="Describe it (for screen readers)" value={item.alt} onChange={v => update({ alt: v })} />
              <TextField label="Caption (optional)" value={item.caption} onChange={v => update({ caption: v })} />
            </>
          )}
        />
      </Group>

      <Group title="Links">
        <TextField label="Live site" value={value.live} onChange={v => set('live', v)} />
        <TextField label="Live site button text" value={value.liveLabel} onChange={v => set('liveLabel', v)} placeholder="Live Demo" />
        <TextField label="Source code (GitHub)" value={value.github} onChange={v => set('github', v)} hint="Leave empty if the code is private." />
        <Field label="Source code visibility">
          <select className={select} value={value.sourceStatus ?? ''} onChange={e => set('sourceStatus', e.target.value || undefined)}>
            <option value="">Not stated</option>
            <option value="public">Public</option>
            <option value="private">Private (shows a "Request a walkthrough" button)</option>
          </select>
        </Field>
        <TextField label="Private-source note" value={value.privateNote} onChange={v => set('privateNote', v)} />
        <ListField
          label="Extra buttons"
          items={value.links as { label: string; url: string }[] | undefined}
          onChange={items => set('links', items)}
          blank={() => ({ label: '', url: '' })}
          addLabel="Add a button"
          hint="For example a demo video or a hackathon page."
          render={(item, update) => (
            <>
              <TextField label="Button text" value={item.label} onChange={v => update({ label: v })} />
              <TextField label="Address" value={item.url} onChange={v => update({ url: v })} />
            </>
          )}
        />
      </Group>

      <Group title="Details">
        <TagsField label="Technologies" value={value.tech} onChange={v => set('tech', v)} hint="Shown as chips. They also decide which filter the project appears under." />
        <TagsField label="Languages" value={value.languages} onChange={v => set('languages', v)} />
        <TextField label="Your role" value={value.role} onChange={v => set('role', v)} />
        <LinesField label="Highlights" value={value.highlights} onChange={v => set('highlights', v)} />
        <ListField
          label="Sections"
          items={value.sections as { heading: string; body: string }[] | undefined}
          onChange={items => set('sections', items)}
          blank={() => ({ heading: '', body: '' })}
          addLabel="Add a section"
          hint="Headed paragraphs on the project page."
          render={(item, update) => (
            <>
              <TextField label="Heading" value={item.heading} onChange={v => update({ heading: v })} />
              <AreaField label="Text" value={item.body} onChange={v => update({ body: v })} rows={4} />
            </>
          )}
        />
      </Group>
    </div>
  );
};

export const RoleForm = ({ value, onChange }: FormProps) => {
  const set = useSetter(value, onChange);
  return (
    <div className="space-y-5">
      <Group title="The role">
        <TextField label="Job title" value={value.title} onChange={v => set('title', v)} placeholder="Co-Founder & Full-Stack Engineer" />
        <TextField label="Company" value={value.company} onChange={v => set('company', v)} />
        <TextField label="Product or project (optional)" value={value.project} onChange={v => set('project', v)} />
        <TextField label="Dates" value={value.duration} onChange={v => set('duration', v)} placeholder="Nov 2025 – Present" hint="Always include a start date." />
        <TextField label="Badge (optional)" value={value.badge} onChange={v => set('badge', v)} placeholder="Internship" />
        <AreaField label="What you did" value={value.summary} onChange={v => set('summary', v)} rows={6} />
        <TagsField label="Skills used" value={value.tech} onChange={v => set('tech', v)} />
      </Group>
      <Group title="Links">
        <TextField label="Company website (optional)" value={value.link} onChange={v => set('link', v)} />
        <TextField
          label="Demo video (optional)"
          value={value.demoVideo}
          onChange={v => set('demoVideo', v)}
          hint="Adds 'Watch the demo video' and 'Request details' buttons to this role."
        />
      </Group>
    </div>
  );
};

export const RecommendationForm = ({ value, onChange }: FormProps) => {
  const set = useSetter(value, onChange);
  return (
    <div className="space-y-5">
      <Group title="The recommendation">
        <AreaField label="Their words" value={value.quote} onChange={v => set('quote', v)} rows={8} hint="Paste exactly what they wrote. Leave a blank line between paragraphs." />
        <Field label="Language of the quote">
          <select className={select} value={value.quoteLang ?? ''} onChange={e => set('quoteLang', e.target.value || undefined)}>
            <option value="">English</option>
            <option value="ar">Arabic</option>
          </select>
        </Field>
        <AreaField label="English translation (only if the quote isn't English)" value={value.translation} onChange={v => set('translation', v)} rows={5} />
      </Group>
      <Group title="Who said it">
        <TextField label="Name" value={value.name} onChange={v => set('name', v)} />
        <TextField label="Role and company" value={value.role} onChange={v => set('role', v)} placeholder="Assistant Manager at Banque Misr. Laila's mentor" />
        <TextField label="Label (optional)" value={value.note} onChange={v => set('note', v)} placeholder="LinkedIn recommendation, September 2026" hint="Shown as a small tag on the card." />
        <TextField label="Link to the original (optional)" value={value.link} onChange={v => set('link', v)} />
        <TextField label="Where it lives (optional)" value={value.source} onChange={v => set('source', v)} placeholder="Mostaql" hint="Used with the link, as the badge text." />
      </Group>
    </div>
  );
};

/** What each content type is called and how its rows are described in the list. */
export const TABLES: Record<
  ContentTable,
  {
    title: string;
    singular: string;
    blank: () => Data;
    describe: (data: Data) => { title: string; subtitle: string };
    Form: (props: FormProps) => JSX.Element;
    check: (data: Data) => string | null;
  }
> = {
  projects: {
    title: 'Projects',
    singular: 'project',
    blank: () => ({ title: '', description: '', image: '', tech: [], featured: false }),
    describe: d => ({ title: d.title || 'Untitled project', subtitle: d.tagline || d.description || '' }),
    Form: ProjectForm,
    check: d => (!d.title?.trim() ? 'Give the project a title.' : !d.description?.trim() ? 'Add a description.' : !d.image?.trim() ? 'Add a cover image.' : null),
  },
  roles: {
    title: 'Experience',
    singular: 'role',
    blank: () => ({ title: '', company: '', duration: '', summary: '', tech: [] }),
    describe: d => ({ title: `${d.title || 'Untitled role'}${d.company ? ` · ${d.company}` : ''}`, subtitle: d.duration || '' }),
    Form: RoleForm,
    check: d => (!d.title?.trim() ? 'Add a job title.' : !d.company?.trim() ? 'Add a company.' : !d.duration?.trim() ? 'Add the dates.' : !d.summary?.trim() ? 'Describe what you did.' : null),
  },
  recommendations: {
    title: 'Recommendations',
    singular: 'recommendation',
    blank: () => ({ quote: '', name: '', role: '' }),
    describe: d => ({ title: d.name || 'Unnamed', subtitle: (d.quote || '').slice(0, 90) }),
    Form: RecommendationForm,
    check: d => (!d.quote?.trim() ? "Paste the person's words." : !d.name?.trim() ? 'Add their name.' : !d.role?.trim() ? 'Add their role.' : null),
  },
};

/** Drop empty fields and half-filled list entries so stored items stay tidy. */
export const tidy = (data: Data): Data => {
  const out: Data = {};
  for (const [key, raw] of Object.entries(data)) {
    let value = raw;
    if (typeof value === 'string') value = value.trim();
    if (Array.isArray(value)) {
      value = value
        .map(item => (typeof item === 'string' ? item.trim() : item))
        .filter(item => {
          if (typeof item === 'string') return item.length > 0;
          if (item && typeof item === 'object') return Object.values(item).some(v => typeof v === 'string' && v.trim());
          return true;
        });
      if (key === 'gallery') value = value.filter((item: { src?: string }) => item.src);
      if (key === 'links') value = value.filter((item: { url?: string; label?: string }) => item.url && item.label);
    }
    if (value === '' || value === undefined || (Array.isArray(value) && value.length === 0)) continue;
    out[key] = value;
  }
  return out;
};

