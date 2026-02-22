# Setup Guide - Shri Hospital Management System

## Quick Start Guide

This guide will help you set up and run the Shri Hospital Management System on your local machine.

## Prerequisites Checklist

- [ ] Node.js (v14 or higher) installed
- [ ] MongoDB installed locally OR MongoDB Atlas account
- [ ] npm or yarn package manager
- [ ] A code editor (VS Code recommended)
- [ ] Git (optional, for version control)

## Step-by-Step Setup

### 1. Prepare the Environment

```powershell
# Navigate to project directory
cd "d:\projects\Shri Hospital"

# Verify Node.js installation
node --version
npm --version
```

### 2. Install Dependencies

```powershell
npm install
```

This will install all required packages:
- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password encryption
- jsonwebtoken - JWT authentication
- dotenv - Environment variables
- And more...

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```
# Copy from .env.example
copy .env.example .env

# Edit .env with your settings
```

**Important Configuration:**

#### Option A: Local MongoDB
```
MONGODB_URI=mongodb://localhost:27017/shri-hospital
```

Ensure MongoDB is running:
```powershell
# If you have MongoDB installed locally
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Update `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shri-hospital
```

#### JWT Configuration
```
JWT_SECRET=your_very_secure_random_string_here_change_this
SESSION_SECRET=another_secure_random_string_here
```

### 4. Initialize Sample Data

```powershell
# Run the initialization script
node init-data.js
```

This will create:
- 4 user accounts (Admin, Doctor, Receptionist, Staff)
- 5 departments
- 1 doctor profile
- 3 sample patients

### 5. Start the Server

#### Development Mode (with auto-reload)
```powershell
npm run dev
```

#### Production Mode
```powershell
npm start
```

### 6. Access the Application

Open your browser and navigate to:

- **Home Page**: http://localhost:5000
- **Login**: http://localhost:5000/login
- **Dashboard**: http://localhost:5000/dashboard (after login)

## Login with Demo Accounts

### Admin Account
```
Email: admin@hospital.com
Password: password123
```
**Permissions**: Full access to all features

### Doctor Account
```
Email: doctor@hospital.com
Password: password123
```
**Permissions**: View appointments, manage medical records, etc.

### Receptionist Account
```
Email: receptionist@hospital.com
Password: password123
```
**Permissions**: Book appointments, manage patients, create invoices

### Staff Account
```
Email: staff@hospital.com
Password: password123
```
**Permissions**: Record medical waste, update inventory

## Verify Installation

### Check API Status
Test the API is running with:
```powershell
# In another PowerShell window
curl http://localhost:5000/api/auth/login -Method POST
```

### Check MongoDB Connection
```powershell
# View logs for "MongoDB Connected" message
# Should see this in console when server starts
```

### Test Frontend
1. Visit http://localhost:5000
2. You should see the landing page with hospital logo
3. Navigate to login page
4. Try logging in with demo credentials

## Troubleshooting

### Issue: MongoDB Connection Failed
**Solution**:
- Ensure MongoDB is running (for local setup)
- Check connection string in .env
- Verify MongoDB is listening on port 27017
- Check network connectivity for MongoDB Atlas

### Issue: Port 5000 is Already in Use
**Solution**:
```env
# Change in .env file
PORT=3000
```

### Issue: Module Not Found Error
**Solution**:
```powershell
# Reinstall dependencies
rm -r node_modules
npm install
```

### Issue: JWT Token Errors
**Solution**:
- Clear browser localStorage
- Log out and log in again
- Check JWT_SECRET is configured in .env

### Issue: Cannot Connect to Database
**Solution**:
```powershell
# Test MongoDB connection
# Windows - check if service is running
Get-Service | Where-Object {$_.Name -like "*Mongo*"}

# Or start MongoDB service
net start MongoDB
```

## Development Tips

### Using nodemon for Auto-Reload
Already configured in package.json with `npm run dev`

### Debugging
Add breakpoints in your code and use VS Code debugger

### API Testing
Use Postman or VS Code's Thunder Client extension to test APIs

## Project Structure Verification

After setup, verify these folders exist:
```
Shri Hospital/
├── config/           ✓ Database configuration
├── controllers/      ✓ Business logic
├── models/          ✓ Database schemas
├── routes/          ✓ API endpoints
├── middleware/      ✓ Auth & error handling
├── public/          ✓ Static files (CSS, JS)
  ├── css/
  └── js/
├── views/           ✓ HTML pages
├── node_modules/    ✓ Dependencies (auto-created)
├── server.js        ✓ Main server file
├── package.json     ✓ Dependencies list
├── .env             ✓ Environment variables
├── README.md        ✓ Full documentation
└── init-data.js     ✓ Data initialization
```

## Next Steps

1. **Explore the Dashboard**
   - Log in as Admin
   - Navigate through different sections
   - Try creating a patient record

2. **Test Appointments**
   - Create patients
   - Book appointments
   - Test appointment management features

3. **Medical Waste Tracking**
   - Record waste entries
   - Update waste status
   - Generate reports

4. **Review Database**
   - Use MongoDB Compass to view collections
   - Understand data structure

5. **Customize**
   - Modify styling in public/css/style.css
   - Add business logic in controllers
   - Extend models with additional fields

## Performance Optimization

### For Production Deployment:
1. Set NODE_ENV=production in .env
2. Use environment-specific database connections
3. Enable CORS if frontend is on different domain
4. Set up monitoring and logging
5. Configure backup strategy for MongoDB

## Security Checklist

- [ ] Change all default passwords
- [ ] Generate strong JWT_SECRET
- [ ] Enable HTTPS in production
- [ ] Set secure MongoDB Atlas credentials
- [ ] Add rate limiting to API endpoints
- [ ] Implement CSRF protection
- [ ] Regular security updates to packages

## Support Resources

- **Node.js**: https://nodejs.org/docs/
- **Express.js**: https://expressjs.com/
- **MongoDB**: https://docs.mongodb.com/
- **Mongoose**: https://mongoosejs.com/docs/

## Additional Setup Options

### Using PM2 for Production
```powershell
npm install -g pm2
pm2 start server.js --name "shri-hospital"
pm2 save
```

### Using Docker (Optional)
Create a Dockerfile and docker-compose.yml for containerized deployment.

### Using Nginx as Reverse Proxy
Configure Nginx to proxy requests to your Node.js application.

---

**Setup Status**: Ready to Start
**Last Updated**: February 2024

For more help, see README.md or contact support@hospital.com
