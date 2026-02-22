const MedicalWaste = require('../models/MedicalWaste');
const Department = require('../models/Department');

const getAllWaste = async (req, res) => {
  try {
    const { category, status, startDate, endDate, page = 1, limit = 10 } = req.query;
    let query = {};

    if (category) query.category = category;
    if (status) query.status = status;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const waste = await MedicalWaste.find(query)
      .populate('departmentSource', 'name')
      .populate('wardSource', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 });

    const total = await MedicalWaste.countDocuments(query);

    res.json({
      waste,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWasteById = async (req, res) => {
  try {
    const waste = await MedicalWaste.findById(req.params.id)
      .populate('departmentSource')
      .populate('wardSource')
      .populate('collectedBy')
      .populate('disposedBy');
    if (!waste) {
      return res.status(404).json({ message: 'Waste record not found' });
    }
    res.json(waste);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createWasteEntry = async (req, res) => {
  try {
    const { category, departmentId, wardId, quantity, unit, description, hazardLevel, status } = req.body;

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const waste = new MedicalWaste({
      category,
      departmentSource: departmentId,
      wardSource: wardId,
      quantity,
      unit,
      description,
      hazardLevel,
      collectedBy: req.user.id,
      status: status || 'Collected'
    });

    await waste.save();
    res.status(201).json({ message: 'Waste entry created successfully', waste });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateWasteStatus = async (req, res) => {
  try {
    const { status, disposalMethod, disposalDate, disposalVendor, certificateNumber, notes } = req.body;

    const waste = await MedicalWaste.findByIdAndUpdate(
      req.params.id,
      {
        status,
        disposalMethod: disposalMethod || undefined,
        disposalDate: disposalDate || undefined,
        disposalVendor: disposalVendor || undefined,
        certificateNumber: certificateNumber || undefined,
        notes,
        disposedBy: status === 'Disposed' ? req.user.id : undefined,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!waste) {
      return res.status(404).json({ message: 'Waste record not found' });
    }

    res.json({ message: 'Waste status updated successfully', waste });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getWasteReport = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    let query = {};

    if (category) query.category = category;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const waste = await MedicalWaste.find(query)
      .populate('departmentSource', 'name')
      .populate('wardSource', 'name');

    const report = {
      totalQuantity: waste.reduce((sum, w) => sum + w.quantity, 0),
      byCategory: {},
      byDepartment: {},
      byStatus: {},
      complianceStatus: {}
    };

    waste.forEach(w => {
      report.byCategory[w.category] = (report.byCategory[w.category] || 0) + w.quantity;
      report.byDepartment[w.departmentSource?.name || 'Unknown'] = (report.byDepartment[w.departmentSource?.name || 'Unknown'] || 0) + w.quantity;
      report.byStatus[w.status] = (report.byStatus[w.status] || 0) + 1;
      report.complianceStatus[w.complianceStatus] = (report.complianceStatus[w.complianceStatus] || 0) + 1;
    });

    res.json({ report, waste });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllWaste,
  getWasteById,
  createWasteEntry,
  updateWasteStatus,
  getWasteReport
};
