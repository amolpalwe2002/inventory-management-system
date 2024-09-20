const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    manager: { type: String, required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
    quantity: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});

module.exports = mongoose.model('Request', RequestSchema);