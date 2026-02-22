# Commands & Configuration Reference

## Git Commands (Copy & Paste)

### Initialize Git Repository (First Time Only)
```bash
cd "d:\projects\Shri Hospital"
git init
git add .
git commit -m "Initial commit for Vercel deployment"
git remote add origin https://github.com/YOUR_USERNAME/shri-hospital.git
git branch -M main
git push -u origin main
```

### Update & Deploy (After Changes)
```bash
git add .
git commit -m "Your update message"
git push origin main
```

### Check Status
```bash
git status
git log --oneline
git remote -v
```

---

## Generate Secrets

### Generate 32-Character Random Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**Paste output as:** JWT_SECRET

### Generate Another Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**Paste output as:** SESSION_SECRET

---

## Environment Variables (Exact Names)

### For Local Development (.env file)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shri-hospital
JWT_SECRET=your_local_jwt_secret_change_this
SESSION_SECRET=your_local_session_secret_change_this
NODE_ENV=development
```

### For Vercel Production
```
MONGODB_URI=mongodb+srv://hospital_admin:PASSWORD@cluster0.mongodb.net/shri-hospital?retryWrites=true&w=majority
JWT_SECRET=your_32_char_secret_from_step_above
SESSION_SECRET=your_32_char_secret_from_step_above
NODE_ENV=production
```

---

## npm Commands

### Install Dependencies (Local)
```bash
npm install
```

### Start Development Server (Local)
```bash
npm run dev
```
Runs on: http://localhost:5000

### Start Production Server (Local)
```bash
npm start
```

### Check Installed Packages
```bash
npm list
```

### Update Packages
```bash
npm update
```

---

## MongoDB Commands

### If Using Local MongoDB (for development only)

#### Start MongoDB
```bash
mongod
```

#### Connect to MongoDB Shell
```bash
mongosh
```

#### List Databases
```bash
show dbs
```

#### Select Database
```bash
use shri-hospital
```

#### View Collections
```bash
show collections
```

#### Query Example
```bash
db.patients.find()
db.patients.find({email: "test@example.com"})
```

---

## Vercel CLI Commands

### Install Vercel CLI
```bash
npm install -g vercel
```

### Login to Vercel
```bash
vercel login
```

### Deploy to Production
```bash
vercel --prod
```

### List Environments
```bash
vercel env list
```

### Pull Environment Variables
```bash
vercel env pull
```

---

## Testing URLs

### After Deployment (Replace with your actual URL)

**Health Check:**
```
https://your-app.vercel.app/api/health
```

**Home Page:**
```
https://your-app.vercel.app/
```

**Login Page:**
```
https://your-app.vercel.app/login
```

**Dashboard:**
```
https://your-app.vercel.app/dashboard
```

---

## File Verification Commands

### Check If Files Exist
```bash
# Verify Vercel files were created
ls vercel.json
ls api/index.js
ls config/database.js

# Verify project structure
ls routes/
ls models/
ls controllers/
ls views/
```

### List Project Contents
```bash
dir
```
Windows command to see all files.

---

## Debugging Commands

### Check Node Version
```bash
node --version
```
Should be v14 or higher.

### Check npm Version
```bash
npm --version
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Dependencies (If Issues)
```bash
rm -r node_modules
npm install
```

### Check Port Usage (if 5000 in use)
```bash
# Windows - find what's using port 5000
netstat -ano | find ":5000"

# Kill process (replace PID with actual number)
taskkill /PID 1234 /F
```

---

## GitHub URL Format

### Your Repository URL
```
https://github.com/YOUR_USERNAME/shri-hospital
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Example
```
https://github.com/john-doe/shri-hospital
```

---

## MongoDB Atlas Connection String Format

### Template
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

### Your String Example
```
mongodb+srv://hospital_admin:StrongPassword123@cluster0.mongodb.net/shri-hospital?retryWrites=true&w=majority
```

### Important Notes
- Replace `USERNAME` with: hospital_admin
- Replace `PASSWORD` with: your actual password
- Replace `CLUSTER` with: your cluster name (e.g., cluster0)
- Replace `DATABASE_NAME` with: shri-hospital
- Keep `?retryWrites=true&w=majority` at the end

---

## Environment Setup Checklist

### Before Deploying, You Need:

```
☐ Node.js installed (npm should work)
  Command: node --version

☐ Git installed
  Command: git --version

☐ GitHub account created
  URL: https://github.com

☐ Vercel account created
  URL: https://vercel.com

☐ MongoDB Atlas account created
  URL: https://www.mongodb.com/cloud/atlas

☐ Code pushed to GitHub
  Command: git push origin main

☐ MongoDB connection string
  Format: mongodb+srv://...

☐ JWT_SECRET generated
  Command: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

☐ SESSION_SECRET generated
  Command: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Common Issues & Fixes

### Command Not Found

**Issue:** `npm: command not found`
```
Fix: Install Node.js from https://nodejs.org
```

**Issue:** `git: command not found`
```
Fix: Install Git from https://git-scm.com
```

### Cannot Connect to Local MongoDB

```bash
# Check if MongoDB is running
mongosh

# Or start MongoDB
mongod
```

### Port 5000 Already in Use

```bash
# Windows: Find what's using port
netstat -ano | find ":5000"

# Kill it (replace PID with actual number)
taskkill /PID 1234 /F

# Or use different port
PORT=3000 npm run dev
```

---

## Quick Copy-Paste: Full Deployment Command Sequence

```bash
# 1. Initialize git (first time only)
cd "d:\projects\Shri Hospital"
git init
git add .
git commit -m "Ready for Vercel"
git remote add origin https://github.com/YOUR_USERNAME/shri-hospital.git
git branch -M main
git push -u origin main

# 2. After setting up MongoDB Atlas and Vercel:
# Go to https://vercel.com/dashboard
# Import repo and add these env vars manually:

# MONGODB_URI = [from MongoDB Atlas]
# JWT_SECRET = [run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
# SESSION_SECRET = [run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
# NODE_ENV = production

# 3. After that, every update just push:
git add .
git commit -m "Your commit message"
git push origin main

# Vercel auto-deploys!
```

---

## Resources

| Tool | Command | URL |
|------|---------|-----|
| Node.js | `node --version` | https://nodejs.org |
| Git | `git --version` | https://git-scm.com |
| npm | `npm --version` | https://npmjs.com |
| GitHub | Login | https://github.com |
| Vercel | Deploy | https://vercel.com |
| MongoDB | Cluster | https://www.mongodb.com/cloud/atlas |

---

## Windows PowerShell Tips

### Change Directory
```powershell
cd "d:\projects\Shri Hospital"
```

### Check Current Directory
```powershell
pwd
# or
Get-Location
```

### List Files
```powershell
ls
# or
dir
```

### Run Node Command
```powershell
node -v
npm -v
```

### Exit Commands
```
Press Ctrl+C to stop running processes
Type 'exit' to close terminal
```

---

**Print this page or bookmark it for quick reference!**
