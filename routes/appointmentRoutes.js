const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, authorize } = require('../middleware/auth');

router.get('/', authenticateToken, appointmentController.getAllAppointments);
router.get('/:id', authenticateToken, appointmentController.getAppointmentById);
router.post('/', authenticateToken, authorize('Admin', 'Receptionist', 'Patient'), appointmentController.bookAppointment);
router.put('/:id/status', authenticateToken, authorize('Admin', 'Doctor'), appointmentController.updateAppointmentStatus);
router.put('/:id/reschedule', authenticateToken, authorize('Receptionist'), appointmentController.rescheduleAppointment);
router.put('/:id/cancel', authenticateToken, appointmentController.cancelAppointment);

module.exports = router;
