# Vercel Deployment - Technical Architecture & Reference

## How Your App Works on Vercel

### Local Development (Traditional)
```
Your Computer
    ↓
npm run dev (port 5000)
    ↓
Express Server (server.js)
    ↓
MongoDB (localhost:27017)
```

### Vercel Production (Serverless)
```
User Browser
    ↓
Vercel Edge (Global CDN)
    ↓
Serverless Function (api/index.js)
    ↓
MongoDB Atlas (Cloud Database)
```

---

## File Structure & Purpose

### New/Modified Files for Vercel:

```
project/
├── vercel.json                 # Vercel configuration
│   ├── version: 2             # Vercel API version
│   ├── builds: Configure how to build your app
│   └── routes: Define URL routing rules
│
├── api/
│   └── index.js               # Serverless function entry point
│       ├── Serves as Express app
│       ├── Handles all /api/* routes
│       ├── Connects to MongoDB
│       └── Returns responses
│
├── config/
│   └── database.js            # Modified with connection pooling
│       ├── Caches connections (important!)
│       └── Optimized for serverless
│
├── server.js                  # Updated for both local & serverless
│       ├── Runs locally with: npm run dev
│       └── Ignores listener on Vercel
│
└── .env.example               # Updated with detailed comments
```

---

## Vercel.json Configuration Explained

### "builds" Section
```json
"builds": [
  {
    "src": "api/index.js",     // Entry point
    "use": "@vercel/node"      // Use Node.js runtime
  }
]
```
- Tells Vercel to use the Node.js runtime for your serverless functions
- The `api/index.js` becomes a serverless function

### "routes" Section
```json
"routes": [
  {
    "src": "/api/(.*)",        // Matches /api/*
    "dest": "api/index.js"     // Route to serverless function
  }
]
```
- `/api/auth` → `api/index.js` → Express handles it
- `/api/health` → `api/index.js` → Express handles it
- All routes go through the single serverless function

---

## How API Requests Are Handled

### Request Flow:
```
1. User makes request: GET /api/patients
   ↓
2. Request hits Vercel Edge
   ↓
3. Vercel invokes serverless function (api/index.js)
   ↓
4. Express.js app inside function receives request
   ↓
5. Middleware processes request:
   - Parse JSON
   - Initialize database connection
   ↓
6. Router matches /api/patients to patientRoutes
   ↓
7. Controller executes (e.g., getPatients)
   ↓
8. Database query executed on MongoDB Atlas
   ↓
9. Response sent back to user
   ↓
10. Serverless function completes
```

---

## Database Connection Optimization

### Why Connection Pooling Matters?

**Without pooling (OLD):**
- Each request creates new MongoDB connection → SLOW
- Creates ~1000 connections per day → WASTEFUL
- May hit MongoDB connection limit

**With pooling (NEW):**
- First request creates connection
- Subsequent requests reuse connection → FAST
- Caches connection in global memory
- MongoDB Atlas uses efficient pool

### Code in config/database.js:
```javascript
let cached = global.mongoose;  // Store in global memory

const connectDB = async () => {
  if (cached.conn) {           // Already connected?
    return cached.conn;        // Reuse it!
  }
  // If not, create new connection...
  cached.conn = await mongoose.connect(...);
  return cached.conn;
};
```

This means:
- 1st request: Takes ~200ms to connect
- 2nd+ requests: Takes ~10ms to use cached connection
- Much faster responses!

---

## Environment Variables Management

### How Variables Flow to Vercel:

```
.env (Local Development)
    ↑ (Your computer only)
    X (Don't push to GitHub!)
    
↓

DEPLOYMENT_CHECKLIST.md (Guide for you)
    ↓
You manually add in Vercel Dashboard
    ↓
Vercel Dashboard → Settings → Environment Variables
    ↓
Vercel injects into serverless function at runtime
    ↓
process.env.MONGODB_URI becomes available
```

