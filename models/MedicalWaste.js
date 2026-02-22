const mongoose = require('mongoose');

const medicalWasteSchema = new mongoose.Schema({
  wasteId: { type: String, unique: true },
  category: {
    type: String,
    enum: ['Infectious', 'Sharps', 'Chemical', 'General', 'Pathological', 'Pharmaceutical'],
    required: true
  },
  date: { type: Date, default: Date.now },
  departmentSource: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  wardSource: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward' },
  quantity: { type: Number, required: true },
  unit: { type: String, enum: ['kg', 'liters', 'units'], default: 'kg' },
  description: String,
  hazardLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  disposalMethod: String,
  disposalDate: Date,
  disposalVendor: String,
  certificateNumber: String,
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  disposedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['Collected', 'Stored', 'Processed', 'Disposed'],
    default: 'Collected'
  },
  complianceStatus: {
    type: String,
    enum: ['Compliant', 'Minor Issue', 'Major Issue'],
    default: 'Compliant'
  },
  notes: String,
  attachments: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

medicalWasteSchema.pre('save', async function(next) {
  if (!this.wasteId) {
    const count = await this.constructor.countDocuments();
    this.wasteId = 'WAS' + String(count + 1).padStart(6, '0');
  }
  next();
});

module.exports = mongoose.model('MedicalWaste', medicalWasteSchema);
