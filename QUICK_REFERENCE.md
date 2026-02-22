# Quick Reference Guide

## 🚀 Getting Started (2 minutes)

```powershell
# 1. Install & Setup
npm install
copy .env.example .env  # Configure MongoDB URI

# 2. Start Server
npm run dev             # Development mode with auto-reload

# 3. Access Application
# Browser: http://localhost:5000
```

---

## 🔐 Demo Credentials

```
Admin:       admin@hospital.com        / password123
Doctor:      doctor@hospital.com       / password123
Receptionist: receptionist@hospital.com / password123
Staff:       staff@hospital.com        / password123
```

---

## 📁 Project Structure at a Glance

```
models/           - Database schemas (10 models)
controllers/      - Business logic (9 controllers)
routes/           - API endpoints (10 route files)
middleware/       - Auth & error handling
public/css/       - Styling (style.css)
public/js/        - Frontend logic (app.js, dashboard.js)
views/            - HTML pages (login, dashboard, index)
config/           - Database configuration
init-data.js      - Initialize demo data
server.js         - Main server entry point
```

---

## 🔑 Key Files to Know

| File | Purpose |
|------|---------|
| `server.js` | Start point - imports all routes |
| `models/*.js` | Database schemas & validations |
| `controllers/*.js` | API business logic |
| `routes/*.js` | API endpoint definitions |
| `public/js/app.js` | Core JavaScript functions |
| `public/js/dashboard.js` | Dashboard interactions |
| `public/css/style.css` | All styling |
| `.env` | Configuration (create from .env.example) |

---

## 🛠️ Common Commands

```powershell
# Development
npm run dev                    # Start with auto-reload

# Production
npm start                      # Production server

# Database
node init-data.js              # Initialize sample data

# Dependencies
npm install                    # Install packages
npm list                       # List installed packages
npm update                     # Update packages
```

---

## 🌐 Main API Routes Summary

```
POST   /api/auth/login                 # User login
POST   /api/auth/register              # Register user
GET    /api/patients                   # List patients
POST   /api/patients                   # Create patient
GET    /api/appointments               # List appointments
POST   /api/appointments               # Book appointment
GET    /api/medical-waste              # List waste records
POST   /api/medical-waste              # Create waste entry
GET    /api/invoices                   # List invoices
POST   /api/invoices                   # Create invoice
```

See `API_DOCUMENTATION.md` for complete list (60+ endpoints)

---

## 🔄 Common Development Tasks

### Add a New API Endpoint

1. **Create Controller Function** (`controllers/xxx.js`)
```javascript
const getExample = async (req, res) => {
  try {
    // Logic here
    res.json({ message: 'Success', data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

2. **Add Route** (`routes/xxx.js`)
```javascript
router.get('/endpoint', authenticateToken, getExample);
```

3. **Register in Server** (`server.js`)
```javascript
app.use('/api/xxx', xxxRoutes);
```

### Add a New Database Field

1. **Modify Model** (`models/XXX.js`)
```javascript
newField: { type: String, required: true }
```

2. **Update Controller** to include new field
3. **Test with API**

### Create a New Page

1. **Create HTML** in `views/`
2. **Add CSS** in `public/css/style.css`
3. **Add JavaScript** in `public/js/`
4. **Add Route** in `server.js`

---

## 🐛 Debugging Tips

```javascript
// Log to console
console.log('Debug:', variable);

// Check in MongoDB
// Use MongoDB Compass to view collections

// Test API
// Use Postman or VSCode Thunder Client

// Check logs
// All errors logged in console when npm run dev
```

---

## 📚 File Relationships

```
User (model)
  ↓
authController
  ├→ login()
  ├→ register()
  └→ getProfile()
  ↓
authRoutes
  ├→ POST /api/auth/login
  ├→ POST /api/auth/register
  └→ GET /api/auth/profile
```

---

## 🔒 Authentication Flow

1. User submits login (email, password)
2. Check password against database hash
3. Generate JWT token
4. Send token to frontend
5. Frontend stores token in localStorage
6. Each request includes `Authorization: Bearer <token>`
7. Middleware validates token
8. Request processed if valid

---

## 💾 Database Connection

```javascript
// Current: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/shri-hospital

