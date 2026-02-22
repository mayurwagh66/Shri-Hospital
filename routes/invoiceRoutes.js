const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { authenticateToken, authorize } = require('../middleware/auth');

router.get('/', authenticateToken, authorize('Admin', 'Receptionist'), invoiceController.getAllInvoices);
router.get('/:id', authenticateToken, invoiceController.getInvoiceById);
router.post('/', authenticateToken, authorize('Admin', 'Receptionist'), invoiceController.createInvoice);
router.put('/:id/payment', authenticateToken, authorize('Admin', 'Receptionist'), invoiceController.updatePayment);

module.exports = router;
