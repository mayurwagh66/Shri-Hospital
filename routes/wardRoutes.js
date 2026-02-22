const express = require('express');
const router = express.Router();
const wardController = require('../controllers/wardController');
const { authenticateToken, authorize } = require('../middleware/auth');

router.get('/', authenticateToken, wardController.getAllWards);
router.get('/:id', authenticateToken, wardController.getWardById);
router.post('/', authenticateToken, authorize('Admin'), wardController.createWard);
router.put('/:id', authenticateToken, authorize('Admin'), wardController.updateWard);

module.exports = router;
