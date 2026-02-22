const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { authenticateToken, authorize } = require('../middleware/auth');

router.get('/', authenticateToken, inventoryController.getAllInventory);
router.get('/:id', authenticateToken, inventoryController.getItemById);
router.get('/low-stock', authenticateToken, authorize('Admin'), inventoryController.getLowStockItems);
router.post('/', authenticateToken, authorize('Admin'), inventoryController.createInventoryItem);
router.put('/:id/quantity', authenticateToken, authorize('Admin', 'Staff'), inventoryController.updateInventoryQuantity);

module.exports = router;
