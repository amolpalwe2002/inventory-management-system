const Request = require('../models/Request');

exports.requestInventory = async (req, res) => {
    try {
        const request = new Request({ ...req.body, manager: req.user.username });
        await request.save();
        res.status(201).json(request);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.approveRequest = async (req, res) => {
    try {
        const request = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!request) return res.status(404).json({ message: 'Request not found' });
        res.json(request);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getRequests = async (req, res) => {
    try {
        const requests = await Request.find();
        res.json(requests);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
