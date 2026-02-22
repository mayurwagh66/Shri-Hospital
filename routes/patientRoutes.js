const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken, authorize } = require('../middleware/auth');

router.get('/', authenticateToken, patientController.getAllPatients);
router.get('/:id', authenticateToken, patientController.getPatientById);
router.post('/', authenticateToken, authorize('Admin', 'Receptionist'), patientController.createPatient);
router.put('/:id', authenticateToken, authorize('Admin', 'Doctor'), patientController.updatePatient);
router.delete('/:id', authenticateToken, authorize('Admin'), patientController.deletePatient);

module.exports = router;
