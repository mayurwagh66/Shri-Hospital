const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { authenticateToken, authorize } = require('../middleware/auth');

router.get('/', authenticateToken, departmentController.getAllDepartments);
router.get('/:id', authenticateToken, departmentController.getDepartmentById);
router.post('/', authenticateToken, authorize('Admin'), departmentController.createDepartment);
router.put('/:id', authenticateToken, authorize('Admin'), departmentController.updateDepartment);

module.exports = router;
