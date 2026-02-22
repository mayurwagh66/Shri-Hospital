# API Documentation - Shri Hospital Management System

## Base URL
```
http://localhost:5000/api
```

## Authentication

All endpoints (except login and register) require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Request Headers Example
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Authentication Endpoints

### 1. User Login
**POST** `/api/auth/login`

Register and get JWT token

**Request Body:**
```json
{
  "email": "admin@hospital.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@hospital.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "Admin"
  }
}
```

---

### 2. User Registration
**POST** `/api/auth/register`

Create a new user account

**Request Body:**
```json
{
  "username": "newdoctor",
  "email": "newdoctor@hospital.com",
  "password": "securepass123",
  "firstName": "Dr. Firstname",
  "lastName": "Lastname",
  "phone": "9876543210",
  "role": "Doctor"
}
```

**Response (201 Created):**
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "email": "newdoctor@hospital.com",
    "firstName": "Dr. Firstname",
    "role": "Doctor"
  }
}
```

---

### 3. Get User Profile
**GET** `/api/auth/profile`

Requires: Authentication

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "admin",
  "email": "admin@hospital.com",
  "firstName": "Admin",
  "lastName": "User",
  "phone": "9876543210",
  "role": "Admin",
  "isActive": true,
  "createdAt": "2024-02-22T10:30:00Z",
  "updatedAt": "2024-02-22T10:30:00Z"
}
```

---

### 4. Update User Profile
**PUT** `/api/auth/profile`

Requires: Authentication

**Request Body:**
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "phone": "9999999999"
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": { }
}
```

---

## Patient Endpoints

### 1. Get All Patients
**GET** `/api/patients?page=1&search=john`

Requires: Authentication

**Query Parameters:**
- `page` (optional) - Page number for pagination (default: 1)
- `limit` (optional) - Records per page (default: 10)
- `search` (optional) - Search by name, email, phone, or patient ID

**Response (200 OK):**
```json
{
  "patients": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "patientId": "PAT000001",
      "firstName": "Ramesh",
      "lastName": "Patel",
      "dateOfBirth": "1975-05-15",
      "gender": "Male",
      "email": "ramesh@email.com",
      "phone": "9876543214",
      "bloodType": "O+",
      "totalVisits": 5,
      "lastVisit": "2024-02-20T15:30:00Z",
      "isActive": true
    }
  ],
  "totalPages": 1,
  "currentPage": 1,
  "total": 1
}
```

---

### 2. Get Patient by ID
**GET** `/api/patients/:id`

Requires: Authentication

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "patientId": "PAT000001",
  "firstName": "Ramesh",
  "lastName": "Patel",
  "dateOfBirth": "1975-05-15T00:00:00Z",
  "gender": "Male",
  "email": "ramesh@email.com",
  "phone": "9876543214",
  "address": "123 Main Street",
  "city": "Delhi",
  "state": "Delhi",
  "zipCode": "110001",
  "bloodType": "O+",
  "emergencyContactName": "Priya Patel",
  "emergencyContactPhone": "9876543215",
  "allergies": ["Penicillin"],
  "chronicDiseases": ["Diabetes", "Hypertension"],
  "insuranceProvider": "ABC Insurance",
  "insurancePolicyNumber": "POL123456",
  "registrationDate": "2024-01-15T10:00:00Z",
  "lastVisit": "2024-02-20T15:30:00Z",
  "totalVisits": 5,
  "isActive": true
}
```

---

### 3. Create Patient
**POST** `/api/patients`

