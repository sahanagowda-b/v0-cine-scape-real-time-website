# Deployment Guide for CineScape

## Prerequisites

Before deploying, ensure you have:
- A GitHub repository with your CineScape code
- A Vercel account (free tier works)
- A Supabase account with your database configured
- A TMDB API key
- (Optional) A Socket.io server deployment platform

## Step 1: Prepare Your Repository

1. Ensure your `.env.local` is in `.gitignore`:
   \`\`\`bash
   echo ".env.local" >> .gitignore
   \`\`\`

2. Commit and push to GitHub:
   \`\`\`bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   \`\`\`

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Configure project settings:
   - **Framework**: Next.js
   - **Build command**: `npm run build`
   - **Output directory**: `.next`

5. Add environment variables:
   - `TMDB_ACCESS_TOKEN`: Your TMDB API access token (Bearer token)
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`: `https://your-vercel-url.vercel.app`

6. Click "Deploy"

## Step 3: Configure Supabase

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Paste and run the content from `scripts/01-setup-schema.sql`
4. Verify all tables are created with RLS policies

## Step 4: Update Callback URLs (Important)

1. Go to Supabase > Authentication > URL Configuration
2. Add your Vercel URL to "Redirect URLs":
   - `https://your-vercel-url.vercel.app`
   - `https://your-vercel-url.vercel.app/auth/callback`

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Test the following:
   - Browse trending movies
   - Search for movies
   - Sign up and login
   - Add movies to watchlist
   - View profile and recommendations

## Step 6: Deploy Socket.io Server (Optional but Recommended)

### Option A: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" > "Deploy from GitHub"
3. Select your repository
4. Configure environment variables:
   - `TMDB_ACCESS_TOKEN`: Your TMDB key
   - `SOCKET_PORT`: `3001`

5. Add to your Vercel environment variables:
   - `NEXT_PUBLIC_SOCKET_URL`: `https://your-railway-url.railway.app`

### Option B: Deploy to Heroku

1. Install Heroku CLI
2. Run:
   \`\`\`bash
   heroku create cinescape-socket
   heroku config:set TMDB_ACCESS_TOKEN=your_token
   git push heroku main
   \`\`\`

3. Update Vercel environment variable:
   - `NEXT_PUBLIC_SOCKET_URL`: Your Heroku URL

## Monitoring & Maintenance

### Check Deployment Status
- Vercel Dashboard: Monitor build logs and deployments
- Supabase Dashboard: Monitor database usage and connections
- Socket.io Server: Check server logs for errors

### Common Issues

**Movies not loading:**
- Verify TMDB API key is correct
- Check TMDB account hasn't hit rate limits
- Verify network requests in browser DevTools

**Authentication failing:**
- Verify Supabase URL and anon key are correct
- Check callback URLs are configured in Supabase
- Clear browser cookies and try again

**Real-time updates not working:**
- Verify Socket.io server is running
- Check browser console for connection errors
- Verify CORS is properly configured

### Performance Tips

1. Monitor database queries in Supabase
2. Enable Vercel Analytics
3. Use Vercel's Edge Caching for TMDB API responses
4. Consider upgrading Supabase plan if hitting row limits

## Rollback

If something goes wrong:

1. **Vercel**: Go to Deployments tab and promote a previous deployment
2. **Database**: Supabase has automatic backups - contact support
3. **Socket.io**: Redeploy from GitHub or previous build

## Security Checklist

- [ ] Environment variables never committed to git
- [ ] CORS properly configured for Socket.io
- [ ] RLS policies enabled on all Supabase tables
- [ ] API rate limits configured if necessary
- [ ] TMDB API key has appropriate permissions

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- TMDB API: https://developers.themoviedb.org/3