### Environment Variables Needed:

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@...` |
| `JWT_SECRET` | Sign auth tokens | Random 32+ char string |
| `SESSION_SECRET` | Encrypt sessions | Random 32+ char string |
| `NODE_ENV` | Environment flag | `production` |

---

## Performance Considerations

### Vercel Serverless Limits:

| Limit | Free Plan | Pro Plan |
|-------|-----------|----------|
| Function Timeout | 10 seconds | 60 seconds |
| Max File Size | 50MB | 50MB |
| Max Bundle Size | 50MB | 50MB |
| Concurrent Executions | Limited | Higher |

### Optimization Tips:

1. **Keep Functions Fast** (< 10 seconds)
   - Optimize database queries
   - Add MongoDB indexes
   - Cache frequently accessed data

2. **Database Optimization**
   ```javascript
   // BAD - Gets all fields
   Patient.find({});
   
   // GOOD - Only needed fields
   Patient.find({}, 'name email dateOfBirth');
   
   // GOOD - With index
   Patient.find({email: 'test@example.com'}).lean(); // lean() = read-only
   ```

3. **Avoid File Storage**
   - ServerlessLocal `/tmp` space is temporary
   - Use MongoDB for structured data
   - Use cloud storage (AWS S3, Cloudinary) for files

4. **Connection Pooling** ✅
   - Already configured in database.js
   - Connection reused across requests

---

## Monitoring & Debugging

### Vercel Logs Access:

```
Vercel Dashboard
    ↓
Select Your Project
    ↓
Deployments Tab
    ↓
Click Latest Deployment
    ↓
View "Logs" Tab
```

### What to Look For:

```
✅ Good Signs:
- "MongoDB Connected"
- "200 OK" responses
- Request times < 5 seconds

❌ Bad Signs:
- "MongoDB Connection Error"
- "Cannot find module"
- "504 Gateway Timeout"
- Memory errors
```

### Common Errors & Fixes:

**Error: "MongoDB connection refused"**
```
Fix:
1. Check MONGODB_URI in Vercel env vars
2. Check MongoDB Atlas Network Access (IP whitelist)
3. Verify credentials in connection string
```

**Error: "Cannot find module X"**
```
Fix:
1. Check package.json has dependency
2. Run npm install locally
3. Commit node_modules changes (or let Vercel install)
```

**Error: "504 Gateway Timeout"**
```
Fix:
1. Optimize database queries
2. Add indexes to frequently queried fields
3. Reduce response payload size
4. Consider caching responses
```

---

## Deployment Workflow

### Initial Deployment:

```
1. Push code to GitHub
2. Vercel automatically detects push
3. Runs build process (~1 min)
4. Deploys to edge locations
5. Runs tests (if configured)
6. App becomes live (within 5 min)
```

### Subsequent Deployments:

```
Every time you push to main branch:
git add .
git commit -m "Update feature"
git push origin main
    ↓
Vercel automatically redeploys
    ↓
New version live within 2-3 minutes
```

### Manual Redeployment:

```
Vercel Dashboard
    ↓
Click "Redeploy" button on deployment
    ↓
Re-runs build without code change
    ↓
Useful if env vars changed
```

---

## Database Backups & Maintenance

### MongoDB Atlas Automatic Backups:

```
MongoDB Atlas Dashboard
    ↓
Clusters → Backup
    ↓
Snapshots are automatic (every 6 hours)
    ↓
Free tier keeps 7-day backup
```

### Manual Backup (Recommended):

```bash
# Export collection as JSON
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/shri-hospital" \
  --out ./backup