Requires: Authentication, Role: Admin or Receptionist

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-15",
  "gender": "Male",
  "email": "john@email.com",
  "phone": "9876543220",
  "address": "789 Oak Street",
  "city": "Bangalore",
  "state": "Karnataka",
  "zipCode": "560001",
  "bloodType": "A+",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "9876543221",
  "allergies": [],
  "chronicDiseases": []
}
```

**Response (201 Created):**
```json
{
  "message": "Patient created successfully",
  "patient": {
    "_id": "507f1f77bcf86cd799439014",
    "patientId": "PAT000002",
    "firstName": "John",
    "lastName": "Doe",
    ...
  }
}
```

---

### 4. Update Patient
**PUT** `/api/patients/:id`

Requires: Authentication, Role: Admin or Doctor

**Request Body:** (same as create)

**Response (200 OK):**
```json
{
  "message": "Patient updated successfully",
  "patient": { }
}
```

---

### 5. Delete Patient
**DELETE** `/api/patients/:id`

Requires: Authentication, Role: Admin

Sets `isActive` to false (soft delete)

**Response (200 OK):**
```json
{
  "message": "Patient deactivated successfully"
}
```

---

## Doctor Endpoints

### 1. Get All Doctors
**GET** `/api/doctors?department=507f1f77bcf86cd799439015&page=1`

Requires: Authentication

**Query Parameters:**
- `department` (optional) - Filter by department ID
- `page` (optional) - Page number
- `limit` (optional) - Records per page

**Response (200 OK):**
```json
{
  "doctors": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "Dr. Rajesh",
        "lastName": "Kumar",
        "email": "doctor@hospital.com"
      },
      "licenseNumber": "MCI2024001",
      "specialization": "Cardiology",
      "department": {
        "_id": "507f1f77bcf86cd799439015",
        "name": "Cardiology"
      },
      "experience": 10,
      "consultationFee": 500,
      "isAvailable": true,
      "totalAppointments": 145,
      "totalPatients": 32
    }
  ],
  "totalPages": 1,
  "currentPage": 1,
  "total": 1
}
```

---

### 2. Get Doctor by ID
**GET** `/api/doctors/:id`

Requires: Authentication

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "userId": { },
  "licenseNumber": "MCI2024001",
  "specialization": "Cardiology",
  "department": { },
  "qualification": ["MBBS", "MD Cardiology"],
  "experience": 10,
  "consultationFee": 500,
  "availableSlots": {
    "monday": ["09:00", "10:00", "11:00", "14:00", "15:00"],
    "tuesday": ["09:00", "10:00", "11:00", "14:00", "15:00"],
    ...
  },
  "isAvailable": true,
  "totalAppointments": 145,
  "totalPatients": 32
}
```

---

### 3. Create Doctor Profile
**POST** `/api/doctors`

Requires: Authentication, Role: Admin

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "licenseNumber": "MCI2024002",
  "specialization": "General Medicine",
  "departmentId": "507f1f77bcf86cd799439015",
  "qualification": ["MBBS"],
  "experience": 5,
  "consultationFee": 300
}
```

**Response (201 Created):**
```json
{
  "message": "Doctor created successfully",
  "doctor": { }
}
```

---

### 4. Update Doctor Availability
**PUT** `/api/doctors/:id/availability`

Requires: Authentication, Role: Admin or Doctor

**Request Body:**
```json
{
  "availableSlots": {
    "monday": ["09:00", "10:00", "11:00", "14:00", "15:00"],
    "tuesday": ["09:00", "10:00", "11:00", "14:00", "15:00"],
    "wednesday": [],
    "thursday": ["09:00", "10:00", "11:00", "14:00", "15:00"],
    "friday": ["09:00", "10:00", "11:00", "14:00", "15:00"],
    "saturday": ["10:00", "11:00"],
    "sunday": []
  }
}
```

**Response (200 OK):**
```json
{
  "message": "Doctor availability updated successfully",
  "doctor": { }
}
```

---

## Appointment Endpoints

### 1. Get All Appointments
**GET** `/api/appointments?status=Scheduled&page=1`

Requires: Authentication

**Query Parameters:**
- `status` (optional) - Filter by status (Scheduled, Confirmed, Completed, Cancelled, Rescheduled)
- `doctorId` (optional) - Filter by doctor
- `patientId` (optional) - Filter by patient
- `page` (optional) - Page number

**Response (200 OK):**
```json
{
  "appointments": [
    {
      "_id": "507f1f77bcf86cd799439017",
      "appointmentId": "APT000001",
      "patient": {
        "_id": "507f1f77bcf86cd799439013",
        "firstName": "Ramesh",
        "lastName": "Patel",
        "patientId": "PAT000001"
      },
      "doctor": { },
      "department": { },
      "appointmentDate": "2024-02-25T10:00:00Z",
      "timeSlot": "09:00",
      "status": "Scheduled",
      "reason": "Regular checkup",
      "consultationFee": 500,
      "bookedAt": "2024-02-22T10:30:00Z"
    }
  ]
}
```

---

### 2. Book Appointment
**POST** `/api/appointments`

Requires: Authentication, Role: Receptionist or Patient

**Request Body:**
```json
{
  "patientId": "507f1f77bcf86cd799439013",
  "doctorId": "507f1f77bcf86cd799439016",
  "appointmentDate": "2024-02-25",
  "timeSlot": "10:00",
  "reason": "Initial consultation"
}
```

**Response (201 Created):**
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "_id": "507f1f77bcf86cd799439017",
    "appointmentId": "APT000001",
    ...
  }
}
```

