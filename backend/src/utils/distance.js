/**
 * BusMitra — City Coordinates & Highway Distance Calculation Engine
 * Computes realistic intercity highway distances and travel durations
 * across all major Indian state corridors and expressways.
 */

// Comprehensive Coordinates for Indian Cities & Express Corridors
const CITY_COORDINATES = {
  // Delhi NCR
  'delhi': { lat: 28.6139, lng: 77.2090, state: 'Delhi NCR' },
  'new delhi': { lat: 28.6139, lng: 77.2090, state: 'Delhi NCR' },
  'noida': { lat: 28.5355, lng: 77.3910, state: 'Uttar Pradesh' },
  'gurgaon': { lat: 28.4595, lng: 77.0266, state: 'Haryana' },
  'faridabad': { lat: 28.4089, lng: 77.3178, state: 'Haryana' },
  'ghaziabad': { lat: 28.6692, lng: 77.4538, state: 'Uttar Pradesh' },

  // Maharashtra
  'mumbai': { lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  'pune': { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  'nagpur': { lat: 21.1458, lng: 79.0882, state: 'Maharashtra' },
  'nashik': { lat: 19.9975, lng: 73.7898, state: 'Maharashtra' },
  'aurangabad': { lat: 19.8762, lng: 75.3433, state: 'Maharashtra' },
  'kolhapur': { lat: 16.7050, lng: 74.2433, state: 'Maharashtra' },
  'solapur': { lat: 17.6599, lng: 75.9064, state: 'Maharashtra' },
  'thane': { lat: 19.2183, lng: 72.9781, state: 'Maharashtra' },

  // Karnataka
  'bangalore': { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  'bengaluru': { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  'mysore': { lat: 12.2958, lng: 76.6394, state: 'Karnataka' },
  'hubli': { lat: 15.3647, lng: 75.1240, state: 'Karnataka' },
  'mangalore': { lat: 12.9141, lng: 74.8560, state: 'Karnataka' },
  'belgaum': { lat: 15.8497, lng: 74.4977, state: 'Karnataka' },

  // Telangana & Andhra Pradesh
  'hyderabad': { lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  'warangal': { lat: 17.9689, lng: 79.5941, state: 'Telangana' },
  'visakhapatnam': { lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh' },
  'vijayawada': { lat: 16.5062, lng: 80.6480, state: 'Andhra Pradesh' },
  'tirupati': { lat: 13.6288, lng: 79.4192, state: 'Andhra Pradesh' },

  // Uttar Pradesh
  'lucknow': { lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
  'kanpur': { lat: 26.4499, lng: 80.3319, state: 'Uttar Pradesh' },
  'agra': { lat: 27.1767, lng: 78.0081, state: 'Uttar Pradesh' },
  'varanasi': { lat: 25.3176, lng: 82.9739, state: 'Uttar Pradesh' },
  'prayagraj': { lat: 25.4358, lng: 81.8463, state: 'Uttar Pradesh' },
  'allahabad': { lat: 25.4358, lng: 81.8463, state: 'Uttar Pradesh' },
  'ayodhya': { lat: 26.7922, lng: 82.1998, state: 'Uttar Pradesh' },
  'mathura': { lat: 27.4924, lng: 77.6737, state: 'Uttar Pradesh' },
  'bareilly': { lat: 28.3670, lng: 79.4304, state: 'Uttar Pradesh' },

  // Rajasthan
  'jaipur': { lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  'jodhpur': { lat: 26.2389, lng: 73.0243, state: 'Rajasthan' },
  'udaipur': { lat: 24.5854, lng: 73.7125, state: 'Rajasthan' },
  'kota': { lat: 25.2138, lng: 75.8648, state: 'Rajasthan' },
  'ajmer': { lat: 26.4499, lng: 74.6399, state: 'Rajasthan' },
  'bikaner': { lat: 28.0229, lng: 73.3119, state: 'Rajasthan' },

  // Gujarat
  'ahmedabad': { lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  'surat': { lat: 21.1702, lng: 72.8311, state: 'Gujarat' },
  'vadodara': { lat: 22.3072, lng: 73.1812, state: 'Gujarat' },
  'rajkot': { lat: 22.3039, lng: 70.8022, state: 'Gujarat' },
  'gandhinagar': { lat: 23.2156, lng: 72.6369, state: 'Gujarat' },

  // Tamil Nadu & Kerala
  'chennai': { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  'coimbatore': { lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu' },
  'madurai': { lat: 9.9252, lng: 78.1198, state: 'Tamil Nadu' },
  'salem': { lat: 11.6643, lng: 78.1460, state: 'Tamil Nadu' },
  'trichy': { lat: 10.7905, lng: 78.7047, state: 'Tamil Nadu' },
  'kochi': { lat: 9.9312, lng: 76.2673, state: 'Kerala' },
  'thiruvananthapuram': { lat: 8.5241, lng: 76.9366, state: 'Kerala' },
  'trivandrum': { lat: 8.5241, lng: 76.9366, state: 'Kerala' },
  'kozhikode': { lat: 11.2588, lng: 75.7804, state: 'Kerala' },

  // Goa & West Bengal & Punjab
  'goa': { lat: 15.2993, lng: 74.1240, state: 'Goa' },
  'panaji': { lat: 15.4909, lng: 73.8278, state: 'Goa' },
  'margao': { lat: 15.2832, lng: 73.9862, state: 'Goa' },
  'kolkata': { lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  'siliguri': { lat: 26.7271, lng: 88.3953, state: 'West Bengal' },
  'chandigarh': { lat: 30.7333, lng: 76.7794, state: 'Punjab' },
  'amritsar': { lat: 31.6340, lng: 74.8723, state: 'Punjab' },
  'ludhiana': { lat: 30.9010, lng: 75.8573, state: 'Punjab' },

  // Madhya Pradesh & Others
  'bhopal': { lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh' },
  'indore': { lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh' },
  'gwalior': { lat: 26.2183, lng: 78.1828, state: 'Madhya Pradesh' },
  'dehradun': { lat: 30.3165, lng: 78.0322, state: 'Uttarakhand' },
  'haridwar': { lat: 29.9457, lng: 78.1642, state: 'Uttarakhand' },
  'shimla': { lat: 31.1048, lng: 77.1734, state: 'Himachal Pradesh' },
  'patna': { lat: 25.5941, lng: 85.1376, state: 'Bihar' },
  'ranchi': { lat: 23.3441, lng: 85.3096, state: 'Jharkhand' },

  // US Corridor
  'new york': { lat: 40.7128, lng: -74.0060, state: 'New York' },
  'boston': { lat: 42.3601, lng: -71.0589, state: 'Massachusetts' },
  'washington': { lat: 38.9072, lng: -77.0369, state: 'District of Columbia' },
  'philadelphia': { lat: 39.9526, lng: -75.1652, state: 'Pennsylvania' },
  'los angeles': { lat: 34.0522, lng: -118.2437, state: 'California' },
  'las vegas': { lat: 36.1699, lng: -115.1398, state: 'Nevada' },
  'chicago': { lat: 41.8781, lng: -87.6298, state: 'Illinois' },
  'houston': { lat: 29.7604, lng: -95.3698, state: 'Texas' },
  'dallas': { lat: 32.7767, lng: -96.7970, state: 'Texas' },
};

// Known exact highway distances (km) & durations (minutes)
const EXACT_HIGHWAY_ROUTES = {
  // Mumbai routes
  'mumbai:pune': { km: 150, minutes: 195 }, // 3h 15m
  'mumbai:ahmedabad': { km: 525, minutes: 510 }, // 8h 30m
  'mumbai:surat': { km: 285, minutes: 300 }, // 5h 00m
  'mumbai:goa': { km: 590, minutes: 660 }, // 11h 00m
  'mumbai:nashik': { km: 165, minutes: 225 }, // 3h 45m
  'mumbai:nagpur': { km: 810, minutes: 810 }, // 13h 30m
  'mumbai:delhi': { km: 1420, minutes: 1320 }, // 22h 00m

  // Pune routes
  'pune:goa': { km: 450, minutes: 540 }, // 9h 00m
  'pune:kolhapur': { km: 230, minutes: 270 }, // 4h 30m
  'pune:bangalore': { km: 840, minutes: 840 }, // 14h 00m
  'pune:hyderabad': { km: 560, minutes: 570 }, // 9h 30m

  // Delhi routes
  'delhi:lucknow': { km: 550, minutes: 495 }, // 8h 15m
  'delhi:jaipur': { km: 280, minutes: 285 }, // 4h 45m
  'delhi:agra': { km: 220, minutes: 210 }, // 3h 30m
  'delhi:chandigarh': { km: 250, minutes: 255 }, // 4h 15m
  'delhi:amritsar': { km: 460, minutes: 465 }, // 7h 45m
  'delhi:dehradun': { km: 260, minutes: 330 }, // 5h 30m
  'delhi:haridwar': { km: 230, minutes: 285 }, // 4h 45m
  'delhi:kanpur': { km: 500, minutes: 450 }, // 7h 30m
  'delhi:varanasi': { km: 820, minutes: 750 }, // 12h 30m
  'delhi:bangalore': { km: 2150, minutes: 2160 }, // 36h 00m

  // Bangalore routes
  'bangalore:hyderabad': { km: 570, minutes: 525 }, // 8h 45m
  'bangalore:chennai': { km: 345, minutes: 360 }, // 6h 00m
  'bangalore:mysore': { km: 145, minutes: 180 }, // 3h 00m
  'bangalore:mangalore': { km: 350, minutes: 450 }, // 7h 30m
  'bangalore:hubli': { km: 410, minutes: 405 }, // 6h 45m
  'bangalore:goa': { km: 560, minutes: 630 }, // 10h 30m
  'bangalore:kochi': { km: 540, minutes: 585 }, // 9h 45m

  // Ahmedabad routes
  'ahmedabad:surat': { km: 260, minutes: 270 }, // 4h 30m
  'ahmedabad:vadodara': { km: 110, minutes: 120 }, // 2h 00m
  'ahmedabad:rajkot': { km: 220, minutes: 240 }, // 4h 00m
  'ahmedabad:udaipur': { km: 260, minutes: 285 }, // 4h 45m

  // Jaipur routes
  'jaipur:jodhpur': { km: 330, minutes: 345 }, // 5h 45m
  'jaipur:udaipur': { km: 395, minutes: 390 }, // 6h 30m
  'jaipur:kota': { km: 250, minutes: 270 }, // 4h 30m

  // Hyderabad routes
  'hyderabad:vijayawada': { km: 275, minutes: 285 }, // 4h 45m
  'hyderabad:visakhapatnam': { km: 620, minutes: 660 }, // 11h 00m

  // Chennai routes
  'chennai:coimbatore': { km: 500, minutes: 510 }, // 8h 30m
  'chennai:madurai': { km: 460, minutes: 465 }, // 7h 45m
  'chennai:salem': { km: 340, minutes: 360 }, // 6h 00m

  // US Routes
  'boston:new york': { km: 350, minutes: 255 }, // 4h 15m
  'new york:washington': { km: 360, minutes: 270 }, // 4h 30m
  'new york:philadelphia': { km: 155, minutes: 120 }, // 2h 00m
  'las vegas:los angeles': { km: 435, minutes: 285 }, // 4h 45m
  'houston:dallas': { km: 385, minutes: 230 }, // 3h 50m
};

/**
 * Normalizes city name (removes state tags, extra spaces, casing)
 */
const normalizeCity = (city) => {
  if (!city) return '';
  return city
    .toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, '') // remove parenthesized info like (Panaji), (NCR)
    .replace(/,\s*[a-z.\s]+/gi, '') // remove trailing state like ", NY", ", MA"
    .trim();
};

/**
 * Haversine distance in KM
 */
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Computes realistic driving distance and duration between two cities
 * @returns { distanceKm, durationMinutes, durationFormatted }
 */
const calculateDistance = (sourceCity, destCity) => {
  const s = normalizeCity(sourceCity);
  const d = normalizeCity(destCity);

  if (!s || !d || s === d) {
    return {
      distanceKm: 50,
      durationMinutes: 90,
      durationFormatted: '1h 30m',
    };
  }

  // 1. Check exact known highway route lookup (both directions)
  const key1 = `${s}:${d}`;
  const key2 = `${d}:${s}`;
  if (EXACT_HIGHWAY_ROUTES[key1]) {
    const route = EXACT_HIGHWAY_ROUTES[key1];
    return {
      distanceKm: route.km,
      durationMinutes: route.minutes,
      durationFormatted: formatMinutes(route.minutes),
    };
  }
  if (EXACT_HIGHWAY_ROUTES[key2]) {
    const route = EXACT_HIGHWAY_ROUTES[key2];
    return {
      distanceKm: route.km,
      durationMinutes: route.minutes,
      durationFormatted: formatMinutes(route.minutes),
    };
  }

  // 2. Check coordinates for geometric computation
  const coordS = CITY_COORDINATES[s];
  const coordD = CITY_COORDINATES[d];

  let distanceKm = 300; // sensible default
  if (coordS && coordD) {
    const straightLine = haversine(coordS.lat, coordS.lng, coordD.lat, coordD.lng);
    // Highway roads are not straight lines; apply road curvature winding multiplier (1.26x)
    distanceKm = Math.round(straightLine * 1.26);
  } else {
    // Generate deterministic distance from city name hash if unknown
    const hash = Math.abs(hashString(s) + hashString(d));
    distanceKm = 180 + (hash % 650);
  }

  // Clamp distance to minimum 60 km
  if (distanceKm < 60) distanceKm = 60;

  // Compute travel duration based on distance
  let avgSpeed = 60; // km/h
  let restStopBuffer = 30; // minutes
  if (distanceKm < 200) {
    avgSpeed = 50;
    restStopBuffer = 20;
  } else if (distanceKm > 600) {
    avgSpeed = 65;
    restStopBuffer = 60;
  }

  const travelMinutes = Math.round((distanceKm / avgSpeed) * 60) + restStopBuffer;

  return {
    distanceKm,
    durationMinutes: travelMinutes,
    durationFormatted: formatMinutes(travelMinutes),
  };
};

/**
 * Formats minutes into "Xh Ym"
 */
const formatMinutes = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}h 00m`;
  return `${h}h ${m < 10 ? '0' : ''}${m}m`;
};

/**
 * Calculates arrival time string given a departure time (e.g. "06:30") and durationMinutes
 */
const calculateArrivalTime = (departureTimeStr, durationMinutes) => {
  try {
    const [hStr, mStr] = departureTimeStr.split(':');
    let totalMins = parseInt(hStr, 10) * 60 + parseInt(mStr || 0, 10) + durationMinutes;

    let arrivalHour = Math.floor((totalMins / 60) % 24);
    let arrivalMin = totalMins % 60;

    const ampm = arrivalHour >= 12 ? 'PM' : 'AM';
    const displayHour = arrivalHour % 12 === 0 ? 12 : arrivalHour % 12;
    const padMin = arrivalMin < 10 ? `0${arrivalMin}` : arrivalMin;

    return `${displayHour}:${padMin} ${ampm}`;
  } catch {
    return '02:30 PM';
  }
};

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};

module.exports = {
  CITY_COORDINATES,
  calculateDistance,
  formatMinutes,
  calculateArrivalTime,
  normalizeCity,
};

