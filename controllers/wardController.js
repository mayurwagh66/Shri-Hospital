const Ward = require('../models/Ward');
const Department = require('../models/Department');

const getAllWards = async (req, res) => {
  try {
    const { department, page = 1, limit = 10 } = req.query;
    let query = { isActive: true };

    if (department) query.department = department;

    const wards = await Ward.find(query)
      .populate('department', 'name')
      .populate('patients', 'firstName lastName patientId')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Ward.countDocuments(query);

    res.json({
      wards,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWardById = async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id)
      .populate('department')
      .populate('patients')
      .populate('staff', 'firstName lastName');

    if (!ward) {
      return res.status(404).json({ message: 'Ward not found' });
    }
    res.json(ward);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createWard = async (req, res) => {
  try {
    const { name, departmentId, totalBeds, wardType, facilities, costPerDay } = req.body;

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const ward = new Ward({
      name,
      department: departmentId,
      totalBeds,
      availableBeds: totalBeds,
      wardType,
      facilities,
      costPerDay
    });

    await ward.save();
    res.status(201).json({ message: 'Ward created successfully', ward });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateWard = async (req, res) => {
  try {
    const ward = await Ward.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!ward) {
      return res.status(404).json({ message: 'Ward not found' });
    }
    res.json({ message: 'Ward updated successfully', ward });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllWards,
  getWardById,
  createWard,
  updateWard
};
