const express = require('express');
const router = express.Router();
const medicalWasteController = require('../controllers/medicalWasteController');
const { authenticateToken, authorize } = require('../middleware/auth');

router.get('/', authenticateToken, medicalWasteController.getAllWaste);
router.get('/:id', authenticateToken, medicalWasteController.getWasteById);
router.get('/report/generate', authenticateToken, authorize('Admin'), medicalWasteController.getWasteReport);
router.post('/', authenticateToken, authorize('Admin', 'Staff'), medicalWasteController.createWasteEntry);
router.put('/:id/status', authenticateToken, authorize('Staff', 'Admin'), medicalWasteController.updateWasteStatus);

module.exports = router;