// For MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shri-hospital
```

---

## 🎨 Frontend Architecture

```
index.html              # Landing page
  ↓
login.html              # Login form
  ↓
dashboard.html          # Main app
  ├→ public/js/app.js         # API functions
  ├→ public/js/dashboard.js   # UI interactions
  └→ public/css/style.css     # Styling
```

---

## 📊 Database Collections

```
users              # User accounts (Admin, Doctor, Staff, Receptionist)
patients           # Patient information
doctors            # Doctor profiles
appointments       # Appointment bookings
medicalrecords     # Patient medical history
departments        # Hospital departments
wards              # Hospital wards/rooms
medicalwastes      # Waste tracking
invoices           # Billing records
inventories        # Stock management
```

---

## ✅ Role Permissions Quick Reference

| Feature | Admin | Doctor | Receptionist | Staff |
|---------|-------|--------|--------------|-------|
| View Patients | ✅ | ✅ | ✅ | ❌ |
| Create Patient | ✅ | ❌ | ✅ | ❌ |
| Book Appointment | ✅ | ❌ | ✅ | ❌ |
| Create Medical Record | ✅ | ✅ | ❌ | ❌ |
| Create Waste Entry | ✅ | ❌ | ❌ | ✅ |
| Create Invoice | ✅ | ❌ | ✅ | ❌ |
| View Reports | ✅ | ✅ | ❌ | ❌ |
| Manage Inventory | ✅ | ❌ | ❌ | ✅ |

---

## 🔧 Configuration Files

**.env** (Create from .env.example)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shri-hospital
JWT_SECRET=your_secret_key
SESSION_SECRET=your_session_secret
NODE_ENV=development
```

**package.json** - Dependency list  
**.gitignore** - Git ignore rules  
**SETUP.md** - Detailed setup guide  
**README.md** - Full documentation  
**API_DOCUMENTATION.md** - API reference  

---

## 🧪 Testing Common Scenarios

### Test Login
```
1. Click Login button
2. Enter: admin@hospital.com / password123
3. Should redirect to dashboard
```

### Test Create Patient
```
1. Go to Patients section
2. Click "Add New Patient"
3. Fill form and submit
4. Should see in patients list
```

### Test Appointment Booking
```
1. Go to Appointments section
2. Click "Book Appointment"
3. Select patient, doctor, date, time
4. Submit
5. Should appear in appointment list
```

---

## 🚨 Common Errors & Fixes

| Error | Solution |
|-------|----------|
| Connection refused | Start MongoDB with `mongod` |
| Port 5000 in use | Change PORT in .env |
| Token invalid | Log in again, clear localStorage |
| Module not found | Run `npm install` |
| Cannot POST /api/... | Check route file is imported in server.js |

---

## 📱 Responsive Design Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

All CSS responsive ready. Test with DevTools (F12).

---

## 🔗 Useful Links

- **Node.js Docs**: https://nodejs.org/docs/
- **Express.js Guide**: https://expressjs.com/
- **MongoDB Manual**: https://docs.mongodb.com/
- **Mongoose Docs**: https://mongoosejs.com/
- **JWT.io**: https://jwt.io/ (decode tokens)

---

## 📋 Code Snippets

### Make an API Call (Frontend)
```javascript
const result = await apiCall('/endpoint', {
  method: 'POST',
  body: JSON.stringify(data)
});
if (result.success) {
  showAlert('Success!', 'success');
}
```

### Create Model Method
```javascript
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};
```

### Use Middleware
```javascript
router.get('/protected', authenticateToken, authorize('Admin'), controller);
```

---

## 🎯 Next Steps After Setup

1. ✅ Start server with `npm run dev`
2. ✅ Navigate to http://localhost:5000
3. ✅ Log in with demo credentials
4. ✅ Explore each section
5. ✅ Test creating records
6. ✅ Check database in MongoDB Compass
7. ✅ Review code structure
8. ✅ Customize as needed

---

## 📞 Support

- **Setup Issues**: See `SETUP.md`
- **API Questions**: See `API_DOCUMENTATION.md`
- **General Info**: See `README.md`
- **Code Questions**: Check inline comments in source files

---

**Last Updated**: February 2024  
**Version**: 1.0.0

---

*For detailed documentation, refer to the comprehensive guides in the project.*
