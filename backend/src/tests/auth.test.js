process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key_for_testing_123456';
const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../../server');
const User = require('../models/user.model');

describe('Authentication API Tests', () => {
  beforeAll(async () => {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bus-booking-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
    }
    // Clean up users for test
    await User.deleteMany({ email: { $in: ['testuser@demo.com', 'newcustomer@demo.com'] } });
  });

  afterAll(async () => {
    await User.deleteMany({ email: { $in: ['testuser@demo.com', 'newcustomer@demo.com'] } });
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  describe('POST /api/auth/register', () => {
    it('should successfully register a new customer', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New Customer',
          email: 'newcustomer@demo.com',
          password: 'Password@123',
          phone: '+919999999999',
          role: 'customer'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', 'newcustomer@demo.com');
      expect(res.body.data.user).not.toHaveProperty('password');
    });

    it('should fail registration with an already registered email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate Customer',
          email: 'newcustomer@demo.com',
          password: 'Password@123'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail registration with invalid email or short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Invalid User',
          email: 'not-an-email',
          password: '123'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      await User.create({
        name: 'Login Test User',
        email: 'testuser@demo.com',
        password: 'ValidPassword@123',
        role: 'customer'
      });
    });

    it('should successfully login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@demo.com',
          password: 'ValidPassword@123'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe('testuser@demo.com');
    });

    it('should fail login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@demo.com',
          password: 'WrongPassword@123'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid/i);
    });

    it('should fail login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@demo.com',
          password: 'ValidPassword@123'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let validToken;

    beforeAll(async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@demo.com',
          password: 'ValidPassword@123'
        });
      validToken = loginRes.body.data.token;
    });

    it('should fail accessing protected route without token', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should successfully get profile when provided valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('testuser@demo.com');
    });
  });
});
