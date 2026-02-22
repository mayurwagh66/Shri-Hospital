require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('../config/database');
const errorHandler = require('../middleware/errorHandler');

// Import Routes
const authRoutes = require('../routes/authRoutes');
const patientRoutes = require('../routes/patientRoutes');
const doctorRoutes = require('../routes/doctorRoutes');
const appointmentRoutes = require('../routes/appointmentRoutes');
const medicalRecordRoutes = require('../routes/medicalRecordRoutes');
const medicalWasteRoutes = require('../routes/medicalWasteRoutes');
const invoiceRoutes = require('../routes/invoiceRoutes');
const departmentRoutes = require('../routes/departmentRoutes');
const wardRoutes = require('../routes/wardRoutes');
const inventoryRoutes = require('../routes/inventoryRoutes');

const app = express();

// Connect to Database (ensure only once per cold start)
let db = null;

const initializeDB = async () => {
  if (db) return;
  try {
    await connectDB();
    db = true;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// Initialize database before handling requests
app.use(async (req, res, next) => {
  await initializeDB();
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/medical-waste', medicalWasteRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/wards', wardRoutes);
app.use('/api/inventory', inventoryRoutes);

// Serve static HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'dashboard.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export for Vercel
module.exports = app;
