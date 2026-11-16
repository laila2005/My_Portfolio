# Turning on the admin page

The admin page lives at **/admin** on your site. It is not linked anywhere and
search engines are told to ignore it. It edits three things: **Projects**,
**Experience** and **Recommendations**. Until you finish these steps, the site
keeps showing the content built into the code, so nothing breaks.

You do this once. It takes about ten minutes.

## 1. A Supabase project

1. Sign in at https://supabase.com. Use a project you own. The code folder still
   mentions an old project (`wimivndjvzonierytgsw`); if it is yours you can reuse
   it, otherwise click **New project** (the free plan is enough).
2. Open **Project Settings > API**. Copy two values:
   - **Project URL**
   - **anon public** key (not the `service_role` key, which must stay secret)

## 2. Create the tables

1. Open **SQL Editor > New query**.
2. Paste the whole of `supabase/schema.sql` and click **Run**.

This creates the tables, the rule that visitors can only read published items,
and a public picture bucket that only you can upload to. Running it twice is safe.

## 3. Create your login

1. Open **Authentication > Users > Add user > Create new user**.
2. Enter your email and a strong password. Tick **Auto Confirm User**.
3. Open **Authentication > Sign In / Providers** and switch **off** "Allow new
   users to sign up", so nobody else can create an account.
4. Back in **SQL Editor**, run this with your own email, to make that account the admin:

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'YOUR-EMAIL-HERE';
```

## 4. Give the site the two values

In **Vercel > my-portfolio-mm2c > Settings > Environment Variables**, add (for
Production and Preview):

| Name | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | the Project URL |
| `VITE_SUPABASE_ANON_KEY` | the anon public key |

Then open **Deployments** and **Redeploy** the latest one, because these values are
baked in when the site builds.

To use the admin while running the site on your own computer, put the same two
lines in a file called `.env.local` in the project folder (see `.env.example`).

## 5. First use

1. Go to `https://my-portfolio-mm2c.vercel.app/admin` and sign in.
2. In each tab (Projects, Experience, Recommendations) click **Import what's on my
   site now**. This copies what the site shows today into the store, so you can edit,
   reorder and hide it.
3. From then on: **Add**, **Edit**, **Hide / Show**, **Delete**, and the arrows to
   change the order. Saved changes appear on the site straight away, with no redeploy.

## Good to know

- **Hide** keeps an item but removes it from the site. Prefer it to Delete.
- If you delete every item in a tab, the site falls back to its built-in content.
- **Images** you upload are shrunk to at most 1600 px wide and stored in Supabase.
- **Link previews:** a project you add in the admin works on the site, but the
  LinkedIn/WhatsApp preview card for its link is the general site card. Cards for
  the projects built into the code are made by `npm run social-cards`.
- **Backups:** Supabase keeps the data. For an extra copy, use **Table Editor >
  Export** on each table now and then.
