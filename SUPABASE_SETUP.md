# Supabase Setup for eMuse

Follow these steps to enable user profiles and cloud-synced favorites.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in (or create a free account).
2. Click **New project**.
3. Choose an organization (or create one).
4. Enter a project name (e.g. `emuse`), set a database password, and pick a region.
5. Click **Create new project** and wait for it to finish provisioning.

## 2. Get your credentials

1. In the Supabase dashboard, open your project.
2. Click the **Settings** (gear) icon in the left sidebar.
3. Go to **API** (under Project Settings).
4. Copy:
   - **Project URL** (e.g. `https://xxxxxxxx.supabase.co`)
   - **Publishable** key (`sb_publishable_...`) — or the **anon** key under Legacy API Keys

**Important:** Do NOT use the **Secret** key (`sb_secret_...`) in the frontend. It bypasses security and will return 401 in the browser. Use only the Publishable or anon key.

**If you get "failed to fetch":** The app uses a Vite dev proxy so requests go through `localhost` (same-origin) instead of directly to Supabase. This avoids CORS and network issues. Ensure you:
- Use the **anon** key (JWT starting with `eyJ`) from Settings → API → **Legacy API Keys**
- Restart the dev server after changing `.env`
- Check that your Supabase project is not paused (free tier projects pause after inactivity — unpause in the dashboard)

## 3. Add credentials to .env

Create or edit `.env` in the project root:

```
OPENAI_API_KEY=sk-your-key-here

VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace with your actual Project URL and anon key.

## 4. Run the schema

If the full `schema.sql` fails, run the step files in order:

1. **Step 1** – Copy `supabase/schema-step1-tables.sql` → SQL Editor → Run
2. **Step 2** – Copy `supabase/schema-step2-policies.sql` → SQL Editor → Run
3. **Step 3** – Copy `supabase/schema-step3-trigger.sql` → SQL Editor → Run

Or run the full `supabase/schema.sql` in one go. You should see "Success. No rows returned".

## 5. (Optional) Disable email confirmation for testing

By default, new users must confirm their email before signing in. For local testing:

1. Go to **Authentication** → **Providers** → **Email**.
2. Turn off **Confirm email**.

## 7. Restart the dev server

```bash
npm run dev
```

The profile button (top-right) will now work. Click it to sign up or sign in.
