const Inventory = require('../models/Inventory');

const getAllInventory = async (req, res) => {
  try {
    const { category, department, search, page = 1, limit = 10 } = req.query;
    let query = { isActive: true };

    if (category) query.category = category;
    if (department) query.department = department;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { itemId: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Inventory.find(query)
      .populate('department', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const total = await Inventory.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createInventoryItem = async (req, res) => {
  try {
    const { name, category, unit, quantity, minimumLevel, maximumLevel, unitPrice, supplier, expiryDate, location, departmentId } = req.body;

    const item = new Inventory({
      name,
      category,
      unit,
      quantity,
      minimumLevel,
      maximumLevel,
      unitPrice,
      supplier,
      expiryDate,
      location,
      department: departmentId,
      lastRestockDate: Date.now()
    });

    await item.save();
    res.status(201).json({ message: 'Inventory item created successfully', item });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateInventoryQuantity = async (req, res) => {
  try {
    const { quantity, action } = req.body; // action: 'add' or 'remove'

    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    let newQuantity = item.quantity;
    if (action === 'add') {
      newQuantity += quantity;
    } else if (action === 'remove') {
      newQuantity -= quantity;
      if (newQuantity < 0) {
        return res.status(400).json({ message: 'Insufficient quantity' });
      }
    }

    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        quantity: newQuantity,
        lastRestockDate: action === 'add' ? Date.now() : item.lastRestockDate,
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.json({ message: 'Inventory updated successfully', item: updatedItem });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getLowStockItems = async (req, res) => {
  try {
    const items = await Inventory.find({
      $expr: { $lte: ['$quantity', '$minimumLevel'] },
      isActive: true
    }).populate('department', 'name');

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllInventory,
  getItemById,
  createInventoryItem,
  updateInventoryQuantity,
  getLowStockItems
};
