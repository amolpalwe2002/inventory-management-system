const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Adjust the path to your main app file
const Inventory = require('../models/Inventory'); // Adjust the path based on your project structure

describe('Inventory API', () => {
    let token; // Variable to hold the JWT token

    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI);

        // Assuming you have a login endpoint to get a token
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'adminUser', // Use a valid admin username
                password: 'adminPassword' // Use the corresponding password
            });
        token = loginResponse.body.token; // Capture the JWT token from the login response
    });

    after(async () => {
        await Inventory.deleteMany({}); // Clean up inventory collection after tests
        await mongoose.connection.close(); // Close MongoDB connection
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
                category: 'Test',
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

    it('should update an inventory item', async () => {
        const newItem = await Inventory.create({
            itemName: 'Item to Update',
            description: 'Item description',
            quantity: 20,
            price: 50,
            category: 'Test',
        });

        const response = await request(app)
            .put(`/api/inventory/${newItem._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 30 });
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('quantity', 30);
    });

    it('should delete an inventory item', async () => {
        const newItem = await Inventory.create({
            itemName: 'Item to Delete',
            description: 'Item description',
            quantity: 15,
            price: 75,
            category: 'Test',
        });

        const response = await request(app)
            .delete(`/api/inventory/${newItem._id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).to.equal(204); // No content response for successful deletion
    });

    it('should return 404 for a non-existing inventory item', async () => {
        const response = await request(app)
            .get('/api/inventory/nonExistingId')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).to.equal(404);
    });
});
