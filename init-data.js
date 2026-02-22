const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Patient = require('./models/Patient');
const Department = require('./models/Department');
const Doctor = require('./models/Doctor');

async function initializeData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Department.deleteMany({});
    await Doctor.deleteMany({});

    // Create Admin User
    const admin = new User({
      username: 'admin',
      email: 'admin@hospital.com',
      password: 'password123',
      firstName: 'Admin',
      lastName: 'User',
      phone: '9876543210',
      role: 'Admin',
      isActive: true
    });
    await admin.save();
    console.log('Admin user created');

    // Create Doctor User
    const doctorUser = new User({
      username: 'doctor',
      email: 'doctor@hospital.com',
      password: 'password123',
      firstName: 'Dr. Rajesh',
      lastName: 'Kumar',
      phone: '9876543211',
      role: 'Doctor',
      isActive: true
    });
    await doctorUser.save();
    console.log('Doctor user created');

    // Create Receptionist User
    const receptionist = new User({
      username: 'receptionist',
      email: 'receptionist@hospital.com',
      password: 'password123',
      firstName: 'Priya',
      lastName: 'Sharma',
      phone: '9876543212',
      role: 'Receptionist',
      isActive: true
    });
    await receptionist.save();
    console.log('Receptionist user created');

    // Create Staff User
    const staff = new User({
      username: 'staff',
      email: 'staff@hospital.com',
      password: 'password123',
      firstName: 'Amit',
      lastName: 'Singh',
      phone: '9876543213',
      role: 'Staff',
      isActive: true
    });
    await staff.save();
    console.log('Staff user created');

    // Create Departments
    const departments = [
      {
        name: 'General Medicine',
        description: 'General medical treatment and diagnosis',
        contactNumber: '0120-1234567',
        location: 'Block A, Floor 2'
      },
      {
        name: 'Cardiology',
        description: 'Heart and cardiovascular care',
        contactNumber: '0120-1234568',
        location: 'Block B, Floor 3'
      },
      {
        name: 'Surgery',
        description: 'Surgical procedures and operations',
        contactNumber: '0120-1234569',
        location: 'Block C, Floor 4'
      },
      {
        name: 'Emergency Medicine',
        description: 'Emergency and trauma care',
        contactNumber: '0120-1234570',
        location: 'Block A, Ground Floor'
      },
      {
        name: 'Pediatrics',
        description: 'Children and infant care',
        contactNumber: '0120-1234571',
        location: 'Block D, Floor 2'
      }
    ];

    const createdDepartments = await Department.insertMany(departments);
    console.log('Departments created');

    // Create Doctor Profile
    const doctor = new Doctor({
      userId: doctorUser._id,
      licenseNumber: 'MCI2024001',
      specialization: 'Cardiology',
      department: createdDepartments[1]._id,
      qualification: ['MBBS', 'MD Cardiology'],
      experience: 10,
      consultationFee: 500,
      availableSlots: {
        monday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
        tuesday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
        wednesday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
        thursday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
        friday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
        saturday: ['10:00', '11:00'],
        sunday: []
      },
      isAvailable: true
    });
    await doctor.save();
    console.log('Doctor profile created');

    // Create Sample Patients
    const patients = [
      {
        firstName: 'Ramesh',
        lastName: 'Patel',
        dateOfBirth: new Date('1975-05-15'),
        gender: 'Male',
        email: 'ramesh@email.com',
        phone: '9876543214',
        address: '123 Main Street',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001',
        bloodType: 'O+',
        emergencyContactName: 'Priya Patel',
        emergencyContactPhone: '9876543215',
        allergies: ['Penicillin'],
        chronicDiseases: ['Diabetes', 'Hypertension'],
        isActive: true
      },
      {
        firstName: 'Arun',
        lastName: 'Verma',
        dateOfBirth: new Date('1980-10-22'),
        gender: 'Male',
        email: 'arun@email.com',
        phone: '9876543216',
        address: '456 Park Avenue',
        city: 'Gurgaon',
        state: 'Haryana',
        zipCode: '122001',
        bloodType: 'A+',
        emergencyContactName: 'Deepa Verma',
        emergencyContactPhone: '9876543217',
        allergies: [],
        chronicDiseases: [],
        isActive: true
      },
      {
        firstName: 'Meera',
        lastName: 'Gupta',
        dateOfBirth: new Date('1988-03-18'),
        gender: 'Female',
        email: 'meera@email.com',
        phone: '9876543218',
        address: '789 Garden Lane',
        city: 'Noida',
        state: 'Uttar Pradesh',
        zipCode: '201301',
        bloodType: 'B+',
        emergencyContactName: 'Ravi Gupta',
        emergencyContactPhone: '9876543219',
        allergies: ['Aspirin'],
        chronicDiseases: ['Asthma'],
        isActive: true
      }
    ];

    await Patient.insertMany(patients);
    console.log('Sample patients created');

    console.log('\n✅ Database initialization completed successfully!');
    console.log('\nDemo Credentials:');
    console.log('Admin: admin@hospital.com / password123');
    console.log('Doctor: doctor@hospital.com / password123');
    console.log('Receptionist: receptionist@hospital.com / password123');
    console.log('Staff: staff@hospital.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error initializing data:', error);
    process.exit(1);
  }
}

initializeData();
