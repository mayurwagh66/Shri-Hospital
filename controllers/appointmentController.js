const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const getAllAppointments = async (req, res) => {
  try {
    const { status, doctorId, patientId, page = 1, limit = 10 } = req.query;
    let query = {};

    if (status) query.status = status;
    if (doctorId) query.doctor = doctorId;
    if (patientId) query.patient = patientId;

    const appointments = await Appointment.find(query)
      .populate('patient', 'firstName lastName patientId')
      .populate('doctor', 'userId')
      .populate('department')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ appointmentDate: -1 });

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('doctor')
      .populate('department');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, timeSlot, reason } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      department: doctor.department,
      appointmentDate,
      timeSlot,
      reason,
      consultationFee: doctor.consultationFee
    });

    await appointment.save();
    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const update = {
      status,
      updatedAt: Date.now(),
      ...(status === 'Completed' && { completedAt: Date.now() }),
      ...(status === 'Cancelled' && { cancelledAt: Date.now() }),
      ...(notes !== undefined && notes !== null && notes !== '' && { notes })
    };

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (status === 'Completed') {
      await Patient.findByIdAndUpdate(
        appointment.patient,
        { 
          $inc: { totalVisits: 1 },
          lastVisit: Date.now()
        }
      );

      await Doctor.findByIdAndUpdate(
        appointment.doctor,
        { 
          $inc: { totalAppointments: 1 }
        }
      );
    }

    res.json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentDate, timeSlot } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { 
        appointmentDate,
        timeSlot,
        status: 'Rescheduled',
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment rescheduled successfully', appointment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Cancelled',
        cancellationReason,
        cancelledAt: Date.now(),
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  bookAppointment,
  updateAppointmentStatus,
  rescheduleAppointment,
  cancelAppointment
};
