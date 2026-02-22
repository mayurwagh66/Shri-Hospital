const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  appointmentId: { type: String, unique: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  appointmentDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: {
    type: String,
    enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled'],
    default: 'Scheduled'
  },
  reason: String,
  notes: String,
  consultationFee: Number,
  bookedAt: { type: Date, default: Date.now },
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

appointmentSchema.pre('save', async function(next) {
  if (!this.appointmentId) {
    const count = await this.constructor.countDocuments();
    this.appointmentId = 'APT' + String(count + 1).padStart(6, '0');
  }
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
