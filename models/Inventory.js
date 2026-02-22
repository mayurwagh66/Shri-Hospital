const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemId: { type: String, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  unit: String,
  quantity: { type: Number, required: true },
  minimumLevel: Number,
  maximumLevel: Number,
  unitPrice: Number,
  supplier: String,
  lastRestockDate: Date,
  expiryDate: Date,
  location: String,
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

inventorySchema.pre('save', async function(next) {
  if (!this.itemId) {
    const count = await this.constructor.countDocuments();
    this.itemId = 'INV' + String(count + 1).padStart(6, '0');
  }
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
