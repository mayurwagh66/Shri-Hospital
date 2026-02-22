const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Department = require('../models/Department');

const getAllDoctors = async (req, res) => {
  try {
    const { department, page = 1, limit = 10 } = req.query;
    let query = { isAvailable: true };

    if (department) query.department = department;

    const doctors = await Doctor.find(query)
      .populate('userId', 'firstName lastName email phone')
      .populate('department', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Doctor.countDocuments(query);

    res.json({
      doctors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId')
      .populate('department');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDoctor = async (req, res) => {
  try {
    const { userId, licenseNumber, specialization, departmentId, qualification, experience, consultationFee } = req.body;

    const user = await User.findById(userId);
    if (!user || user.role !== 'Doctor') {
      return res.status(404).json({ message: 'Doctor user not found' });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const doctor = new Doctor({
      userId,
      licenseNumber,
      specialization,
      department: departmentId,
      qualification,
      experience,
      consultationFee
    });

    await doctor.save();

    await Department.findByIdAndUpdate(departmentId, {
      $inc: { totalDoctors: 1 }
    });

    res.status(201).json({ message: 'Doctor created successfully', doctor });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateDoctorAvailability = async (req, res) => {
  try {
    const { availableSlots } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        availableSlots,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor availability updated successfully', doctor });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateDoctorStatus = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        isAvailable,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor status updated successfully', doctor });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctorAvailability,
  updateDoctorStatus
};
