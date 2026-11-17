import { supabase, IMAGE_BUCKET, FILE_BUCKET } from '@/lib/supabase';
import { resetContent, type ContentTable } from '@/hooks/useContent';
import { resetCv } from '@/hooks/useCv';
import { projects as builtInProjects } from '@/data/projects';
import { roles as builtInRoles } from '@/data/experience';
import { testimonials as builtInRecommendations } from '@/data/recommendations';

/** One stored item. `data` holds the fields the public site reads. */
export type AdminRow = {
  id: string;
  slug?: string;
  position: number;
  published: boolean;
  // The shape depends on the table, and the forms validate what they write.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
};

const client = () => {
  if (!supabase) throw new Error('The content store is not connected yet.');
  return supabase;
};

const explain = (error: { message: string }) => new Error(error.message);

export async function listRows(table: ContentTable): Promise<AdminRow[]> {
  const { data, error } = await client().from(table).select('*').order('position', { ascending: true });
  if (error) throw explain(error);
  return (data ?? []) as AdminRow[];
}

export async function createRow(table: ContentTable, data: AdminRow['data'], slug?: string): Promise<void> {
  const existing = await listRows(table);
  const position = existing.length ? Math.max(...existing.map(r => r.position)) + 1 : 0;
  const row: Record<string, unknown> = { position, published: true, data };
  if (table === 'projects') row.slug = slug;
  const { error } = await client().from(table).insert(row);
  if (error) throw explain(error);
  resetContent(table);
}

export async function updateRow(
  table: ContentTable,
  id: string,
  patch: Partial<Pick<AdminRow, 'data' | 'published' | 'position'>>
): Promise<void> {
  const { error } = await client().from(table).update(patch).eq('id', id);
  if (error) throw explain(error);
  resetContent(table);
}

export async function deleteRow(table: ContentTable, id: string): Promise<void> {
  const { error } = await client().from(table).delete().eq('id', id);
  if (error) throw explain(error);
  resetContent(table);
}

/** Swap two items' places in the order. */
export async function swapRows(table: ContentTable, a: AdminRow, b: AdminRow): Promise<void> {
  // Positions can tie after an import; spread them out so a swap always changes order.
  const [first, second] = a.position === b.position ? [a.position, a.position + 1] : [a.position, b.position];
  const one = await client().from(table).update({ position: second }).eq('id', a.id);
  if (one.error) throw explain(one.error);
  const two = await client().from(table).update({ position: first }).eq('id', b.id);
  if (two.error) throw explain(two.error);
  resetContent(table);
}

/** Copy the content built into the site into the store, once, so it can be edited. */
export async function importBuiltIn(table: ContentTable): Promise<number> {
  const source =
    table === 'projects' ? builtInProjects : table === 'roles' ? builtInRoles : builtInRecommendations;
  const rows = source.map((item, index) => ({
    position: index,
    published: true,
    data: item,
    ...(table === 'projects' ? { slug: (item as { slug: string }).slug } : {}),
  }));
  const { error } = await client().from(table).insert(rows);
  if (error) throw explain(error);
  resetContent(table);
  return rows.length;
}

/** Shrink a photo in the browser before upload: WebP, at most 1600px wide. */
async function shrink(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / bitmap.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.85));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

/** Upload an image and return its public address. */
export async function uploadImage(file: File): Promise<string> {
  const body = await shrink(file);
  const ext = body.type === 'image/webp' ? 'webp' : (file.name.split('.').pop() || 'png').toLowerCase();
  const base = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'image';
  const path = `${Date.now()}-${base}.${ext}`;
  const { error } = await client().storage.from(IMAGE_BUCKET).upload(path, body, {
    contentType: body.type || file.type,
    cacheControl: '31536000',
  });
  if (error) throw explain(error);
  return client().storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** The CV the site currently links to, as recorded by the admin. */
export type CvRecord = { url: string; path: string; name: string; size: number; uploadedAt: string };

const CV_MAX_BYTES = 10 * 1024 * 1024;

export async function getCv(): Promise<CvRecord | null> {
  const { data, error } = await client().from('site_settings').select('value').eq('key', 'cv').maybeSingle();
  if (error) throw explain(error);
  return (data?.value as CvRecord | undefined) ?? null;
}

/** Upload a new CV (PDF), make the site link to it, and remove the previous upload. */
export async function uploadCv(file: File): Promise<CvRecord> {
  if (file.size > CV_MAX_BYTES) throw new Error('That file is over 10 MB. Export a smaller PDF and try again.');
  const header = new TextDecoder().decode(await file.slice(0, 5).arrayBuffer());
  if (!header.startsWith('%PDF')) throw new Error('That does not look like a PDF. Export your CV as a PDF and try again.');

  const previous = await getCv().catch(() => null);
  // A new folder per upload, so browsers and caches can never serve the old file.
  const path = `cv/${Date.now()}/Laila_Mohamed_CV.pdf`;
  const { error } = await client().storage.from(FILE_BUCKET).upload(path, file, {
    contentType: 'application/pdf',
    cacheControl: '3600',
  });
  if (error) throw explain(error);

  const record: CvRecord = {
    url: client().storage.from(FILE_BUCKET).getPublicUrl(path).data.publicUrl,
    path,
    name: file.name,
    size: file.size,
    uploadedAt: new Date().toISOString(),
  };
  const saved = await client()
    .from('site_settings')
    .upsert({ key: 'cv', value: record, updated_at: new Date().toISOString() });
  if (saved.error) {
    // Do not leave an orphan file behind if the link could not be recorded.
    await client().storage.from(FILE_BUCKET).remove([path]);
    throw explain(saved.error);
  }
  if (previous?.path) await client().storage.from(FILE_BUCKET).remove([previous.path]);
  resetCv();
  return record;
}

/** Go back to the CV built into the site. */
export async function removeCv(): Promise<void> {
  const previous = await getCv();
  const { error } = await client().from('site_settings').delete().eq('key', 'cv');
  if (error) throw explain(error);
  if (previous?.path) await client().storage.from(FILE_BUCKET).remove([previous.path]);
  resetCv();
}

/** Turn "https://youtu.be/ID" or "https://youtube.com/watch?v=ID" (or a bare ID) into the ID. */
export function youtubeId(input: string): string {
  const text = input.trim();
  const match = text.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  if (match) return match[1];
  return /^[A-Za-z0-9_-]{11}$/.test(text) ? text : '';
}

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
