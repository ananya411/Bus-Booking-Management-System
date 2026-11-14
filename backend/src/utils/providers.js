/**
 * BusMitra — Service Providers & Dynamic Fare Engine
 * Defines verified coach operators, fleet profiles, seat layouts, and distance-based fare tariffs.
 */

const VERIFIED_OPERATORS = [
  {
    id: 'op-neeta',
    name: 'Neeta Coaches',
    busName: 'Royal Volvo 9600 Luxury Multi-Axle',
    busType: 'AC Sleeper',
    ratePerKm: 2.25,
    baseFee: 80,
    minFare: 380,
    rating: 4.9,
    ratingCount: 4180,
    totalSeats: 36,
    isSleeper: true,
    amenities: ['Wi-Fi', 'AC', 'Charging Point', 'Blanket', 'Pillow', 'Reading Light', 'Live Tracking', 'CCTV'],
    departureSlots: ['06:30', '15:15', '21:30'],
  },
  {
    id: 'op-vrl',
    name: 'VRL Roadways',
    busName: 'Scania Metrolink Multi-Axle HD',
    busType: 'AC Sleeper',
    ratePerKm: 2.10,
    baseFee: 75,
    minFare: 350,
    rating: 4.8,
    ratingCount: 3420,
    totalSeats: 40,
    isSleeper: true,
    amenities: ['AC', 'Charging Point', 'Blanket', 'Water Bottle', 'Live Tracking', 'Emergency Exit', 'CCTV'],
    departureSlots: ['08:00', '17:30', '22:15'],
  },
  {
    id: 'op-zingbus',
    name: 'Zingbus Smart Express',
    busName: 'Volvo Clean Fleet Express',
    busType: 'Volvo',
    ratePerKm: 1.85,
    baseFee: 60,
    minFare: 300,
    rating: 4.7,
    ratingCount: 3950,
    totalSeats: 42,
    isSleeper: false,
    amenities: ['Wi-Fi', 'AC', 'Charging Point', 'Lounge Access', 'Live Tracking', 'Clean Restrooms'],
    departureSlots: ['07:15', '13:45', '19:00'],
  },
  {
    id: 'op-verma',
    name: 'Verma Travels',
    busName: 'BharatBenz 1623 Club Class',
    busType: 'AC Seater',
    ratePerKm: 1.65,
    baseFee: 50,
    minFare: 280,
    rating: 4.6,
    ratingCount: 2810,
    totalSeats: 44,
    isSleeper: false,
    amenities: ['AC', 'Charging Point', 'Water Bottle', 'Reading Light', 'CCTV'],
    departureSlots: ['09:00', '16:00', '23:00'],
  },
  {
    id: 'op-intrcity',
    name: 'IntrCity SmartBus',
    busName: 'Executive Suite Sleeper Lounge',
    busType: 'AC Sleeper',
    ratePerKm: 2.45,
    baseFee: 90,
    minFare: 420,
    rating: 4.8,
    ratingCount: 5120,
    totalSeats: 34,
    isSleeper: true,
    amenities: ['Wi-Fi', 'AC', 'Bus Captain', 'CCTV', 'Blanket', 'Water Bottle', 'Live Tracking'],
    departureSlots: ['10:30', '18:45', '22:45'],
  },
  {
    id: 'op-orange',
    name: 'Orange Tours & Travels',
    busName: 'Mercedes-Benz Multi-Axle Gold Suite',
    busType: 'AC Sleeper',
    ratePerKm: 2.60,
    baseFee: 100,
    minFare: 450,
    rating: 4.9,
    ratingCount: 3200,
    totalSeats: 36,
    isSleeper: true,
    amenities: ['Wi-Fi', 'AC', 'Charging Point', 'Snacks', 'Blanket', 'Reading Light', 'Live Tracking'],
    departureSlots: ['11:45', '20:15', '23:30'],
  },
  {
    id: 'op-busmitra-express',
    name: 'BusMitra Royal Express',
    busName: 'Global Standard High-Deck Coach',
    busType: 'Volvo',
    ratePerKm: 1.75,
    baseFee: 55,
    minFare: 290,
    rating: 4.8,
    ratingCount: 6240,
    totalSeats: 48,
    isSleeper: false,
    amenities: ['Wi-Fi', 'AC', 'USB-C Charging', 'Extra Legroom', 'Live Tracking', 'Restroom on Board'],
    departureSlots: ['06:00', '12:00', '16:30', '21:00'],
  },
  {
    id: 'op-srs',
    name: 'SRS Travels',
    busName: 'Ashok Leyland Luxura Semi-Sleeper',
    busType: 'AC Seater',
    ratePerKm: 1.50,
    baseFee: 45,
    minFare: 250,
    rating: 4.5,
    ratingCount: 1890,
    totalSeats: 40,
    isSleeper: false,
    amenities: ['Charging Point', 'Water Bottle', 'Reading Light'],
    departureSlots: ['08:30', '14:30', '20:45'],
  },
];

