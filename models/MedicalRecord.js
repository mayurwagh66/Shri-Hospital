const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  recordId: { type: String, unique: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  visitDate: { type: Date, default: Date.now },
  diagnosis: String,
  symptoms: [String],
  vitals: {
    bloodPressure: String,
    temperature: Number,
    heartRate: Number,
    respiratoryRate: Number,
    weight: Number,
    height: Number
  },
  prescription: [
    {
      medicineId: mongoose.Schema.Types.ObjectId,
      medicineName: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }
  ],
  labTests: [
    {
      testName: String,
      result: String,
      normalRange: String,
      status: String
    }
  ],
  notes: String,
  attachments: [String],
  followUpDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

medicalRecordSchema.pre('save', async function(next) {
  if (!this.recordId) {
    const count = await this.constructor.countDocuments();
    this.recordId = 'REC' + String(count + 1).padStart(6, '0');
  }
  next();
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
