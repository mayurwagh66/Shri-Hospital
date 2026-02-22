const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, unique: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  billDate: { type: Date, default: Date.now },
  dueDate: Date,
  items: [
    {
      description: String,
      quantity: Number,
      unitPrice: Number,
      total: Number,
      category: { type: String, enum: ['Consultation', 'Medication', 'Test', 'Procedure', 'Ward', 'Other'] }
    }
  ],
  subtotal: Number,
  taxAmount: Number,
  taxRate: { type: Number, default: 5 },
  discountAmount: { type: Number, default: 0 },
  totalAmount: Number,
  amountPaid: { type: Number, default: 0 },
  balanceDue: Number,
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Partial', 'Paid', 'Overdue'],
    default: 'Pending'
  },
  paymentMethod: String,
  paymentDate: Date,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

invoiceSchema.pre('save', async function(next) {
  if (!this.invoiceId) {
    const count = await this.constructor.countDocuments();
    this.invoiceId = 'INV' + String(count + 1).padStart(6, '0');
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