# Or use MongoDB Atlas GUI:
# Database → Collections → Export Collection
```

---

## Scaling Considerations

### Current Architecture Supports:

- Small to Medium deployments
- Up to ~5,000 concurrent users
- Up to ~100,000 requests/day on free tier
- Upgrade to Pro for higher limits

### If Traffic Increases:

1. **Upgrade Vercel Plan**
   - More memory per function
   - Longer timeout (up to 60s)
   - Higher concurrency

2. **Upgrade MongoDB**
   - Shared tier (free) → Dedicated cluster (paid)
   - More compute power
   - Better performance

3. **Add Caching**
   - Vercel Edge Caching
   - Redis for session data
   - Reduce database hits

---

## Security Best Practices

### Secrets Management:

✅ DO:
- Use strong, random secrets (32+ characters)
- Store in Vercel environment variables only
- Rotate secrets periodically
- Use different secrets for dev/prod

❌ DON'T:
- Commit `.env` file to GitHub
- Hardcode secrets in code
- Share secret values
- Reuse same secret across projects

### Network Security:

✅ Configure MongoDB:
- Add IP whitelist
- Use strong passwords
- Enable database user authentication
- Use SSL/TLS connections

---

## Troubleshooting Deployment Issues

### Pre-Deployment Checks:

```bash
# 1. Check Node version
node --version  # Should be v14+

# 2. Check dependencies
npm install
npm list

# 3. Check for syntax errors
npm run dev  # Should start without errors

# 4. Check file structure
ls api/index.js            # Should exist
ls vercel.json            # Should exist
ls config/database.js     # Should exist
```

### During Deployment:

```
Watch Vercel deployment log for:
- ✅ "Build completed"
- ✅ "Ready"
- ❌ "Build failed"
- ❌ "Error: Cannot find module"
```

### After Deployment:

```
1. Check health endpoint:
   https://your-app.vercel.app/api/health
   
2. Check Vercel logs:
   Deployments → Click latest → Logs tab
   
3. Test API endpoints:
   https://your-app.vercel.app/api/patients
   
4. Verify static files:
   https://your-app.vercel.app/
   https://your-app.vercel.app/login
```

---

## Advanced: Custom Domains & DNS

### Add Custom Domain:

```
Vercel Dashboard
    ↓
Settings → Domains
    ↓
Add Domain button
    ↓
Enter your domain (e.g., hospital.example.com)
    ↓
Update DNS records with your registrar
    ↓
Wait 24-48 hours for propagation
    ↓
Certificate auto-generated by Vercel
```

### DNS Record Types:

```
Method 1: Change Nameservers (Simplest)
Nameserver: ns1.vercel.com
Nameserver: ns2.vercel.com

Method 2: Add CNAME (If keeping current DNS)
CNAME: cname.vercel.click
```

---

## Reference Commands

```bash
# Local Development
npm install                    # Install dependencies
npm run dev                   # Start dev server (localhost:5000)
npm start                     # Start production server

# Git Operations
git init                      # Initialize repository
git add .                     # Stage all files
git commit -m "message"       # Commit changes
git push origin main          # Push to GitHub

# Vercel CLI
npm install -g vercel         # Install Vercel CLI
vercel login                  # Login to Vercel
vercel --prod                 # Deploy to production
vercel env list               # List environment variables

# Database (MongoDB)
mongosh                       # Connect to local MongoDB
show dbs                      # List all databases
use shri-hospital            # Switch to database
db.patients.find()           # Query collection
```

---

## FAQ

**Q: Will my database get deleted when Vercel redeploys?**
A: No! MongoDB Atlas is separate from Vercel. Data persists.

**Q: Can I use localhost MongoDB on Vercel?**
A: No. Vercel serverless can't access localhost. Must use MongoDB Atlas.

**Q: How do I see my server logs?**
A: Vercel Dashboard → Deployments → Your deployment → Logs tab

**Q: Can I rollback to a previous version?**
A: Yes, in Vercel: Deployments → Click older version → Redeploy

**Q: Is the free tier enough?**
A: Yes, for small projects with low traffic. Upgrade if needed.

**Q: How much does it cost?**
A: Vercel free tier. MongoDB Atlas free tier (512MB storage). Then pay-as-you-go if scaled.

---

## Summary

Your Shri Hospital app is now ready for serverless deployment on Vercel with:
- ✅ MongoDB Atlas cloud database
- ✅ Connection pooling for performance
- ✅ Optimized Express.js setup
- ✅ Environment variable management
- ✅ Error handling & logging
- ✅ Static file serving

Follow DEPLOYMENT_CHECKLIST.md for step-by-step setup!
