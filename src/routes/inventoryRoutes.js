const express = require('express');
const { addInventoryItem, updateInventoryItem, deleteInventoryItem, getInventoryItems } = require('../controllers/inventoryController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(['admin']), addInventoryItem);
router.put('/:id', auth(['admin']), updateInventoryItem);
router.delete('/:id', auth(['admin']), deleteInventoryItem);
router.get('/', auth(['admin', 'store-manager']), getInventoryItems);

module.exports = router;