/**
 * Calculates dynamic fare for a route based on distance and operator tariff
 * @param {number} distanceKm
 * @param {object} operator
 * @returns {number}
 */
const calculateDynamicFare = (distanceKm, operator) => {
  const km = Math.max(distanceKm || 100, 50);
  const rawFare = km * (operator.ratePerKm || 2.0) + (operator.baseFee || 60);

  // Round to nearest 5 or 9 for commercial appeal (e.g. 350, 449, 1085)
  let rounded = Math.round(rawFare / 5) * 5;
  if (operator.minFare && rounded < operator.minFare) {
    rounded = operator.minFare;
  }
  return rounded;
};

/**
 * Generates structured 2D seat layout for a bus (Upper & Lower deck or standard 2x2)
 */
const generateSeatLayout = (totalSeats = 36, isSleeper = true) => {
  const layout = [];

  if (isSleeper) {
    // 2 decks: Lower (L1..L18) and Upper (U1..U18)
    const seatsPerDeck = Math.floor(totalSeats / 2);
    const rowsPerDeck = Math.ceil(seatsPerDeck / 3);

    // Lower deck
    for (let r = 1; r <= rowsPerDeck; r++) {
      const row = [];
      const num1 = `L${(r - 1) * 3 + 1}`;
      const num2 = `L${(r - 1) * 3 + 2}`;
      const num3 = `L${(r - 1) * 3 + 3}`;

      row.push({ seatNumber: num1, type: 'window', deck: 'lower' });
      row.push({ seatNumber: num2, type: 'aisle', deck: 'lower' });
      row.push({ seatNumber: num3, type: 'window', deck: 'lower' });
      layout.push(row);
    }

    // Upper deck
    for (let r = 1; r <= rowsPerDeck; r++) {
      const row = [];
      const num1 = `U${(r - 1) * 3 + 1}`;
      const num2 = `U${(r - 1) * 3 + 2}`;
      const num3 = `U${(r - 1) * 3 + 3}`;

      row.push({ seatNumber: num1, type: 'window', deck: 'upper' });
      row.push({ seatNumber: num2, type: 'aisle', deck: 'upper' });
      row.push({ seatNumber: num3, type: 'window', deck: 'upper' });
      layout.push(row);
    }

    return {
      rows: rowsPerDeck * 2,
      seatsPerRow: 3,
      layout,
    };
  } else {
    // Standard 2x2 Seater (e.g. 10 rows x 4 seats = 40 seats)
    const rows = Math.ceil(totalSeats / 4);
    const cols = ['A', 'B', 'C', 'D'];

    for (let r = 1; r <= rows; r++) {
      const row = [];
      for (let c = 0; c < 4; c++) {
        const seatNumber = `${r}${cols[c]}`;
        const type = c === 0 || c === 3 ? 'window' : 'aisle';
        row.push({ seatNumber, type, deck: 'lower' });
      }
      layout.push(row);
    }

    return {
      rows,
      seatsPerRow: 4,
      layout,
    };
  }
};

/**
 * Generates standard state code and regional vehicle registration number
 */
const generateBusNumber = (stateCode = 'MH', index = 1) => {
  const letters = ['AB', 'CD', 'EF', 'GH', 'KL', 'MN', 'PQ', 'RS', 'XY', 'ZT'];
  const pair = letters[index % letters.length];
  const num = 1000 + ((index * 387 + 491) % 8999);
  const district = (1 + (index % 12)).toString().padStart(2, '0');
  return `${stateCode.toUpperCase()}-${district}-${pair}-${num}`;
};

module.exports = {
  VERIFIED_OPERATORS,
  calculateDynamicFare,
  generateSeatLayout,
  generateBusNumber,
};

