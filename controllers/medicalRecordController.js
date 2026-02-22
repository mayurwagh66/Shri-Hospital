const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');

const getPatientRecords = async (req, res) => {
  try {
    const { patientId, page = 1, limit = 10 } = req.query;
    const query = patientId ? { patient: patientId } : {};

    const records = await MedicalRecord.find(query)
      .populate('patient', 'firstName lastName patientId')
      .populate('doctor', 'userId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ visitDate: -1 });

    const total = await MedicalRecord.countDocuments(query);

    res.json({
      records,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient')
      .populate('doctor')
      .populate('appointment');
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMedicalRecord = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentId, diagnosis, symptoms, vitals, prescription, labTests, notes, followUpDate } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const record = new MedicalRecord({
      patient: patientId,
      doctor: doctorId,
      appointment: appointmentId,
      diagnosis,
      symptoms,
      vitals,
      prescription,
      labTests,
      notes,
      followUpDate
    });

    await record.save();
    res.status(201).json({ message: 'Medical record created successfully', record });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ message: 'Medical record updated successfully', record });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getPatientRecords,
  getRecordById,
  createMedicalRecord,
  updateMedicalRecord
};
