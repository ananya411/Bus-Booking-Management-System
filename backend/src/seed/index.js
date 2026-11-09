require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Bus = require('../models/bus.model');
const Stop = require('../models/stop.model');
const Route = require('../models/route.model');
const Trip = require('../models/trip.model');
const Booking = require('../models/booking.model');
const SeatAllocation = require('../models/seatAllocation.model');
const AuditLog = require('../models/auditLog.model');
const { generatePNR } = require('../utils/pnr');

const generateSeatLayout = (rows = 10, seatsPerRow = 4) => {
  const layout = [];
  const colLabels = ['A', 'B', 'C', 'D'];

  for (let r = 1; r <= rows; r++) {
    const row = [];
    for (let c = 0; c < seatsPerRow; c++) {
      const seatNumber = `${r}${colLabels[c] || c + 1}`;
      let type = 'middle';
      if (c === 0 || c === seatsPerRow - 1) {
        type = 'window';
      } else {
        type = 'aisle';
      }
      row.push({
        seatNumber,
        type,
        deck: 'lower'
      });
    }
    layout.push(row);
  }

  return {
    rows,
    seatsPerRow,
    layout
  };
};

const seed = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bus-booking';
  const isForce = process.argv.includes('--force');

  console.log(`[Seed] Connecting to MongoDB: ${uri}`);
  await mongoose.connect(uri);

  if (isForce) {
    console.log('[Seed] --force flag detected. Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Bus.deleteMany({}),
      Stop.deleteMany({}),
      Route.deleteMany({}),
      Trip.deleteMany({}),
      Booking.deleteMany({}),
      SeatAllocation.deleteMany({}),
      AuditLog.deleteMany({})
    ]);
    console.log('[Seed] All collections cleared.');
  } else {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('[Seed] Database already contains data. Use --force to reset and re-seed.');
      await mongoose.disconnect();
      return;
    }
  }

  console.log('[Seed] Creating demo users...');
  const [admin, operator, customer] = await Promise.all([
    User.create({
      name: 'System Admin',
      email: 'admin@demo.com',
      password: 'Demo@123',
      role: 'admin',
      phone: '+919876543210'
    }),
    User.create({
      name: 'Fleet Operator',
      email: 'operator@demo.com',
      password: 'Demo@123',
      role: 'operator',
      phone: '+919876543211'
    }),
    User.create({
      name: 'John Doe',
      email: 'customer@demo.com',
      password: 'Demo@123',
      role: 'customer',
      phone: '+919876543212'
    })
  ]);
  console.log('[Seed] 3 Users created (admin, operator, customer).');

  console.log('[Seed] Creating stops...');
  const [delhi, mumbai, pune, bangalore, hyderabad] = await Promise.all([
    Stop.create({ name: 'Kashmere Gate ISBT', city: 'Delhi', state: 'Delhi' }),
    Stop.create({ name: 'Borivali East', city: 'Mumbai', state: 'Maharashtra' }),
    Stop.create({ name: 'Shivaji Nagar', city: 'Pune', state: 'Maharashtra' }),
    Stop.create({ name: 'Majestic Bus Terminal', city: 'Bangalore', state: 'Karnataka' }),
    Stop.create({ name: 'MGBS Hyderabad', city: 'Hyderabad', state: 'Telangana' })
  ]);
  console.log('[Seed] 5 Stops created (Delhi, Mumbai, Pune, Bangalore, Hyderabad).');

  console.log('[Seed] Creating routes...');
  const [routeDelhiMumbai, routeMumbaiPune, routeDelhiBangalore] = await Promise.all([
    Route.create({
      name: 'Delhi to Mumbai Express',
      source: delhi._id,
      destination: mumbai._id,
      stops: [
        { stop: delhi._id, arrivalOffset: 0, departureOffset: 0, distanceFromSource: 0 },
        { stop: mumbai._id, arrivalOffset: 1440, departureOffset: 1440, distanceFromSource: 1420 }
      ],
      totalDistance: 1420,
      estimatedDuration: 1440
    }),
    Route.create({
      name: 'Mumbai to Pune Highway Express',
      source: mumbai._id,
      destination: pune._id,
      stops: [
        { stop: mumbai._id, arrivalOffset: 0, departureOffset: 0, distanceFromSource: 0 },
        { stop: pune._id, arrivalOffset: 210, departureOffset: 210, distanceFromSource: 150 }
      ],
      totalDistance: 150,
      estimatedDuration: 210
    }),
    Route.create({
      name: 'Delhi to Bangalore Grand Route',
      source: delhi._id,
      destination: bangalore._id,
      stops: [
        { stop: delhi._id, arrivalOffset: 0, departureOffset: 0, distanceFromSource: 0 },
        { stop: hyderabad._id, arrivalOffset: 1500, departureOffset: 1530, distanceFromSource: 1550 },
        { stop: bangalore._id, arrivalOffset: 2160, departureOffset: 2160, distanceFromSource: 2150 }
      ],
      totalDistance: 2150,
      estimatedDuration: 2160
    })
  ]);
  console.log('[Seed] 3 Routes created.');

  console.log('[Seed] Creating buses with 40 seats layout...');
  const seatLayout40 = generateSeatLayout(10, 4);

  const [bus1, bus2, bus3] = await Promise.all([
    Bus.create({
      busNumber: 'DL-01-AB-1234',
      name: 'Royal Volvo Multi-Axle',
      type: 'Volvo',
      totalSeats: 40,
      seatLayout: seatLayout40,
      operator: operator._id,
      amenities: ['WiFi', 'AC', 'Charging Point', 'Water Bottle', 'Blanket', 'Reading Light'],
      isActive: true
    }),
    Bus.create({
      busNumber: 'MH-02-CD-5678',
      name: 'Scania AC Sleeper',
      type: 'AC Sleeper',
      totalSeats: 40,
      seatLayout: seatLayout40,
      operator: operator._id,
      amenities: ['AC', 'Charging Point', 'Blanket', 'Pillow', 'Water Bottle'],
      isActive: true
    }),
    Bus.create({
      busNumber: 'KA-03-EF-9012',
      name: 'BharatBenz AC Seater',
      type: 'AC Seater',
      totalSeats: 40,
      seatLayout: seatLayout40,
      operator: operator._id,
      amenities: ['AC', 'Charging Point', 'Water Bottle'],
      isActive: true
    })
  ]);
  console.log('[Seed] 3 Buses created.');

  console.log('[Seed] Creating 6 scheduled trips...');
  const now = new Date();

  const getDateAfterDays = (days) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const trips = await Promise.all([
    // Delhi -> Mumbai
    Trip.create({
      bus: bus1._id,
      route: routeDelhiMumbai._id,
      operator: operator._id,
      travelDate: getDateAfterDays(1),
      departureTime: '06:00',
      arrivalTime: '06:00',
      fare: 1800,
      boardingPoints: [{ stop: delhi._id, time: '05:30' }],
      droppingPoints: [{ stop: mumbai._id, time: '06:00' }],
      status: 'scheduled',
      availableSeats: 40
    }),
    Trip.create({
      bus: bus2._id,
      route: routeDelhiMumbai._id,
      operator: operator._id,
      travelDate: getDateAfterDays(3),
      departureTime: '18:00',
      arrivalTime: '18:00',
      fare: 1950,
      boardingPoints: [{ stop: delhi._id, time: '17:30' }],
      droppingPoints: [{ stop: mumbai._id, time: '18:00' }],
      status: 'scheduled',
      availableSeats: 40
    }),
    // Mumbai -> Pune
    Trip.create({
      bus: bus3._id,
      route: routeMumbaiPune._id,
      operator: operator._id,
      travelDate: getDateAfterDays(1),
      departureTime: '07:30',
      arrivalTime: '11:00',
      fare: 450,
      boardingPoints: [{ stop: mumbai._id, time: '07:00' }],
      droppingPoints: [{ stop: pune._id, time: '11:00' }],
      status: 'scheduled',
      availableSeats: 40
    }),
    Trip.create({
      bus: bus1._id,
      route: routeMumbaiPune._id,
      operator: operator._id,
      travelDate: getDateAfterDays(2),
      departureTime: '15:00',
      arrivalTime: '18:30',
      fare: 450,
      boardingPoints: [{ stop: mumbai._id, time: '14:30' }],
      droppingPoints: [{ stop: pune._id, time: '18:30' }],
      status: 'scheduled',
      availableSeats: 40
    }),
    // Delhi -> Bangalore
    Trip.create({
      bus: bus2._id,
      route: routeDelhiBangalore._id,
      operator: operator._id,
      travelDate: getDateAfterDays(2),
      departureTime: '08:00',
      arrivalTime: '20:00',
      fare: 2500,
      boardingPoints: [{ stop: delhi._id, time: '07:30' }],
      droppingPoints: [{ stop: bangalore._id, time: '20:00' }],
      status: 'scheduled',
      availableSeats: 40
    }),
    Trip.create({
      bus: bus3._id,
      route: routeDelhiBangalore._id,
      operator: operator._id,
      travelDate: getDateAfterDays(5),
      departureTime: '20:00',
      arrivalTime: '08:00',
      fare: 2650,
      boardingPoints: [{ stop: delhi._id, time: '19:30' }],
      droppingPoints: [{ stop: bangalore._id, time: '08:00' }],
      status: 'scheduled',
      availableSeats: 40
    })
  ]);
  console.log('[Seed] 6 Trips created.');

  console.log('[Seed] Creating 2 existing bookings for customer@demo.com...');
  // Booking 1: On Trip 0 (Delhi to Mumbai), 2 seats (1A, 1B)
  const trip1 = trips[0];
  const booking1Pnr = generatePNR();
  const passengers1 = [
    { name: 'John Doe', age: 30, gender: 'male', seatNumber: '1A', fare: trip1.fare },
    { name: 'Jane Doe', age: 28, gender: 'female', seatNumber: '1B', fare: trip1.fare }
  ];
  const booking1 = await Booking.create({
    pnr: booking1Pnr,
    user: customer._id,
    trip: trip1._id,
    passengers: passengers1,
    totalFare: trip1.fare * 2,
    status: 'confirmed',
    paymentStatus: 'paid',
    boardingPoint: delhi._id,
    droppingPoint: mumbai._id,
    bookedAt: new Date()
  });

  await SeatAllocation.create([
    {
      trip: trip1._id,
      seatNumber: '1A',
      booking: booking1._id,
      passengerName: 'John Doe',
      status: 'confirmed'
    },
    {
      trip: trip1._id,
      seatNumber: '1B',
      booking: booking1._id,
      passengerName: 'Jane Doe',
      status: 'confirmed'
    }
  ]);
  await Trip.findByIdAndUpdate(trip1._id, { $inc: { availableSeats: -2 } });

  // Booking 2: On Trip 2 (Mumbai to Pune), 1 seat (2A)
  const trip3 = trips[2];
  const booking2Pnr = generatePNR();
  const passengers2 = [
    { name: 'John Doe', age: 30, gender: 'male', seatNumber: '2A', fare: trip3.fare }
  ];
  const booking2 = await Booking.create({
    pnr: booking2Pnr,
    user: customer._id,
    trip: trip3._id,
    passengers: passengers2,
    totalFare: trip3.fare,
    status: 'confirmed',
    paymentStatus: 'paid',
    boardingPoint: mumbai._id,
    droppingPoint: pune._id,
    bookedAt: new Date()
  });

  await SeatAllocation.create([
    {
      trip: trip3._id,
      seatNumber: '2A',
      booking: booking2._id,
      passengerName: 'John Doe',
      status: 'confirmed'
    }
  ]);
  await Trip.findByIdAndUpdate(trip3._id, { $inc: { availableSeats: -1 } });

  console.log(`[Seed] Booking 1 created: PNR ${booking1Pnr} (2 seats)`);
  console.log(`[Seed] Booking 2 created: PNR ${booking2Pnr} (1 seat)`);

  // Audit log entry
  await AuditLog.create({
    user: admin._id,
    action: 'SYSTEM_SEED',
    resource: 'System',
    resourceId: admin._id,
    details: {
      users: 3,
      stops: 5,
      routes: 3,
      buses: 3,
      trips: 6,
      bookings: 2
    },
    ip: '127.0.0.1'
  });

  console.log('[Seed] Database successfully seeded with demo data!');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('[Seed] Error seeding database:', err);
  mongoose.disconnect();
  process.exit(1);
});