---

### 3. Update Appointment Status
**PUT** `/api/appointments/:id/status`

Requires: Authentication, Role: Admin or Doctor

**Request Body:**
```json
{
  "status": "Completed",
  "notes": "Patient consultation completed successfully"
}
```

**Response (200 OK):**
```json
{
  "message": "Appointment updated successfully",
  "appointment": { }
}
```

---

### 4. Reschedule Appointment
**PUT** `/api/appointments/:id/reschedule`

Requires: Authentication, Role: Receptionist

**Request Body:**
```json
{
  "appointmentDate": "2024-02-26",
  "timeSlot": "11:00"
}
```

**Response (200 OK):**
```json
{
  "message": "Appointment rescheduled successfully",
  "appointment": { }
}
```

---

### 5. Cancel Appointment
**PUT** `/api/appointments/:id/cancel`

Requires: Authentication

**Request Body:**
```json
{
  "cancellationReason": "Patient requested cancellation"
}
```

**Response (200 OK):**
```json
{
  "message": "Appointment cancelled successfully",
  "appointment": { }
}
```

---

## Medical Waste Endpoints

### 1. Get All Waste
**GET** `/api/medical-waste?category=Infectious&status=Collected&page=1`

Requires: Authentication

**Query Parameters:**
- `category` (optional) - Infectious, Sharps, Chemical, General, Pathological, Pharmaceutical
- `status` (optional) - Collected, Stored, Processed, Disposed
- `startDate` (optional) - Filter from date
- `endDate` (optional) - Filter to date
- `page` (optional) - Page number

**Response (200 OK):**
```json
{
  "waste": [
    {
      "_id": "507f1f77bcf86cd799439018",
      "wasteId": "WAS000001",
      "category": "Infectious",
      "date": "2024-02-22T10:00:00Z",
      "departmentSource": {
        "_id": "507f1f77bcf86cd799439015",
        "name": "Cardiology"
      },
      "quantity": 15,
      "unit": "kg",
      "hazardLevel": "High",
      "status": "Collected",
      "complianceStatus": "Compliant"
    }
  ]
}
```

---

### 2. Create Waste Entry
**POST** `/api/medical-waste`

Requires: Authentication, Role: Staff

**Request Body:**
```json
{
  "category": "Infectious",
  "departmentId": "507f1f77bcf86cd799439015",
  "wardId": "507f1f77bcf86cd799439019",
  "quantity": 15,
  "unit": "kg",
  "description": "Used dressings and gauzes",
  "hazardLevel": "High"
}
```

**Response (201 Created):**
```json
{
  "message": "Waste entry created successfully",
  "waste": { }
}
```

---

### 3. Update Waste Status
**PUT** `/api/medical-waste/:id/status`

Requires: Authentication, Role: Staff or Admin

