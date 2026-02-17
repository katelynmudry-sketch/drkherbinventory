# Deploy Your HerbInventory App

This guide shows you how to deploy your app. You can use **GitHub + Vercel** (recommended) or deploy directly to **Netlify** without GitHub.

## Option 1: GitHub + Vercel (Recommended - Best for Scaling)

**Why this combo?**
- ✅ **GitHub**: Free code hosting, version control, easy collaboration
- ✅ **Vercel**: Free hosting, auto-deploys from GitHub, better performance than GitHub Pages
- ✅ **Supabase**: Your database (stores inventory, pricing, ordering data - all in one place)
- ✅ **Scalable**: Can handle growth, easy to update, professional setup

### Setup Steps:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/herb-inventory.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com and sign up/login
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings

3. **Add Environment Variables:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase project URL
     - `VITE_SUPABASE_PUBLISHABLE_KEY` = your Supabase anon key
   - Redeploy

4. **Done!** Every time you push to GitHub, Vercel auto-deploys.

### About Pricing & Ordering Data:

**Yes, you can store ALL your data in Supabase:**
- Inventory (already set up)
- Pricing lists (we'll add tables for this)
- Ordering forms (we'll add tables for this)
- Suppliers, products, etc.

Everything lives in the same Supabase database - your phone and computer both access it through the Vercel-hosted app. No need for separate storage!

---

## Option 2: Direct to Netlify (No GitHub)

## Quick Deploy Steps

### Option 1: Drag & Drop (Easiest)

1. **Build your app:**
   ```bash
   npm run build
   ```
   This creates a `dist` folder with your compiled app.

2. **Go to Netlify:**
   - Visit https://app.netlify.com/drop
   - Drag the entire `dist` folder onto the page
   - Your app will be live in seconds!

3. **Add Environment Variables:**
   - In Netlify dashboard, go to Site settings → Environment variables
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase project URL
     - `VITE_SUPABASE_PUBLISHABLE_KEY` = your Supabase anon key
   - Redeploy (or it will auto-redeploy)

### Option 2: Netlify CLI (For Updates)

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

4. **Set Environment Variables:**
   ```bash
   netlify env:set VITE_SUPABASE_URL "your-url-here"
   netlify env:set VITE_SUPABASE_PUBLISHABLE_KEY "your-key-here"
   ```

## Getting Your Supabase Credentials

1. Go to https://supabase.com and log in
2. Open your project (ID: `axpiusakndqdkmnzatig`)
3. Go to **Project Settings** → **API**
4. Copy:
   - **Project URL** → use for `VITE_SUPABASE_URL`
   - **anon public** key → use for `VITE_SUPABASE_PUBLISHABLE_KEY`

## Updating Your App

Every time you make changes:

1. Make your code changes
2. Run `npm run build`
3. Drag the `dist` folder to Netlify again (or use `netlify deploy --prod --dir=dist`)

That's it! Your phone and computer can now access the app from anywhere via the Netlify URL.


