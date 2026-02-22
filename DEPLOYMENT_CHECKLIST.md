# Complete Vercel Deployment Checklist

## Pre-Deployment Checklist

- [ ] Node.js installed (v14 or higher)
- [ ] Git installed and configured
- [ ] GitHub account created
- [ ] Vercel account created (free at vercel.com)
- [ ] MongoDB Atlas account created (free tier available)
- [ ] All code committed and pushed to GitHub

---

## 1. MongoDB Atlas Setup (Complete First!)

### Create Cloud Database
- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Sign up / Login
- [ ] Create a new project
- [ ] Create a cluster (M0 - Free tier)
- [ ] Wait for cluster to deploy (5-10 minutes)

### Create Database User
- [ ] Click "Database Access" in left menu
- [ ] Click "Add New Database User"
- [ ] Username: `hospital_admin`
- [ ] Password: Create a STRONG password (min 12 chars)
- [ ] Select "Password" as authentication method
- [ ] Click "Add User"

### Get Connection String
- [ ] Click "Clusters" in left menu
- [ ] Click "Connect" button on your cluster
- [ ] Click "Connect your application"
- [ ] Copy the connection string
- [ ] Replace `<password>` with your actual password
- [ ] Replace `<database>` with `shri-hospital`
- [ ] **Save this connection string - you'll need it!**

Example format:
```
mongodb+srv://hospital_admin:YOUR_PASSWORD@cluster0.mongodb.net/shri-hospital?retryWrites=true&w=majority
```

### Configure Network Access
- [ ] Click "Network Access" in left menu
- [ ] Click "Add IP Address"
- [ ] Select "Allow Access from Anywhere" (for development)
  - OR add specific IPs: Vercel's IP ranges (see Vercel docs)
- [ ] Click "Confirm"

---

## 2. GitHub Setup

### Create Repository
- [ ] Go to https://github.com/new
- [ ] Repository name: `shri-hospital`
- [ ] Make it Public or Private (your choice)
- [ ] Click "Create repository"

### Push Code
```bash
cd "d:\projects\Shri Hospital"
git init
git add .
git commit -m "Initial commit for Vercel deployment"
git remote add origin https://github.com/YOUR_USERNAME/shri-hospital.git
git branch -M main
git push -u origin main
```

- [ ] Confirm code is on GitHub
- [ ] Check that important files are there:
  - [ ] package.json
  - [ ] server.js
  - [ ] api/index.js
  - [ ] vercel.json
  - [ ] config/database.js
  - [ ] All routes/
  - [ ] All models/
  - [ ] views/ folder with HTML files

---

## 3. Vercel Deployment

### Method A: Using Vercel Dashboard (Recommended)

- [ ] Go to https://vercel.com/dashboard
- [ ] Click "Add New" → "Project"
- [ ] Click "Import Git Repository"
- [ ] Find and select "shri-hospital" repo
- [ ] Click "Import"

### Configure Project Settings
- [ ] Framework Preset: Select "Other"
- [ ] Root Directory: `.` (default)
- [ ] Don't need to change build settings

### Add Environment Variables
- [ ] Scroll to "Environment Variables" section
- [ ] Click to expand
- [ ] Add these 4 variables:

| Name | Value | Environment |
|------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://hospital_admin:YOUR_PASSWORD@cluster0.mongodb.net/shri-hospital?retryWrites=true&w=majority` | Production, Preview, Development |
| `JWT_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | Production, Preview, Development |
| `SESSION_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production, Preview, Development |

- [ ] For each variable, select all three environments (Production, Preview, Development)
- [ ] Click "Deploy"

---

## Testing Post-Deployment

### Initial Status Check
- [ ] Watch deployment progress in Vercel dashboard
- [ ] Wait for "Ready" status (green checkmark)
- [ ] Deployment typically takes 2-5 minutes

### Test Endpoints
Once deployed, test these URLs (replace `your-app` with your Vercel URL):

- [ ] Health Check: `https://your-app.vercel.app/api/health`
  - Expected: `{"status":"ok","timestamp":"..."}`

