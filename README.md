# Shri Hospital Management System

A comprehensive web-based Hospital Management System built with Node.js, Express.js, and MongoDB. This system digitizes hospital operations including patient care management, staff coordination, administrative tasks, appointment scheduling, and medical waste disposal tracking.

## Features

### 1. User Authentication & Role Management
- Secure login and logout system
- Role-based access control (Admin, Doctor, Staff, Receptionist)
- Session management with JWT tokens
- Password encryption using bcryptjs

### 2. Patient Care Management
- Patient registration and comprehensive profile management
- Digital medical records with history tracking
- Appointment history
- Diagnosis and prescription records
- Advanced search and filtering

### 3. Doctor & Staff Management
- Doctor profile management with specializations
- Department-wise staff listing
- Duty scheduling and shift management
- Workload and availability tracking

### 4. Appointment Scheduling System
- Easy appointment booking by patients/receptionists
- Doctor availability management
- Appointment approval, rescheduling, and cancellation
- Real-time status tracking

### 5. Administrative Management
- Department and ward/room management
- Automated billing and invoice generation
- Inventory and resource tracking
- Daily and monthly reports

### 6. Medical Waste Disposal Tracking
- Waste category management (Infectious, Sharps, Chemical, General, Pathological, Pharmaceutical)
- Daily waste entry recording
- Disposal method logging
- Date-wise and category-wise reports
- Compliance record maintenance

### 7. Dashboard & Reports
- Comprehensive admin dashboard with overview
- Patient and appointment statistics
- Medical waste summary reports
- Export functionality for reports

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Encryption**: bcryptjs
- **Reports**: PDF/Excel generation ready (pdfkit, exceljs)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud - MongoDB Atlas)
- npm or yarn

### Setup Steps

1. **Clone/Navigate to Project**
```bash
cd "d:\projects\Shri Hospital"
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment Variables**
```bash
# Copy .env.example to .env
copy .env.example .env

# Edit .env with your configuration:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shri-hospital
JWT_SECRET=your_secure_jwt_secret_key
SESSION_SECRET=your_secure_session_secret_key
NODE_ENV=development
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in MONGODB_URI
```

5. **Run the Server**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

6. **Access the Application**
- Open browser and navigate to: `http://localhost:5000`
- Login page: `http://localhost:5000/login`
- Dashboard: `http://localhost:5000/dashboard`

## Default Demo Credentials

### Admin Account
- Email: `admin@hospital.com`
- Password: `password123`

### Doctor Account
- Email: `doctor@hospital.com`
- Password: `password123`

### Receptionist Account
- Email: `receptionist@hospital.com`
- Password: `password123`

### Staff Account
- Email: `staff@hospital.com`
- Password: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Patients
- `GET /api/patients` - List all patients
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient information
- `DELETE /api/patients/:id` - Deactivate patient

### Doctors
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/:id` - Get doctor details
- `POST /api/doctors` - Create doctor profile
- `PUT /api/doctors/:id/availability` - Update doctor availability
- `PUT /api/doctors/:id/status` - Update doctor status

### Appointments
- `GET /api/appointments` - List appointments
- `GET /api/appointments/:id` - Get appointment details
- `POST /api/appointments` - Book appointment
- `PUT /api/appointments/:id/status` - Update appointment status
- `PUT /api/appointments/:id/reschedule` - Reschedule appointment
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Medical Records
- `GET /api/medical-records` - Get medical records
- `GET /api/medical-records/:id` - Get record details
- `POST /api/medical-records` - Create medical record
- `PUT /api/medical-records/:id` - Update medical record

### Medical Waste
- `GET /api/medical-waste` - List waste entries
- `GET /api/medical-waste/:id` - Get waste details
- `POST /api/medical-waste` - Create waste entry
- `PUT /api/medical-waste/:id/status` - Update waste status
- `GET /api/medical-waste/report/generate` - Generate waste report

### Invoices & Billing
- `GET /api/invoices` - List invoices
- `GET /api/invoices/:id` - Get invoice details
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id/payment` - Record payment

### Departments
- `GET /api/departments` - List departments
- `GET /api/departments/:id` - Get department details
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department

### Wards
- `GET /api/wards` - List wards
- `GET /api/wards/:id` - Get ward details
- `POST /api/wards` - Create ward
- `PUT /api/wards/:id` - Update ward

