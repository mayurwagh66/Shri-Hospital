const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  wardId: { type: String, unique: true },
  name: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  totalBeds: { type: Number, required: true },
  availableBeds: { type: Number, required: true },
  wardType: { type: String, enum: ['ICU', 'General', 'Private', 'Pediatric', 'Cardiac', 'Other'] },
  staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
  facilities: [String],
  costPerDay: Number,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

wardSchema.pre('save', async function(next) {
  if (!this.wardId) {
    const count = await this.constructor.countDocuments();
    this.wardId = 'WRD' + String(count + 1).padStart(4, '0');
  }
  next();
});

module.exports = mongoose.model('Ward', wardSchema);
