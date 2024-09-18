const request = require('supertest');
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const app = require('../app.js'); // Adjust the path to your main app file
const Inventory = require('../models/Inventory.js');
const InventoryRequest = require('../models/Request.js'); // Adjust based on your structure

describe('Request Inventory API', () => {
    let token;
    let itemId;

    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Create user and log in
        await request(app)
            .post('/api/auth/register')
            .send({ username: 'storeManager', password: 'managerPassword', role: 'manager' });

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({ username: 'storeManager', password: 'managerPassword' });
        token = loginResponse.body.token;

        // Create an inventory item
        const itemResponse = await request(app)
            .post('/api/inventory')
            .set('Authorization', `Bearer ${token}`)
            .send({
                itemName: 'Sample Item',
                description: 'Sample description',
                quantity: 50,
                price: 20,
                category: 'Test'
            });
        itemId = itemResponse.body._id; // Store the item ID for later use
    });

    after(async () => {
        await Inventory.deleteMany({});
        await InventoryRequest.deleteMany({});
        await mongoose.connection.close();
    });

    it('should request inventory', async () => {
        const response = await request(app)
            .post('/api/requests')
            .set('Authorization', `Bearer ${token}`)
            .send({
                item: itemId,
                quantity: 5
            });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('status', 'pending');
    });

    it('should get all requests', async () => {
        const response = await request(app)
            .get('/api/requests')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });
});

