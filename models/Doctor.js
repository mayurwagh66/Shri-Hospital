const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  licenseNumber: { type: String, required: true, unique: true },
  specialization: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  qualification: [String],
  experience: { type: Number, default: 0 },
  consultationFee: { type: Number, default: 0 },
  availableSlots: {
    monday: [String],
    tuesday: [String],
    wednesday: [String],
    thursday: [String],
    friday: [String],
    saturday: [String],
    sunday: [String]
  },
  isAvailable: { type: Boolean, default: true },
  totalAppointments: { type: Number, default: 0 },
  totalPatients: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Doctor', doctorSchema);
