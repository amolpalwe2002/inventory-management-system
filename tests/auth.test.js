import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../src/app.js'; // Adjust the path to your main app file
import User from '../src/models/User.js'; // Adjust the path based on your project structure

describe('Authentication API', () => {
    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testUser',
                password: 'testPassword',
                role: 'admin'
            });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('username', 'testUser');
    });

    it('should log in the user and return a token', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'testUser',
                password: 'testPassword'
            });
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token');
    });
});
