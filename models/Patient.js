const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  email: String,
  phone: { type: String, required: true },
  address: String,
  city: String,
  state: String,
  zipCode: String,
  bloodType: String,
  emergencyContactName: String,
  emergencyContactPhone: String,
  allergies: [String],
  chronicDiseases: [String],
  currentMedications: [String],
  insuranceProvider: String,
  insurancePolicyNumber: String,
  registrationDate: { type: Date, default: Date.now },
  lastVisit: Date,
  totalVisits: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

patientSchema.pre('save', async function(next) {
  if (!this.patientId) {
    const count = await this.constructor.countDocuments();
    this.patientId = 'PAT' + String(count + 1).padStart(6, '0');
  }
  next();
});

module.exports = mongoose.model('Patient', patientSchema);