### Inventory
- `GET /api/inventory` - List inventory items
- `GET /api/inventory/:id` - Get item details
- `GET /api/inventory/low-stock` - Get low stock items
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/:id/quantity` - Update quantity

## Project Structure

```
Shri Hospital/
├── config/
│   └── database.js              # MongoDB connection
├── models/
│   ├── User.js                  # User model
│   ├── Patient.js               # Patient model
│   ├── Doctor.js                # Doctor model
│   ├── Appointment.js           # Appointment model
│   ├── MedicalRecord.js         # Medical record model
│   ├── Department.js            # Department model
│   ├── Ward.js                  # Ward model
│   ├── MedicalWaste.js          # Medical waste model
│   ├── Invoice.js               # Invoice model
│   └── Inventory.js             # Inventory model
├── controllers/
│   ├── authController.js        # Authentication logic
│   ├── patientController.js     # Patient management
│   ├── doctorController.js      # Doctor management
│   ├── appointmentController.js # Appointment booking
│   ├── medicalRecordController.js
│   ├── medicalWasteController.js
│   ├── invoiceController.js     # Billing & invoices
│   ├── departmentController.js
│   ├── wardController.js
│   └── inventoryController.js
├── routes/
│   ├── authRoutes.js
│   ├── patientRoutes.js
│   ├── doctorRoutes.js
│   ├── appointmentRoutes.js
│   ├── medicalRecordRoutes.js
│   ├── medicalWasteRoutes.js
│   ├── invoiceRoutes.js
│   ├── departmentRoutes.js
│   ├── wardRoutes.js
│   └── inventoryRoutes.js
├── middleware/
│   ├── auth.js                  # JWT authentication
│   └── errorHandler.js          # Error handling
├── public/
│   ├── css/
│   │   └── style.css            # Main stylesheet
│   └── js/
│       ├── app.js               # Main app functions
│       └── dashboard.js         # Dashboard functions
├── views/
│   ├── index.html               # Landing page
│   ├── login.html               # Login page
│   └── dashboard.html           # Main dashboard
├── utils/                       # Utility functions
├── server.js                    # Main server file
├── package.json                 # Dependencies
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

## Role-Based Permissions

### Admin
- Full access to all features
- Manage users and roles
- Create departments and wards
- Generate reports
- System configuration

### Doctor
- View own appointments
- Create and update medical records
- View patient information
- Manage availability and schedule
- View invoices and payments

### Receptionist
- Book and manage appointments
- Register new patients
- View patient information
- Create invoices
- View and manage appointments

### Staff
- Record medical waste
- Update waste disposal status
- View inventory
- Access assigned ward/department information

## Database Models

### User
- Authentication and profile information
- Role-based access control
- Department assignment

### Patient
- Personal and demographic information
- Medical history
- Emergency contacts
- Insurance details
- Blood type and allergies

### Doctor
- Professional credentials
- Specialization and department
- Availability schedule
- Consultation fees
- Patient and appointment tracking

### Appointment
- Booking details
- Status tracking
- Doctor availability checks
- Rescheduling and cancellation history

### MedicalRecord
- Patient health information
- Diagnosis and prescriptions
- Lab test results
- Vital signs
- Follow-up schedules

### MedicalWaste
- Waste categorization
- Quantity and unit tracking
- Hazard assessment
- Disposal methods and dates
- Compliance records

### Invoice
- Itemized billing
- Payment tracking
- Invoice status management
- Tax calculations

### Inventory
- Stock management
- Low stock alerts
- Supplier information
- Expiry date tracking

## Future Enhancements

1. **Email Notifications** - Automated appointment reminders and confirmations
2. **SMS Integration** - SMS alerts and notifications
3. **PDF Reports** - Generate downloadable PDF reports
4. **Analytics Dashboard** - Advanced statistics and visualization
5. **Mobile App** - React Native or Flutter mobile application
6. **Telemedicine** - Video consultation capabilities
7. **Prescription Management** - Digital prescription system
8. **Lab Management** - Lab test booking and result tracking
9. **Pharmacy Integration** - Medicine inventory and billing
10. **Multi-language Support** - Internationalization support

## Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env or use different port
PORT=3000
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- Verify MongoDB is accessible on localhost:27017 or your cloud provider

### JWT Token Issues
- Clear browser localStorage
- Generate new token by logging in again
- Check JWT_SECRET in .env is configured

## Contributing

To contribute to this project:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Contact: support@hospital.com
- Issues: Create an issue in the repository
- Documentation: See inline code comments

## Acknowledgments

This Hospital Management System was developed as part of a comprehensive healthcare digitization initiative to improve patient care and hospital operations based on real-world hospital requirements from Shri Hospital & Research Institute.

---

**Version**: 1.0.0
**Last Updated**: February 2024
