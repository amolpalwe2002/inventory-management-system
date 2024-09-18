const request = require('supertest');
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const app = require('../src/app.js'); // Adjust the path to your main app file
const Inventory = require('../src/models/Inventory.js'); // Adjust the path based on your project structure

describe('Inventory API', () => {
    let token;

    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Create a user and log in to get a token
        await request(app)
            .post('/api/auth/register')
            .send({ username: 'adminUser', password: 'adminPassword', role: 'admin' });
        
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({ username: 'adminUser', password: 'adminPassword' });
        token = loginResponse.body.token;
    });

    after(async () => {
        await Inventory.deleteMany({});
        await mongoose.connection.close();
    });

    it('should add an inventory item', async () => {
        const response = await request(app)
            .post('/api/inventory')
            .set('Authorization', `Bearer ${token}`)
            .send({
                itemName: 'Test Item',
                description: 'This is a test item',
                quantity: 10,
                price: 100,
                category: 'Test'
            });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('itemName', 'Test Item');
    });

    it('should get all inventory items', async () => {
        const response = await request(app)
            .get('/api/inventory')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });
});
