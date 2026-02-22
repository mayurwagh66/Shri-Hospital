# Deploy to Vercel: Visual Step-by-Step Guide

## Prerequisites ✓
- [ ] GitHub account with your code pushed
- [ ] Vercel account (free at vercel.com)
- [ ] MongoDB Atlas connection string ready
- [ ] Generated JWT_SECRET and SESSION_SECRET

---

## STEP 1: Push Code to GitHub

### Command Line:
```bash
cd "d:\projects\Shri Hospital"
git init
git add .
git commit -m "Ready for Vercel deployment"
git remote add origin https://github.com/YOUR_USERNAME/shri-hospital.git
git branch -M main
git push -u origin main
```

### Verify on GitHub:
- Open https://github.com/YOUR_USERNAME/shri-hospital
- You should see all your project files
- Important files visible:
  - ✓ package.json
  - ✓ server.js
  - ✓ api/index.js
  - ✓ vercel.json
  - ✓ views/ folder
  - ✓ routes/ folder
  - ✓ config/ folder

---

## STEP 2: Get MongoDB Atlas Connection String

### Navigate to Atlas:
```
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign in with your credentials
3. Click on your cluster
4. Click "CONNECT" button
```

### Get Connection String:
```
1. Select "Connect your application"
2. Choose "Node.js" as driver
3. Copy the connection string
4. Should look like:
   mongodb+srv://hospital_admin:PASSWORD@cluster0.mongodb.net/shri-hospital?retryWrites=true&w=majority
5. Replace PASSWORD with your actual password
6. SAVE THIS STRING!
```

---

## STEP 3: Generate Secrets

### Open Terminal/PowerShell:

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Output example: `5f9a3e1c2b7d4a8c6f3e9b1d7c2a5f8e4b6d9c1a3e5f7b8d0c2e4a6f8b1d3c`

**Generate SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Output example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f`

**Save both secrets somewhere safe!**

---

## STEP 4: Open Vercel Dashboard

### Go to Vercel:
```
1. Open: https://vercel.com
2. Click "Log In"
3. Sign in with GitHub (recommended)
4. Authorize Vercel to access GitHub
```

---

## STEP 5: Create New Project

### From Dashboard:
```
1. Click "Add New" button (top right)
   OR "New Project" button
2. Select "Project" from dropdown
3. See "Import Git Repository"
```

### Import Repository:
```
You'll see a search box with your repositories
1. Search for "shri-hospital"
2. Click on the one you just pushed
3. Click "Import" button
```

---

## STEP 6: Configure Project Settings

### Basic Configuration:
```
You'll see import dialog:

