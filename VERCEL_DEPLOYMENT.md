# Vercel Deployment Guide - Shri Hospital Management System

## Complete Step-by-Step Deployment Process

### STEP 1: Prepare Your Project for Vercel

#### What You Need:
1. GitHub account (to connect your repository)
2. Vercel account (free at https://vercel.com)
3. MongoDB Atlas account (free tier available)

---

### STEP 2: Set Up MongoDB Atlas (Cloud Database)

Since Vercel is a serverless platform, you **cannot use localhost MongoDB**. You must use MongoDB Atlas.

**Follow these steps:**

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new project
4. Create a Cluster (M0 Free tier)
5. Create a Database User:
   - Click "Database Access"
   - Add a user with a strong password
   - Note the username and password
6. Get Connection String:
   - Click "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It will look like: `mongodb+srv://username:password@cluster.mongodb.net/database-name`
7. Add your IP to Network Access:
   - Click "Network Access"
   - Add IP Address "0.0.0.0/0" (for development) or specific IPS
   - **Note:** For production, add Vercel's IP ranges

---

### STEP 3: Create Vercel Configuration Files

The following files should be created in your project root:

#### File 1: vercel.json
Located at: `/vercel.json`

This tells Vercel how to run your application.

#### File 2: api/index.js
Located at: `/api/index.js`

This is the serverless function entry point.

---

### STEP 4: Prepare Your Repository

1. **Create a .gitignore file** (if not exists):
   ```
   node_modules
   .env
   .env.local
   .DS_Store
   dist/
   build/
   ```

2. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   git remote add origin https://github.com/YOUR_USERNAME/shri-hospital.git
   git branch -M main
   git push -u origin main
   ```

---

### STEP 5: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended for Testing)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables** when prompted:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shri-hospital
   JWT_SECRET=your_strong_random_jwt_secret
   SESSION_SECRET=your_strong_random_session_secret
   NODE_ENV=production
   ```

#### Option B: Using Vercel Web Dashboard (Easiest)

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose your GitHub repository
5. Select the project settings:
   - Framework: "Other" or "Node.js"
   - Root Directory: ./
6. Add Environment Variables:
   - Go to "Settings" → "Environment Variables"
   - Add these variables:
     ```
     MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/shri-hospital
     JWT_SECRET = your_strong_random_jwt_secret
     SESSION_SECRET = your_strong_random_session_secret
     NODE_ENV = production
     ```
7. Click "Deploy"

---

### STEP 6: Verify Deployment

1. **Check deployment status**: Watch for "Ready" status in Vercel dashboard
2. **Test the application**: Click the provided URL
3. **Check logs**: In Vercel dashboard → "Logs" tab to see any errors

---

### STEP 7: Configure Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 48 hours)

---

### IMPORTANT: MongoDB Atlas Configuration

**Update MongoDB Atlas for Production:**

1. Go to MongoDB Atlas → Network Access
2. Add Vercel's IP ranges or "0.0.0.0/0" (less secure but easier)
3. Create production database user with different password
4. Enable IP Whitelist for specific IPs if possible

---

### TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| 504 Gateway Timeout | Reduce database query time, optimize MongoDB indexes |
| "Cannot find module" | Run `npm install` locally, ensure all dependencies in package.json |
| Database connection error | Verify MongoDB URI, check IP whitelist in Atlas |
| Environment variables not working | Redeploy after adding env vars: `vercel --prod` |
| Static files not loading | Check paths in routes, ensure `public/` folder exists |

---

### PERFORMANCE NOTES

Vercel has some limitations for this type of application:

1. **Function Timeout**: 10 seconds for hobby plan, 60 seconds for pro
   - Keep database queries optimized
   - Consider caching strategies

2. **Database Connections**: Create connection pooling
   - Use MongoDB connection pool settings
   - Consider Serverless MongoDB drivers

3. **File Uploads**: Use temporary storage
   - Files upload to `/tmp` only
   - Use cloud storage (AWS S3, Cloudinary) for permanent storage

---

### NEXT STEPS AFTER DEPLOYMENT

1. **Monitor Logs**: Check Vercel logs regularly for errors
2. **Set Up CI/CD**: Vercel auto-deploys on git push to main branch
3. **Add Custom Domain**: Point your domain to Vercel
4. **Set Up Analytics**: Enable in Vercel settings
5. **Backup Database**: Set up MongoDB Atlas backup

---

## Summary of Files Created

- ✅ vercel.json - Configuration file
- ✅ api/index.js - Serverless function entry point

Both files are provided in this project. Run update scripts below to implement them.

