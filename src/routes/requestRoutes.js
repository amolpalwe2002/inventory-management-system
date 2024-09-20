const express = require('express');
const { requestInventory, approveRequest, getRequests } = require('../controllers/requestController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(['store-manager']), requestInventory);
router.patch('/:id', auth(['admin']), approveRequest);
router.get('/', auth(['admin']), getRequests);

module.exports = router;