- [ ] Home Page: `https://your-app.vercel.app/`
  - Expected: HTML page loads

- [ ] Login Page: `https://your-app.vercel.app/login`
  - Expected: Login form appears

- [ ] Dashboard: `https://your-app.vercel.app/dashboard`
  - Expected: Dashboard loads

- [ ] API Test: `https://your-app.vercel.app/api/auth`
  - Expected: May return 404/error (that's ok, just testing routing)

### Check Logs
- [ ] In Vercel dashboard, click your deployment
- [ ] Go to "Logs" tab
- [ ] Check for any errors related to:
  - [ ] MongoDB connection
  - [ ] Environment variables
  - [ ] Module imports

---

## Troubleshooting

| Issue | Check | Fix |
|-------|-------|-----|
| **Database connection error** | MongoDB connection string | Verify `MONGODB_URI` in Vercel env vars |
| | IP whitelist | Check MongoDB Atlas Network Access settings |
| | Credentials | Verify username/password in connection string |
| **Cannot find module error** | package.json dependencies | Ensure `npm install` was run locally |
| | Relative paths in api/index.js | Check ../config, ../routes paths |
| **Static files not loading** | views/ folder | Confirm index.html, login.html, dashboard.html exist |
| | public/ folder | Confirm public/css/, public/js/ exist |
| **404 errors on API routes** | Routes setup | Check if routes are properly imported in api/index.js |
| **Variables not being read** | Variable names | Ensure names match exactly: MONGODB_URI, JWT_SECRET, etc. |
| | Environment scope | Ensure variables set for Production env |
| **Timeout errors (504)** | Database queries | Optimize MongoDB queries |
| | Function duration | Keep requests under 10-60 seconds |

---

## After Successful Deployment

### Daily Operations
- [ ] Monitor Vercel logs for errors
- [ ] Test application regularly via URL
- [ ] Watch database usage in MongoDB Atlas

### Optional Enhancements
- [ ] Add custom domain to Vercel project
- [ ] Set up automatic backups for MongoDB
- [ ] Enable analytics in Vercel settings
- [ ] Set up email notifications for deployments

### Continuous Updates
- [ ] Make code changes locally
- [ ] Test with `npm run dev`
- [ ] Push to GitHub: `git push origin main`
- [ ] Vercel automatically redeploys!

---

## Files Created/Modified for Vercel

### New Files Created:
- ✅ `vercel.json` - Vercel configuration
- ✅ `api/index.js` - Serverless function entry point
- ✅ `.env.example` - Environment template (updated)
- ✅ `VERCEL_DEPLOYMENT.md` - Full deployment guide
- ✅ `VERCEL_QUICK_DEPLOY.md` - Quick start guide
- ✅ `DEPLOYMENT_CHECKLIST.md` - This file

### Files Modified:
- ✅ `config/database.js` - Added connection pooling for serverless
- ✅ `server.js` - Made compatible with both local & serverless

---

## Support Resources

- **Vercel Documentation:** https://vercel.com/docs
- **MongoDB Atlas Help:** https://docs.atlas.mongodb.com
- **Express.js Guide:** https://expressjs.com/
- **Mongoose Docs:** https://mongoosejs.com/
- **Node.js Docs:** https://nodejs.org/

---

## Quick Command Reference

```bash
# Local development
npm install
npm run dev

# Push to GitHub
git add .
git commit -m "message"
git push origin main

# Generate random secrets (run in terminal)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Check Node version
node --version

# Check npm version
npm --version
```

---

## Deployment Complete! ✅

Once you see "Ready" status in Vercel and tests pass, your app is live!

Your app URL will be: `https://shri-hospital-YOUR_USERNAME.vercel.app`

(Note: The actual URL depends on your project name and Vercel's domain settings)

---

**Log this information for future reference:**

```
Project Name: shri-hospital
GitHub Repo: https://github.com/YOUR_USERNAME/shri-hospital
Vercel URL: https://shri-hospital-YOUR_USERNAME.vercel.app
MongoDB Database: shri-hospital
Database User: hospital_admin
```

---

**Questions?** See VERCEL_DEPLOYMENT.md for detailed explanations.
