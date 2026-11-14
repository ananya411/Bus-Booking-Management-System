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
const { generateSeatLayout } = require('../utils/providers');

const seed = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/busmitra';
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
      AuditLog.deleteMany({}),
    ]);
    console.log('[Seed] Cleared collections.');
  }

  // 1. Users
  console.log('[Seed] Creating users...');
  let admin = await User.findOne({ email: 'admin@demo.com' });
  if (!admin) {
    admin = await User.create({
      name: 'System Admin',
      email: 'admin@demo.com',
      password: 'Demo@123',
      role: 'admin',
      phone: '+919876543210',
    });
  }

  let operator = await User.findOne({ email: 'operator@demo.com' });
  if (!operator) {
    operator = await User.create({
      name: 'Fleet Operator',
      email: 'operator@demo.com',
      password: 'Demo@123',
      role: 'operator',
      phone: '+919876543211',
    });
  }

  let customer = await User.findOne({ email: 'customer@demo.com' });
  if (!customer) {
    customer = await User.create({
      name: 'John Doe',
      email: 'customer@demo.com',
      password: 'Demo@123',
      role: 'customer',
      phone: '+919876543212',
    });
  }
  console.log('[Seed] Verified Admin, Operator, and Customer accounts.');

  // 2. Stops
  console.log('[Seed] Ensuring top hub stops...');
  const stopsDef = [
    { name: 'Kashmere Gate ISBT', city: 'Delhi', state: 'Delhi NCR' },
    { name: 'Alambagh Intercity Terminal', city: 'Lucknow', state: 'Uttar Pradesh' },
    { name: 'Borivali East Highway Stop', city: 'Mumbai', state: 'Maharashtra' },
    { name: 'Shivaji Nagar Terminal', city: 'Pune', state: 'Maharashtra' },
    { name: 'Majestic Bus Stand', city: 'Bangalore', state: 'Karnataka' },
    { name: 'MGBS Imlibun Terminal', city: 'Hyderabad', state: 'Telangana' },
    { name: 'Sindhi Camp Central Bus Stand', city: 'Jaipur', state: 'Rajasthan' },
    { name: 'Geeta Mandir Central Bus Stand', city: 'Ahmedabad', state: 'Gujarat' },
    { name: 'Koyambedu CMBT Terminal', city: 'Chennai', state: 'Tamil Nadu' },
    { name: 'Panaji KTC Bus Stand', city: 'Goa', state: 'Goa' },
    { name: 'Sector 17 ISBT', city: 'Chandigarh', state: 'Punjab' },
  ];

  const stopMap = {};
  for (const s of stopsDef) {
    let doc = await Stop.findOne({ city: s.city });
    if (!doc) {
      doc = await Stop.create(s);
    }
    stopMap[s.city.toLowerCase()] = doc;
  }
  console.log(`[Seed] ${Object.keys(stopMap).length} City Stops verified.`);

  // 3. Corridors (Routes)
  console.log('[Seed] Creating primary highway routes...');
  const routesDef = [
    { s: 'delhi', d: 'lucknow', name: 'Delhi to Lucknow Express Corridor', km: 550, mins: 495 },
    { s: 'mumbai', d: 'pune', name: 'Mumbai to Pune Expressway', km: 150, mins: 195 },
    { s: 'bangalore', d: 'hyderabad', name: 'Bangalore to Hyderabad Deccan Express', km: 570, mins: 525 },
    { s: 'delhi', d: 'jaipur', name: 'Delhi to Jaipur Pink City Highway', km: 280, mins: 285 },
    { s: 'ahmedabad', d: 'mumbai', name: 'Ahmedabad to Mumbai Western Express', km: 525, mins: 510 },
    { s: 'chennai', d: 'bangalore', name: 'Chennai to Bangalore Silicon Highway', km: 345, mins: 360 },
    { s: 'pune', d: 'goa', name: 'Pune to Goa Konkan Holiday Line', km: 450, mins: 540 },
    { s: 'delhi', d: 'mumbai', name: 'Delhi to Mumbai Grand Trunk Line', km: 1420, mins: 1320 },
    { s: 'delhi', d: 'chandigarh', name: 'Delhi to Chandigarh Shivalik Line', km: 250, mins: 255 },
  ];

  const routeMap = {};
  for (const r of routesDef) {
    const srcStop = stopMap[r.s];
    const dstStop = stopMap[r.d];
    if (srcStop && dstStop) {
      let doc = await Route.findOne({ source: srcStop._id, destination: dstStop._id });
      if (!doc) {
        doc = await Route.create({
          name: r.name,
          source: srcStop._id,
          destination: dstStop._id,
          totalDistance: r.km,
          estimatedDuration: r.mins,
          stops: [],
        });
      }
      routeMap[`${r.s}:${r.d}`] = doc;
    }
  }
  console.log(`[Seed] ${Object.keys(routeMap).length} Verified Intercity Routes created.`);

  // 4. Buses
  console.log('[Seed] Creating premium operator buses...');
  const busesDef = [
    { num: 'DL-01-AB-1234', name: 'Royal Volvo 9600 Multi-Axle', type: 'AC Sleeper', seats: 36, isSleeper: true },
    { num: 'MH-02-CD-5678', name: 'Scania Metrolink Multi-Axle HD', type: 'AC Sleeper', seats: 40, isSleeper: true },
    { num: 'KA-03-EF-9012', name: 'BharatBenz 1623 Club Class', type: 'AC Seater', seats: 44, isSleeper: false },
    { num: 'UP-32-GH-3456', name: 'Volvo Clean Fleet Express', type: 'Volvo', seats: 42, isSleeper: false },
    { num: 'GJ-01-KL-7890', name: 'Mercedes-Benz Multi-Axle Suite', type: 'AC Sleeper', seats: 36, isSleeper: true },
    { num: 'TN-01-MN-1122', name: 'Global Standard High-Deck Coach', type: 'Volvo', seats: 48, isSleeper: false },
  ];

  const busDocs = [];
  for (const b of busesDef) {
    let bus = await Bus.findOne({ busNumber: b.num });
    if (!bus) {
      bus = await Bus.create({
        busNumber: b.num,
        name: b.name,
        type: b.type,
        totalSeats: b.seats,
        seatLayout: generateSeatLayout(b.seats, b.isSleeper),
        operator: operator._id,
        amenities: ['Wi-Fi', 'AC', 'Charging Point', 'Blanket', 'Reading Light', 'Live Tracking', 'CCTV'],
        isActive: true,
      });
    }
    busDocs.push(bus);
  }
  console.log(`[Seed] ${busDocs.length} Verified Fleet Coaches created.`);

  // 5. Trips for multiple upcoming days
  console.log('[Seed] Scheduling departures for next 14 days...');
  const now = new Date();

  // Create departures for days 0, 1, 2, 3, 5, 7, 10
  const daysOffset = [0, 1, 2, 3, 5, 7, 10];
  let createdCount = 0;

  for (const offset of daysOffset) {
    const travelDate = new Date(now);
    travelDate.setDate(travelDate.getDate() + offset);
    travelDate.setUTCHours(0, 0, 0, 0);

    for (const [key, routeDoc] of Object.entries(routeMap)) {
      const [srcCity] = key.split(':');
      const srcStop = stopMap[srcCity];
      const distance = routeDoc.totalDistance;

      // Check if trip already exists for this route and day
      const exists = await Trip.findOne({
        route: routeDoc._id,
        travelDate,
      });

      if (!exists) {
        // Morning departure
        const fareMorning = Math.round(Math.max(280, distance * 1.85) / 5) * 5;
        await Trip.create({
          bus: busDocs[0]._id,
          route: routeDoc._id,
          operator: operator._id,
          travelDate,
          departureTime: '06:30',
          arrivalTime: '14:45',
          fare: fareMorning,
          boardingPoints: [{ stop: srcStop._id, time: '06:00' }],
          droppingPoints: [{ stop: routeDoc.destination, time: '14:45' }],
          status: 'scheduled',
          availableSeats: 26,
        });

        // Evening departure
        const fareEvening = Math.round(Math.max(350, distance * 2.20) / 5) * 5;
        await Trip.create({
          bus: busDocs[1]._id,
          route: routeDoc._id,
          operator: operator._id,
          travelDate,
          departureTime: '21:00',
          arrivalTime: '05:30',
          fare: fareEvening,
          boardingPoints: [{ stop: srcStop._id, time: '20:30' }],
          droppingPoints: [{ stop: routeDoc.destination, time: '05:30' }],
          status: 'scheduled',
          availableSeats: 19,
        });

        createdCount += 2;
      }
    }
  }

  console.log(`[Seed] Finished scheduling ${createdCount} new dynamic trips across corridors.`);

  // 6. Demo Booking with PNR for immediate test lookup
  let demoBooking = await Booking.findOne({ pnr: 'BM782910' });
  if (!demoBooking) {
    const sampleTrip = await Trip.findOne({ status: 'scheduled' });
    if (sampleTrip) {
      demoBooking = await Booking.create({
        pnr: 'BM782910',
        user: customer._id,
        trip: sampleTrip._id,
        passengers: [
          { name: 'Aditya Sharma', age: 29, gender: 'male', seatNumber: 'L4', fare: sampleTrip.fare },
          { name: 'Priya Sharma', age: 27, gender: 'female', seatNumber: 'L5', fare: sampleTrip.fare },
        ],
        totalFare: sampleTrip.fare * 2,
        status: 'confirmed',
        paymentStatus: 'paid',
        bookedAt: new Date(),
      });

      await SeatAllocation.create([
        { trip: sampleTrip._id, seatNumber: 'L4', booking: demoBooking._id, passengerName: 'Aditya Sharma', status: 'confirmed' },
        { trip: sampleTrip._id, seatNumber: 'L5', booking: demoBooking._id, passengerName: 'Priya Sharma', status: 'confirmed' },
      ]);
      console.log('[Seed] Demo Booking BM782910 created successfully.');
    }
  }

  console.log('----------------------------------------------------');
  console.log('✅ SEED COMPLETED SUCCESSFULLY');
  console.log('Admin:    admin@demo.com    / Demo@123');
  console.log('Operator: operator@demo.com / Demo@123');
  console.log('Customer: customer@demo.com / Demo@123');
  console.log('Demo PNR: BM782910');
  console.log('----------------------------------------------------');

  await mongoose.connection.close();
};

seed().catch((err) => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