**Request Body:**
```json
{
  "status": "Disposed",
  "disposalMethod": "Incineration",
  "disposalDate": "2024-02-22",
  "disposalVendor": "ABC Waste Management",
  "certificateNumber": "CERT123456",
  "notes": "Disposed according to biomedical waste management rules"
}
```

**Response (200 OK):**
```json
{
  "message": "Waste status updated successfully",
  "waste": { }
}
```

---

### 4. Get Waste Report
**GET** `/api/medical-waste/report/generate?startDate=2024-02-01&endDate=2024-02-28&category=Infectious`

Requires: Authentication, Role: Admin

**Query Parameters:**
- `startDate` (optional) - Start date in YYYY-MM-DD format
- `endDate` (optional) - End date in YYYY-MM-DD format
- `category` (optional) - Filter by waste category

**Response (200 OK):**
```json
{
  "report": {
    "totalQuantity": 150,
    "byCategory": {
      "Infectious": 60,
      "Sharps": 40,
      "Chemical": 30,
      "General": 20
    },
    "byDepartment": {
      "Cardiology": 50,
      "Surgery": 60,
      "General Medicine": 40
    },
    "byStatus": {
      "Disposed": 150
    },
    "complianceStatus": {
      "Compliant": 150
    }
  },
  "waste": [ ]
}
```

---

## Invoice Endpoints

### 1. Get All Invoices
**GET** `/api/invoices?status=Pending&page=1`

Requires: Authentication, Role: Admin or Receptionist

**Query Parameters:**
- `status` (optional) - Pending, Partial, Paid, Overdue
- `patientId` (optional) - Filter by patient
- `page` (optional) - Page number

**Response (200 OK):**
```json
{
  "invoices": [
    {
      "_id": "507f1f77bcf86cd79943901a",
      "invoiceId": "INV000001",
      "patient": {
        "_id": "507f1f77bcf86cd799439013",
        "firstName": "Ramesh",
        "lastName": "Patel",
        "patientId": "PAT000001"
      },
      "billDate": "2024-02-22T10:00:00Z",
      "items": [
        {
          "description": "Consultation",
          "quantity": 1,
          "unitPrice": 500,
          "total": 500,
          "category": "Consultation"
        }
      ],
      "subtotal": 500,
      "taxAmount": 25,
      "taxRate": 5,
      "discountAmount": 0,
      "totalAmount": 525,
      "amountPaid": 0,
      "balanceDue": 525,
      "paymentStatus": "Pending"
    }
  ]
}
```

---

### 2. Create Invoice
**POST** `/api/invoices`

Requires: Authentication, Role: Admin or Receptionist

**Request Body:**
```json
{
  "patientId": "507f1f77bcf86cd799439013",
  "appointmentId": "507f1f77bcf86cd799439017",
  "items": [
    {
      "description": "Consultation",
      "quantity": 1,
      "unitPrice": 500,
      "total": 500,
      "category": "Consultation"
    },
    {
      "description": "ECG Test",
      "quantity": 1,
      "unitPrice": 200,
      "total": 200,
      "category": "Test"
    }
  ],
  "taxRate": 5,
  "discountAmount": 0
}
```

**Response (201 Created):**
```json
{
  "message": "Invoice created successfully",
  "invoice": { }
}
```

---

### 3. Record Payment
**PUT** `/api/invoices/:id/payment`

Requires: Authentication, Role: Admin or Receptionist

**Request Body:**
```json
{
  "amountPaid": 250,
  "paymentMethod": "Cash",
  "paymentDate": "2024-02-22"
}
```

**Response (200 OK):**
```json
{
  "message": "Payment recorded successfully",
  "invoice": {
    ...
    "amountPaid": 250,
    "balanceDue": 275,
    "paymentStatus": "Partial"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error or missing required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Rate Limiting (Future Implementation)
- Will implement per IP address
- Currently no rate limiting enabled

## CORS
- Currently accepts requests from all origins
- Configure in production for specific domains

---

**API Version**: 1.0.0
**Last Updated**: February 2024
