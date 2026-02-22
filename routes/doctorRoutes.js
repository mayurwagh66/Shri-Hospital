const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken, authorize } = require('../middleware/auth');

router.get('/', authenticateToken, doctorController.getAllDoctors);
router.get('/:id', authenticateToken, doctorController.getDoctorById);
router.post('/', authenticateToken, authorize('Admin'), doctorController.createDoctor);
router.put('/:id/availability', authenticateToken, authorize('Admin', 'Doctor'), doctorController.updateDoctorAvailability);
router.put('/:id/status', authenticateToken, authorize('Admin'), doctorController.updateDoctorStatus);

module.exports = router;