Framework Preset:
  - Click dropdown
  - Select "Other" (since it's Express)
  
Root Directory:
  - Leave as . (current directory)
  
Build Command:
  - Should be empty (we don't need custom build)
  
Output Directory:
  - Leave empty

Install Command:
  - Default fine
```

Click "Deploy" button
*This will deploy with default settings first*

---

## STEP 7: Add Environment Variables

### During/After Deployment:
```
1. Look for "Environment Variables" section
2. If not visible during import, go to:
   - Dashboard → Select your project
   - Settings → Environment Variables
```

### Add Variables:

**Variable 1: MONGODB_URI**
```
Name: MONGODB_URI
Value: mongodb+srv://hospital_admin:PASSWORD@cluster0.mongodb.net/shri-hospital?retryWrites=true&w=majority
Environment: 
  ☑ Production
  ☑ Preview
  ☑ Development
Click "Add"
```

**Variable 2: JWT_SECRET**
```
Name: JWT_SECRET
Value: [paste your 32-char secret from Step 3]
Environment:
  ☑ Production
  ☑ Preview
  ☑ Development
Click "Add"
```

**Variable 3: SESSION_SECRET**
```
Name: SESSION_SECRET
Value: [paste your 32-char secret from Step 3]
Environment:
  ☑ Production
  ☑ Preview
  ☑ Development
Click "Add"
```

**Variable 4: NODE_ENV**
```
Name: NODE_ENV
Value: production
Environment:
  ☑ Production
  ☑ Preview
  ☑ Development
Click "Add"
```

### All Variables Added?
- ✓ MONGODB_URI
- ✓ JWT_SECRET
- ✓ SESSION_SECRET
- ✓ NODE_ENV

---

## STEP 8: Redeploy with Variables

### Force Redeployment:
```
1. Go to: Deployments tab
2. Find your latest deployment
3. Click three dots menu (...)
4. Click "Redeploy"
5. Click "Redeploy" in popup
```

### Watch Deployment:
```
You'll see in dashboard:
- "Building..." (2-3 min) - Installing dependencies
- "Analyzing..." - Checking for errors
- "Ready" ✓ - Deployment complete!

Success = Green checkmark "Ready"
```

---

## STEP 9: Test Your Deployment

### Get Your Deployment URL:
```
Vercel Dashboard → Your Project
You'll see:
"Visit: https://shri-hospital-SOMETHING.vercel.app"
This is your app URL!
```

### Test Health Endpoint:
```
Open in browser:
https://shri-hospital-SOMETHING.vercel.app/api/health

Expected response:
{
  "status": "ok",
  "timestamp": "2024-..."
}

If you see this: ✓ DEPLOYMENT SUCCESSFUL!
```

### Test Other Endpoints:
```
1. Home page:
   https://shri-hospital-SOMETHING.vercel.app/

2. Login page:
   https://shri-hospital-SOMETHING.vercel.app/login

3. Dashboard:
   https://shri-hospital-SOMETHING.vercel.app/dashboard
```

---

## STEP 10: Monitor Logs

### View Logs:
```
Vercel Dashboard
    ↓
Select your project
    ↓
Click "Deployments" tab
    ↓
Click on latest deployment
    ↓
Click "Logs" section
```

### What to Look For:

✅ **Good Signs:**
```
"MongoDB Connected"
"Build succeeded"
"Deployment ready"
GET /api/health 200
```

❌ **Error Signs:**
```
"Cannot find module"
"MongoDB connection refused"
"404 not found"
"504 timeout"
```

---

## Troubleshooting

### If Status Shows "Error":

**Issue: MongoDB Connection Failed**
```
In Logs you see: "MongoDB connection refused"

Fix:
1. Check MONGODB_URI value in Vercel
2. Verify all characters copied correctly
3. Check MongoDB Atlas:
   - Network Access → whitelist IPs
   - Database Access → User exists
4. Redeploy: Deployments → Redeploy
```

**Issue: Module Not Found**
```
In Logs you see: "Cannot find module X"

Fix:
1. Make sure dependency in package.json:
   npm install missing-package
2. Push to GitHub: git push
3. Verify Vercel redeploys automatically
```

**Issue: Static Files 404**
```
In Logs you see: "Cannot find index.html"

Fix:
1. Check views/ folder exists
2. Check public/ folder exists
3. Run locally: npm run dev
4. Verify files load locally first
```

### If Status Shows "Ready" but API Returns Errors:

**Check API health first:**
```
https://your-app.vercel.app/api/health
Should return: {"status":"ok",...}
```

**If health endpoint fails:**
1. Database not connecting
2. Env variables not set
3. Routes not configured

**Fix:**
1. Go to Logs tab
2. Look for error messages
3. Fix issue locally
4. Push to GitHub
5. Wait for auto-redeploy

---

## Success Checklist

- [ ] Code pushed to GitHub
- [ ] Project imported in Vercel
- [ ] 4 environment variables added
- [ ] Deployment shows "Ready" ✓
- [ ] /api/health returns success
- [ ] Home page loads
- [ ] Login page loads
- [ ] Dashboard loads

---

## After Deployment

### Access Your App:
```
Bookmark this URL:
https://shri-hospital-YOURNAME.vercel.app
```

### Keep Deploying:
```
Future updates:
1. Make code changes locally
2. Test with: npm run dev
3. Commit: git add . && git commit -m "Update"
4. Push: git push origin main
5. Vercel auto-redeploys!
```

### View Logs Anytime:
```
Vercel Dashboard → Deployments → Logs
Look for errors and debug
```

---

## Useful Links

- **Your Vercel Dashboard:** https://vercel.com/dashboard
- **Your App URL:** https://shri-hospital-YOURNAME.vercel.app
- **Vercel Docs:** https://vercel.com/docs
- **Git Push Help:** https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository

---

## Problem? Check These Documents:

1. **Quick problems:**
   - VERCEL_QUICK_DEPLOY.md

2. **Detailed troubleshooting:**
   - VERCEL_DEPLOYMENT.md

3. **Technical details:**
   - VERCEL_TECHNICAL_REFERENCE.md

4. **Step-by-step checklist:**
   - DEPLOYMENT_CHECKLIST.md

---

**🎉 Congratulations! Your app is live on Vercel!**

Your Shri Hospital Management System is now accessible worldwide at:
```
https://shri-hospital-YOURNAME.vercel.app
```

Share this URL with team members and users! ✓
