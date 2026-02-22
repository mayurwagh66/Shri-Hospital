const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const { authenticateToken, authorize } = require('../middleware/auth');

router.get('/', authenticateToken, medicalRecordController.getPatientRecords);
router.get('/:id', authenticateToken, medicalRecordController.getRecordById);
router.post('/', authenticateToken, authorize('Admin', 'Doctor'), medicalRecordController.createMedicalRecord);
router.put('/:id', authenticateToken, authorize('Admin', 'Doctor'), medicalRecordController.updateMedicalRecord);

module.exports = router;
