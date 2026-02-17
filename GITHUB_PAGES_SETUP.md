# Deploy to GitHub Pages + Supabase

This guide shows you how to deploy your HerbInventory app to GitHub Pages (free hosting) while using Supabase for your database.

## Why GitHub Pages + Supabase?

- ✅ **GitHub Pages**: Free static hosting, works great with React apps
- ✅ **Supabase**: Your database (stores inventory, pricing, ordering - all in one place)
- ✅ **Voice features work**: DuckDuckGo browser supports Web Speech API (just enable microphone permissions)
- ✅ **HTTPS included**: GitHub Pages provides HTTPS automatically (required for microphone access)

## Setup Steps

### 1. Push Your Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - HerbInventory app"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/herb-inventory.git
git branch -M main
git push -u origin main
```

**Important**: Replace `YOUR_USERNAME` with your actual GitHub username, and `herb-inventory` with your repository name.

### 2. Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select **GitHub Actions**
4. Save

### 3. Add Supabase Secrets

1. In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these two secrets:

   **Secret 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: Your Supabase project URL (get it from Supabase dashboard → Project Settings → API)

   **Secret 2:**
   - Name: `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Value: Your Supabase anon/public key (get it from Supabase dashboard → Project Settings → API)

### 4. Trigger Deployment

1. Go to **Actions** tab in your repository
2. The workflow should run automatically after you push
3. Or manually trigger it: **Actions** → **Deploy to GitHub Pages** → **Run workflow**

### 5. Get Your Live URL

After deployment completes:
1. Go to **Settings** → **Pages**
2. Your site will be at: `https://YOUR_USERNAME.github.io/herb-inventory/`

**Note**: The URL uses your repository name. If your repo is named `HerbInventory`, the URL will be `https://YOUR_USERNAME.github.io/HerbInventory/`

## Using Voice Features on DuckDuckGo Browser

1. **Open your app** on your phone using DuckDuckGo browser
2. **Grant microphone permission** when prompted (or go to DuckDuckGo settings → Site Settings → Microphone)
3. **Tap the microphone button** in the app
4. **Speak your command** (e.g., "Add to backstock low Yarrow, Nettle")

The app uses the Web Speech API which DuckDuckGo supports. If it doesn't work:
- Make sure you granted microphone permissions
- Try refreshing the page
- Make sure you're using HTTPS (GitHub Pages provides this automatically)

## Updating Your App

Every time you make changes:

```bash
git add .
git commit -m "Your update message"
git push
```

GitHub Actions will automatically rebuild and redeploy your app. It usually takes 1-2 minutes.

## Local Development

To test locally before pushing:

```bash
npm run dev
```

The app will run at `http://localhost:8080`

## Troubleshooting

**Voice recognition not working?**
- Make sure microphone permissions are enabled in DuckDuckGo
- Try refreshing the page
- Check that you're on HTTPS (GitHub Pages provides this)

**Build failing?**
- Check the **Actions** tab for error messages
- Make sure your Supabase secrets are set correctly
- Verify your `package.json` has all dependencies

**Can't access the site?**
- Wait a few minutes after deployment (GitHub Pages can take 1-2 minutes to update)
- Check the **Pages** settings to make sure it's enabled
- Verify the repository name matches the URL path

## Next Steps

Once deployed, you can:
- Access your app from anywhere (phone, computer, tablet)
- Use voice commands on your phone with DuckDuckGo
- Add pricing and ordering features (we'll store those in Supabase too)

