const Department = require('../models/Department');

const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true })
      .populate('headOfDepartment', 'firstName lastName');

    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('headOfDepartment');
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name, description, contactNumber, location } = req.body;

    const department = new Department({
      name,
      description,
      contactNumber,
      location
    });

    await department.save();
    res.status(201).json({ message: 'Department created successfully', department });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ message: 'Department updated successfully', department });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment
};
