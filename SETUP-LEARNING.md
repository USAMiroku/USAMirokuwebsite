# Learning App Setup Guide (No Code Experience Needed)

Follow these steps in order. You can copy and paste where indicated.

---

## Migration: Add center_id (if you already ran the main schema)

If you ran the main `learning_schema.sql` before, run this in Supabase SQL Editor to link activities to centers:

```sql
alter table public.learning_activities add column if not exists center_id text;
create index if not exists learning_activities_center_id_idx on public.learning_activities(center_id);
```

---

## Step 1: Get Your Supabase Values

### 1a. Open Supabase
1. Go to: **https://supabase.com/dashboard**
2. Sign in if needed
3. Click your project (the one where you ran the SQL)

### 1b. Get the Project URL
1. Click the **Settings** icon (gear) in the left sidebar
2. Click **API**
3. Find **Project URL** — it looks like: `https://abcdefghijk.supabase.co`
4. **Copy it** (click the copy icon or select all and copy)

### 1c. Get the Anon Key
1. On the same **API** page, scroll to **Project API keys**
2. Find **anon** and **public** — that is the key you need
3. Click the copy icon next to it
4. It is a long string starting with `eyJ...`

---

## Step 2: Put the Values Into Your Project

### 2a. Open the File
1. Open your project folder in Cursor (or your editor)
2. In the file list on the left, find the file: **`.env.local`**
3. Click it to open it

**If you don't see `.env.local`:**
- It might be hidden. Look for a file that starts with a dot.
- Or: Right-click in the file list → **New File** → type: `.env.local`

### 2b. Paste Your Values
The file should look like this. **Replace the empty parts** with what you copied:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-long-key-here
```

**Example** (yours will be different):
```
VITE_SUPABASE_URL=https://xyzabc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiYzEyMyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNj...
```

**Rules:**
- No spaces before or after the `=`
- No quotes around the values
- Paste the full URL and full key (don't cut them short)

### 2c. Save the File
- Press **Ctrl+S** (Windows) or **Cmd+S** (Mac)
- Or: **File** → **Save**

---

## Step 3: Run the Website Locally

### 3a. Open the Terminal
- In Cursor: **Terminal** → **New Terminal**
- Or press **Ctrl+`** (backtick) or **Cmd+`**

### 3b. Run the Command
Type this exactly and press **Enter**:

```
npm run dev
```

### 3c. Open the Learning Page
1. Wait until you see something like: `Local: http://localhost:5173/`
2. Click that link, or type in your browser: **http://localhost:5173/learn**
3. You should see the Learning page. If you see "Learning app is not configured", double-check Step 2.

---

## Step 4: Create Your First Activity (in Supabase)

### 4a. Open Supabase Table Editor
1. Go to **https://supabase.com/dashboard**
2. Open your project
3. Click **Table Editor** in the left sidebar

### 4b. Add an Activity
1. Click the table: **learning_activities**
2. Click **Insert row** (or the + button)
3. Fill in:
   - **type**: Select `class` from the dropdown
   - **title**: Type something like `Introduction to Johrei`
   - **description**: (optional) Type a short description
4. Click **Save**
5. **Copy the `id`** of the new row (it's a long UUID like `a1b2c3d4-e5f6-...`) — you'll need it for the next step

### 4c. Add a Session
1. Click the table: **learning_sessions**
2. Click **Insert row**
3. Fill in:
   - **activity_id**: Paste the `id` you copied from the activity
   - **start_time**: Pick a date/time (e.g. `2025-04-15 19:00:00`)
   - **meeting_url**: (optional) A Zoom or Google Meet link
   - **location**: (optional) e.g. `Online` or `Boston Center`
4. Click **Save**

---

## Step 5: Make Yourself an Admin

### 5a. Sign Up on Your Site
1. Go to: **http://localhost:5173/learn/sign-up**
2. Enter your email and password
3. Click **Create Account**
4. If it says to check your email, do that and confirm (or sign in at `/learn/sign-in` if it lets you)

### 5b. Set Your Role in Supabase
1. Go to **Supabase** → **Table Editor**
2. Click the table: **learning_profiles**
3. Find your row (your email might be in auth.users; the row has `user_id`)
4. Click the **role** cell
5. Change it from `student` to `admin`
6. Click **Save**

---

## Step 6: Test the Flow

1. **Browse activities**: Go to http://localhost:5173/learn/activities — you should see your activity
2. **Register**: Click the activity → View Sessions → Register (sign in if asked)
3. **Approve**: Go to http://localhost:5173/learn/admin/registrations → click **Approve**
4. **Your account**: Go to http://localhost:5173/learn/account — you should see your approved registration
5. **Upload material**: Go to http://localhost:5173/learn/admin/materials → upload a file
6. **Download**: Go back to http://localhost:5173/learn/account — you should see and download the material

---

## Troubleshooting

| Problem | What to try |
|--------|-------------|
| "Learning app is not configured" | Check `.env.local` has both variables, no typos, and you restarted `npm run dev` |
| Can't find `.env.local` | Create it: New File → name it `.env.local` |
| "relation does not exist" | Run the SQL schema again in Supabase SQL Editor |
| Can't sign up | Check Supabase Auth is enabled; in Authentication → Providers, Email should be on |
| Admin page says "Not authorized" | Make sure you set `role` to `admin` in `learning_profiles` |

---

## Need Help?

If you get stuck, note:
- Which step number you're on
- The exact error message (copy it)
- What you see on the screen

Then share that and we can fix it.
