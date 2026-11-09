process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key_for_testing_123456';
const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../../server');
const User = require('../models/user.model');
const Bus = require('../models/bus.model');
const Stop = require('../models/stop.model');
const Route = require('../models/route.model');
const Trip = require('../models/trip.model');
const Booking = require('../models/booking.model');
const SeatAllocation = require('../models/seatAllocation.model');
const jwt = require('jsonwebtoken');

describe('Booking & Authorization API Tests', () => {
  let customerUser, adminUser, operator1User, operator2User;
  let customerToken, adminToken, operator1Token, operator2Token;
  let testStop1, testStop2;
  let testRoute, testBus, testTrip;

  beforeAll(async () => {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bus-booking-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
    }

    // Clean up test data
    await Promise.all([
      User.deleteMany({ email: { $in: ['btest_cust@demo.com', 'btest_admin@demo.com', 'btest_op1@demo.com', 'btest_op2@demo.com'] } }),
      Stop.deleteMany({ name: { $in: ['Test Stop A', 'Test Stop B'] } }),
      Bus.deleteMany({ busNumber: 'TEST-BUS-01' })
    ]);

    // Create test users
    [customerUser, adminUser, operator1User, operator2User] = await Promise.all([
      User.create({
        name: 'Booking Customer',
        email: 'btest_cust@demo.com',
        password: 'Password@123',
        role: 'customer'
      }),
      User.create({
        name: 'Booking Admin',
        email: 'btest_admin@demo.com',
        password: 'Password@123',
        role: 'admin'
      }),
      User.create({
        name: 'Booking Operator 1',
        email: 'btest_op1@demo.com',
        password: 'Password@123',
        role: 'operator'
      }),
      User.create({
        name: 'Booking Operator 2',
        email: 'btest_op2@demo.com',
        password: 'Password@123',
        role: 'operator'
      })
    ]);

    customerToken = jwt.sign({ id: customerUser._id }, process.env.JWT_SECRET);
    adminToken = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET);
    operator1Token = jwt.sign({ id: operator1User._id }, process.env.JWT_SECRET);
    operator2Token = jwt.sign({ id: operator2User._id }, process.env.JWT_SECRET);

    // Create test stops
    [testStop1, testStop2] = await Promise.all([
      Stop.create({ name: 'Test Stop A', city: 'Test City A', state: 'State A' }),
      Stop.create({ name: 'Test Stop B', city: 'Test City B', state: 'State B' })
    ]);

    // Create test route
    testRoute = await Route.create({
      name: 'Test Route A to B',
      source: testStop1._id,
      destination: testStop2._id,
      totalDistance: 200,
      estimatedDuration: 180
    });

    // Create test bus
    testBus = await Bus.create({
      busNumber: 'TEST-BUS-01',
      name: 'Test Express Bus',
      type: 'AC Seater',
      totalSeats: 20,
      seatLayout: {
        rows: 5,
        seatsPerRow: 4,
        layout: [
          [
            { seatNumber: '1A', type: 'window', deck: 'lower' },
            { seatNumber: '1B', type: 'aisle', deck: 'lower' },
            { seatNumber: '1C', type: 'aisle', deck: 'lower' },
            { seatNumber: '1D', type: 'window', deck: 'lower' }
          ]
        ]
      },
      operator: operator1User._id
    });

    // Create test trip
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    tomorrow.setHours(10, 0, 0, 0);

    testTrip = await Trip.create({
      bus: testBus._id,
      route: testRoute._id,
      operator: operator1User._id,
      travelDate: tomorrow,
      departureTime: '10:00',
      arrivalTime: '13:00',
      fare: 500,
      boardingPoints: [{ stop: testStop1._id, time: '09:30' }],
      droppingPoints: [{ stop: testStop2._id, time: '13:00' }],
      status: 'scheduled',
      availableSeats: 20
    });
  });

  afterAll(async () => {
    if (testTrip) {
      await Booking.deleteMany({ trip: testTrip._id });
      await SeatAllocation.deleteMany({ trip: testTrip._id });
      await Trip.findByIdAndDelete(testTrip._id);
    }
    if (testBus) await Bus.findByIdAndDelete(testBus._id);
    if (testRoute) await Route.findByIdAndDelete(testRoute._id);
    if (testStop1) await Stop.findByIdAndDelete(testStop1._id);
    if (testStop2) await Stop.findByIdAndDelete(testStop2._id);
    await User.deleteMany({
      email: { $in: ['btest_cust@demo.com', 'btest_admin@demo.com', 'btest_op1@demo.com', 'btest_op2@demo.com'] }
    });

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  describe('GET /api/trips/search', () => {
    it('should find trips matching source and destination city', async () => {
      const res = await request(app)
        .get('/api/trips/search')
        .query({
          source: 'Test City A',
          destination: 'Test City B'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should return empty list when no trips match source and destination', async () => {
      const res = await request(app)
        .get('/api/trips/search')
        .query({
          source: 'NonExistentCity',
          destination: 'Nowhere'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(0);
    });
  });

  describe('Seat Booking & Double-Booking Protection', () => {
    let createdBookingId;

    it('should successfully book seats when available', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          tripId: testTrip._id.toString(),
          passengers: [
            { name: 'Alice Customer', age: 25, gender: 'female', seatNumber: '1A' }
          ]
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('pnr');
      expect(res.body.data.passengers[0].seatNumber).toBe('1A');

      createdBookingId = res.body.data._id;
    });

    it('should reject booking when seat is already taken (returns 409 Conflict)', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          tripId: testTrip._id.toString(),
          passengers: [
            { name: 'Bob Conflict', age: 30, gender: 'male', seatNumber: '1A' }
          ]
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already booked|taken/i);
    });

    it('should allow cancellation and release the seat so it can be re-booked', async () => {
      // 1. Cancel the existing booking
      const cancelRes = await request(app)
        .post(`/api/bookings/${createdBookingId}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(cancelRes.status).toBe(200);
      expect(cancelRes.body.success).toBe(true);
      expect(cancelRes.body.data.status).toBe('cancelled');

      // 2. Re-book seat 1A now that it was released
      const rebookRes = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          tripId: testTrip._id.toString(),
          passengers: [
            { name: 'Charlie New', age: 22, gender: 'male', seatNumber: '1A' }
          ]
        });

      expect(rebookRes.status).toBe(201);
      expect(rebookRes.body.success).toBe(true);
      expect(rebookRes.body.data.passengers[0].seatNumber).toBe('1A');
    });
  });

  describe('Role-Based Authorization & Restrictions', () => {
    it('should reject customer trying to access admin dashboard (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/reports/dashboard')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should allow admin to access reports dashboard', async () => {
      const res = await request(app)
        .get('/api/reports/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should reject operator accessing manifest of a trip not assigned to them (403 Forbidden)', async () => {
      // Operator 2 trying to access trip belonging to Operator 1
      const res = await request(app)
        .get(`/api/operators/trips/${testTrip._id}/manifest`)
        .set('Authorization', `Bearer ${operator2Token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should allow assigned operator to access manifest of their own trip', async () => {
      const res = await request(app)
        .get(`/api/operators/trips/${testTrip._id}/manifest`)
        .set('Authorization', `Bearer ${operator1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('manifest');
    });
  });
});
