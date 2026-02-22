const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  headOfDepartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  totalDoctors: { type: Number, default: 0 },
  totalStaff: { type: Number, default: 0 },
  contactNumber: String,
  location: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Department', departmentSchema);
