import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { ArrowLeft, Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Butterfly } from '@/components/ButterflyField';
import { supabase, supabaseConfigured } from '@/lib/supabase';
import ContentManager from '@/admin/ContentManager';
import CvManager from '@/admin/CvManager';

/**
 * The private control panel. Not linked anywhere on the site, kept out of search
 * engines, and useless without a login: every change is checked against the
 * `admins` list by the database itself (see supabase/schema.sql), not by this page.
 */
const Shell = ({ children, onSignOut }: { children: React.ReactNode; onSignOut?: () => void }) => (
  <div className="min-h-screen bg-surface">
    <header className="border-b border-subtle bg-surface-elevated">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-3">
          <Butterfly className="h-7 w-8 text-primary" still />
          <span className="font-poppins text-lg font-bold text-heading">Portfolio admin</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/"><ArrowLeft size={14} className="mr-1.5" /> View site</Link>
          </Button>
          {onSignOut && (
            <Button variant="outline" size="sm" onClick={onSignOut}>
              <LogOut size={14} className="mr-1.5" /> Sign out
            </Button>
          )}
        </div>
      </div>
    </header>
    <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
  </div>
);

const Notice = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mx-auto max-w-xl rounded-2xl border border-subtle bg-surface-elevated p-6">
    <h1 className="mb-3 font-poppins text-xl font-bold text-heading">{title}</h1>
    <div className="space-y-3 font-inter text-sm leading-relaxed text-body">{children}</div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError('');
    const { error: failure } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (failure) setError('That email and password did not match.');
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-4 rounded-2xl border border-subtle bg-surface-elevated p-6">
      <h1 className="font-poppins text-xl font-bold text-heading">Sign in</h1>
      <div className="space-y-1.5">
        <Label htmlFor="admin-email">Email</Label>
        <Input id="admin-email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="admin-password">Password</Label>
        <Input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      {error && <p role="alert" className="font-inter text-sm text-red-500">{error}</p>}
      <Button type="submit" className="w-full" disabled={busy}>
        {busy && <Loader2 size={16} className="mr-2 animate-spin" />}
        Sign in
      </Button>
    </form>
  );
};

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    document.title = 'Admin | Laila Mohamed Fikry';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !session) {
      setIsAdmin(null);
      return;
    }
    let cancelled = false;
    supabase
      .from('admins')
      .select('user_id')
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setIsAdmin(Boolean(data));
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  if (!supabaseConfigured) {
    return (
      <Shell>
        <Notice title="The content store isn't connected yet">
          <p>This page needs two settings, <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>, before it can load or save anything.</p>
          <p>The steps are in <code>supabase/SETUP.md</code> in your project. Your site keeps showing its built-in content in the meantime.</p>
        </Notice>
      </Shell>
    );
  }

  if (checking) {
    return (
      <Shell>
        <p className="flex items-center justify-center gap-2 font-inter text-body"><Loader2 size={18} className="animate-spin" /> Loading…</p>
      </Shell>
    );
  }

  if (!session) {
    return (
      <Shell>
        <Login />
      </Shell>
    );
  }

  const signOut = () => {
    void supabase?.auth.signOut();
  };

  if (isAdmin === null) {
    return (
      <Shell onSignOut={signOut}>
        <p className="flex items-center justify-center gap-2 font-inter text-body"><Loader2 size={18} className="animate-spin" /> Checking access…</p>
      </Shell>
    );
  }

  if (!isAdmin) {
    return (
      <Shell onSignOut={signOut}>
        <Notice title="This account can't edit the portfolio">
          <p>You're signed in, but this account isn't on the admin list. Add it once from the Supabase SQL editor; the exact line is in <code>supabase/SETUP.md</code>.</p>
        </Notice>
      </Shell>
    );
  }

  return (
    <Shell onSignOut={signOut}>
      {notice && (
        <p role="status" className="sticky top-3 z-50 mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 font-inter text-sm font-bold text-emerald-600 shadow-lg dark:text-emerald-400">
          {notice}
        </p>
      )}
      <Tabs defaultValue="projects">
        <TabsList className="mb-6 grid h-auto w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="roles">Experience</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="cv">CV</TabsTrigger>
        </TabsList>
        <TabsContent value="projects"><ContentManager table="projects" onNotice={setNotice} /></TabsContent>
        <TabsContent value="roles"><ContentManager table="roles" onNotice={setNotice} /></TabsContent>
        <TabsContent value="recommendations"><ContentManager table="recommendations" onNotice={setNotice} /></TabsContent>
        <TabsContent value="cv"><CvManager onNotice={setNotice} /></TabsContent>
      </Tabs>
    </Shell>
  );
};

export default Admin;
