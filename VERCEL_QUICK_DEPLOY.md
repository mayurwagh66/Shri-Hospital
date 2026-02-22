# QUICK START: Deploy to Vercel in 5 Minutes

## Prerequisites Checklist
- ☐ Node.js installed on your machine
- ☐ Git installed
- ☐ GitHub account (free at github.com)
- ☐ Vercel account (free at vercel.com)
- ☐ MongoDB Atlas account (free tier at mongodb.com)

---

## Step 1: Setup MongoDB Atlas (5 minutes)

### Create MongoDB Cloud Database:
```bash
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account / Login
3. Create Project → Create Cluster (M0 Free)
4. Database Access: Create a user with strong password
   Username: hospital_admin
   Password: StrongPassword123!
5. Network Access: Add IP "0.0.0.0/0"
6. Clusters → Connect → "Connect your application"
7. Copy connection string that looks like:
   mongodb+srv://hospital_admin:StrongPassword123!@cluster0.mongodb.net/shri-hospital?retryWrites=true&w=majority
```

**Save this connection string - you'll need it soon!**

---

## Step 2: Push Code to GitHub (2 minutes)

```bash
# In your project directory
git init
git add .
git commit -m "Prepare for Vercel deployment"
git remote add origin https://github.com/YOUR_USERNAME/shri-hospital.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel (2 minutes)

### Option A: Using Vercel Web Interface (Easiest)

1. Go to: https://vercel.com/dashboard
2. Click: **"Add New..." → "Project"**
3. Click: **"Import Git Repository"**
4. Select your GitHub repo "shri-hospital"
5. Click: **"Import"**
6. **Configure Environment Variables:**
   - Click: **"Environment Variables"**
   - Add these variables (copy exact names):
   
   | Key | Value |
   |-----|-------|
   | MONGODB_URI | `mongodb+srv://hospital_admin:StrongPassword123!@cluster0.mongodb.net/shri-hospital?retryWrites=true&w=majority` |
   | JWT_SECRET | `your_super_secret_random_key_min_32_chars_789abc_xyz` |
   | SESSION_SECRET | `another_super_secret_session_key_min_32_chars_def` |
   | NODE_ENV | `production` |

7. Click: **"Deploy"**
8. Wait for deployment completion (2-3 minutes)

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# When prompted, enter environment variables:
# MONGODB_URI=mongodb+srv://...
# JWT_SECRET=your_secret_key
# SESSION_SECRET=your_session_secret
```

---

## Step 4: Verify Deployment

1. Wait for "Ready" status in Vercel dashboard
2. Click the deployment URL
3. Test the following endpoints:
   ```
   https://your-vercel-app.vercel.app/
   https://your-vercel-app.vercel.app/api/health
   https://your-vercel-app.vercel.app/login
   https://your-vercel-app.vercel.app/dashboard
   ```

---

## Step 5: Add Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Enter your domain name
3. Follow DNS configuration instructions
4. Wait for DNS to propagate (up to 48 hours)

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| **MongoDB Connection Failed** | Check connection string in env vars, ensure IP whitelist includes your IP |
| **Cannot find module** | Run `npm install` locally first |
| **404 on static pages** | Check that views/ folder exists with .html files |
| **Timeout errors** | Optimize database queries, reduce query complexity |
| **Variables not working** | Add env variables in Vercel Settings, not in .env file |

---

## Environment Variables Reference

Create strong secrets for JWT_SECRET and SESSION_SECRET. Examples:

**JWT_SECRET (minimum 32 characters):**
```
hF9$mK2&pL@wX5*qR#vY8$nB4&jD6%sT
```

**SESSION_SECRET (minimum 32 characters):**
```
aB3$cD5&eF7*gH9@jK2$mN4&pQ6%rS8*
```

Or generate using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Redeploy After Changes

Every time you push to GitHub:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

**Vercel automatically redeploys!** ✅

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
- **Troubleshooting Guide:** See VERCEL_DEPLOYMENT.md in this project

---

## What's Different from Local Development?

| Feature | Local | Vercel |
|---------|-------|--------|
| Database | Localhost | MongoDB Atlas Cloud |
| Function Timeout | None | 10-60 seconds |
| File Storage | Persistent | Temporary (/tmp only) |
| Start Command | `npm run dev` | Automatic |

---

**🎉 That's it! Your app is now live on Vercel!**
