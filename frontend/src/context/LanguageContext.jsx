import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

const TRANSLATIONS = {
  en: {
    // Navbar
    'nav.planJourney': 'Plan Your Journey',
    'nav.liveTracker': 'Real-Time Bus Tracker',
    'nav.liveTrackerDesc': 'Track coach live location & ETA by Bus Number',
    'nav.routeMap': 'Route Network Map',
    'nav.routeMapDesc': 'Explore 10,000+ daily connection points',
    'nav.manageBooking': 'Manage Booking',
    'nav.manageBookingDesc': 'Print tickets, check PNR, or change berth',
    'nav.services': 'Services (Luggage & Wi-Fi)',
    'nav.servicesDesc': 'Luggage allowances, Wi-Fi & onboard amenities',
    'nav.support': 'Help & Support',
    'nav.signIn': 'Sign in / Register',
    'nav.myBookings': 'My Bookings',
    'nav.adminPortal': 'Admin Portal',
    'nav.operatorPortal': 'Operator Trips',
    'nav.signOut': 'Sign Out',
    'nav.language': 'Language',

    // Hero Section
    'hero.badge': 'Pan-India Intercity Coach Network · 10,000+ Daily Routes',
    'hero.exploreMap': 'Explore Map',
    'hero.liveTracker': 'Live Tracker',
    'hero.expressCorridors': 'Express Golden Corridors',
    'hero.title': 'Bus Travel across India,',
    'hero.titleAccent': 'seat by seat.',
    'hero.subtitle': 'Pick the exact berth you want, track your coach in real time, and carry your digital ticket right on your phone. Daily express volvos and luxury sleepers.',
    'hero.zeroFee': 'Zero Booking Fees',
    'hero.gpsTracking': 'Live GPS Tracking',
    'hero.instantTicket': 'Instant M-Ticket',

    // Search Form
    'search.oneway': 'One-way',
    'search.roundtrip': 'Round-trip',
    'search.instantConfirmation': 'Zero Booking Fee · Instant PNR Confirmation',
    'search.from': 'From',
    'search.fromPlaceholder': 'Select departure city',
    'search.to': 'To',
    'search.toPlaceholder': 'Select destination city',
    'search.date': 'Date',
    'search.returnDate': 'Return Date',
    'search.passengers': 'Passengers',
    'search.passenger': 'Passenger',
    'search.adults': 'Adults',
    'search.adultsAge': 'Age 12 and above',
    'search.children': 'Children',
    'search.childrenAge': 'Age 0–11 years',
    'search.done': 'Done',
    'search.submit': 'Search buses',
    'search.popularCorridors': 'Popular Corridors:',
    'search.selectBoth': 'Please select both departure and destination cities.',
    'search.selectDate': 'Please select a valid travel date.',
    'search.differentCities': 'Origin and destination cities must be different.',

    // App Section
    'app.badge': 'Next-Gen Mobile Booking',
    'app.title': 'Get the app and travel with ease of mind',
    'app.subtitle': 'Everything for your trip in one place: live GPS bus tracking, offline boarding tickets, easy seat upgrades, and instant delay notifications.',
    'app.digitalTicket': 'Digital ticket',
    'app.digitalTicketDesc': 'Board with phone QR scan',
    'app.liveTracking': 'Live bus tracking',
    'app.liveTrackingDesc': 'Real-time delay & ETA updates',
    'app.easyCancel': 'Easy cancellations',
    'app.easyCancelDesc': 'Automated instant refund credit',
    'app.support247': '24/7 dedicated support',
    'app.support247Desc': 'In-app chat & toll-free helpline',
    'app.scanQr': 'Scan QR to install on iOS or Android',
    'app.qrAvailable': 'Available on App Store & Google Play',

    // Core Pillars
    'pillars.badge': 'The BusMitra Standard',
    'pillars.title': 'Why travel with BusMitra?',
    'pillars.subtitle': 'Engineered for comfort, guaranteed best fares, and eco-friendly collective transit.',
    'pillars.p1Title': 'Connecting you to India',
    'pillars.p1Desc': 'Endless possibilities. Discover over 10,000 destinations across all Indian states with frequent departures and verified route corridors.',
    'pillars.p2Title': 'Comfort on the go',
    'pillars.p2Desc': 'Kick back with free high-speed Wi-Fi, individual power outlets, ergonomic extra legroom, and sanitized air-conditioned cabins.',
    'pillars.p3Title': 'Choose, book, travel',
    'pillars.p3Desc': 'From your screen to your seat in seconds. Pick your preferred berth, confirm your booking, and we will take care of the rest.',
    'pillars.p4Title': 'Go together',
    'pillars.p4Desc': 'Why add another car on the road when you can choose collective travel instead? Up to 80% lower CO2 emissions per passenger-km.',

    // Route Map Banner
    'mapBanner.badge': 'Where to next?',
    'mapBanner.title': 'Discover our travel map with 10,000+ destinations',
    'mapBanner.subtitle': 'Explore our full route network connecting major metropolitan hubs, tourist destinations, and regional expressways with real-time seat availability.',
    'mapBanner.exploreBtn': 'Explore the map',
    'mapBanner.trackBtn': 'Track Active Trips',

    // Destinations Section
    'dest.badge': 'Network Highlights',
    'dest.title': 'Top Destinations & Bus Connections',
    'dest.subtitle': 'Select a popular city or high-demand route to book your ticket instantly.',
    'dest.tabConnections': 'Popular Connections',
    'dest.tabCities': 'Major Cities',
    'dest.bookNow': 'Book Seats',
    'dest.viewBuses': 'View Buses',

    // Travel Guides Accordion
    'guides.title': 'Essential Travel Guides & Route Information',
    'guides.showLess': 'Show less',
    'guides.continueReading': 'Continue reading',
    'guides.card1Title': 'Get Cheap Bus Tickets with BusMitra!',
    'guides.card1Desc': 'If you are looking to travel intercity across India or on major express corridors, BusMitra has you covered with over 400,000 available departures. Zero hidden surcharges, clear seat tariffs, and easy 1-click booking make planning simple.',
    'guides.card2Title': 'Bus Routes and Timetables to Suit Your Schedule',
    'guides.card2Desc': 'Traveling with BusMitra is hassle-free with modern AC sleeper and semi-sleeper buses, frequent daytime and overnight departures, and reliable timetables. Enjoy onboard Wi-Fi and track your journey in real time using our live telemetry system.',

    // Bottom App Banner
    'banner.badge': 'Digital ticket & Live tracking',
    'banner.title': 'Discover the BusMitra mobile app',
    'banner.subtitle': 'Carry your tickets offline and track your drivers real-time ETA.',
    'banner.downloadBtn': 'Download the App',
    'banner.manageBtn': 'Manage My Booking',

    // Footer
    'footer.payments': '100% Secure Payments',
    'footer.paymentsDesc': 'Encrypted instant checkout',
    'footer.paperless': 'Digital Paperless Tickets',
    'footer.paperlessDesc': 'Board with phone QR',
    'footer.support': '24/7 Dedicated Support',
    'footer.supportDesc': 'Call 1800 200 4455',
    'footer.coaches': 'Verified AC Coaches',
    'footer.coachesDesc': 'Sanitized & GPS monitored',
    'footer.desc': "India's premium intercity bus booking network. Live GPS tracking, verified luxury AC coaches, guaranteed seat selection, and instant paperless boarding.",
    'footer.official': 'Official Booking Platform',
    'footer.busTravel': 'Bus Travel',
    'footer.whyUs': 'Why Travel With Us?',
    'footer.routeNetwork': 'Route Network Map',
    'footer.liveGps': 'Live GPS Tracking',
    'footer.destinations': 'Destinations',
    'footer.popularCorridors': 'Popular Corridors',
    'footer.allStops': 'All Transit Terminals',
    'footer.customerService': 'Customer Service',
    'footer.helpFaq': 'Help & FAQ',
    'footer.cancellation': 'Cancellation & Refunds',
    'footer.luggagePolicy': 'Luggage Policy',
    'footer.about': 'About BusMitra',
    'footer.sustainability': 'Green Collective Transit',
    'footer.press': 'Press & Media',
    'footer.careers': 'Careers & Drivers',
    'footer.operatorPortalLink': 'Bus Operator Sign In',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms & Conditions',
    'footer.rights': 'All rights reserved.',
  },

  hi: {
    // Navbar
    'nav.planJourney': 'अपनी यात्रा की योजना बनाएं',
    'nav.liveTracker': 'लाइव बस ट्रैकर',
    'nav.liveTrackerDesc': 'बस नंबर द्वारा लाइव स्थान और ईटीए ट्रैक करें',
    'nav.routeMap': 'रूट नेटवर्क मैप',
    'nav.routeMapDesc': '10,000+ दैनिक कनेक्शन बिंदु देखें',
    'nav.manageBooking': 'बुकिंग प्रबंधित करें',
    'nav.manageBookingDesc': 'टिकट प्रिंट करें, पीएनआर जांचें या सीट बदलें',
    'nav.services': 'सेवाएं (सामान और वाई-फाई)',
    'nav.servicesDesc': 'सामान सीमा, वाई-फाई और ऑनबोर्ड सुविधाएं',
    'nav.support': 'सहायता और समर्थन',
    'nav.signIn': 'साइन इन / रजिस्टर',
    'nav.myBookings': 'मेरी बुकिंग',
    'nav.adminPortal': 'व्यवस्थापक पोर्टल',
    'nav.operatorPortal': 'ऑपरेटर यात्राएं',
    'nav.signOut': 'लॉग आउट',
    'nav.language': 'भाषा',

    // Hero Section
    'hero.badge': 'अखिल भारतीय इंटरसिटी कोच नेटवर्क · 10,000+ दैनिक रूट',
    'hero.exploreMap': 'मैप देखें',
    'hero.liveTracker': 'लाइव ट्रैकर',
    'hero.expressCorridors': 'एक्सप्रेस गोल्डन कॉरिडोर',
    'hero.title': 'भारत भर में बस यात्रा,',
    'hero.titleAccent': 'सीट दर सीट।',
    'hero.subtitle': 'अपनी मनपसंद सीट चुनें, बस को लाइव ट्रैक करें और डिजिटल टिकट अपने फोन पर पाएं। दैनिक वोल्वो एक्सप्रेस और लग्जरी स्लीपर बसें।',
    'hero.zeroFee': 'शून्य बुकिंग शुल्क',
    'hero.gpsTracking': 'लाइव जीपीएस ट्रैकिंग',
    'hero.instantTicket': 'तत्काल एम-टिकट',

    // Search Form
    'search.oneway': 'एक तरफ़ा',
    'search.roundtrip': 'आना-जाना',
    'search.instantConfirmation': 'शून्य बुकिंग शुल्क · तत्काल पीएनआर पुष्टि',
    'search.from': 'कहाँ से',
    'search.fromPlaceholder': 'प्रस्थान शहर चुनें',
    'search.to': 'कहाँ तक',
    'search.toPlaceholder': 'गंतव्य शहर चुनें',
    'search.date': 'यात्रा की तारीख',
    'search.returnDate': 'वापसी की तारीख',
    'search.passengers': 'यात्री',
    'search.passenger': 'यात्री',
    'search.adults': 'वयस्क',
    'search.adultsAge': '12 वर्ष और अधिक',
    'search.children': 'बच्चे',
    'search.childrenAge': '0–11 वर्ष',
    'search.done': 'हो गया',
    'search.submit': 'बसें खोजें',
    'search.popularCorridors': 'लोकप्रिय मार्ग:',
    'search.selectBoth': 'कृपया प्रस्थान और गंतव्य दोनों शहर चुनें।',
    'search.selectDate': 'कृपया वैध यात्रा तिथि चुनें।',
    'search.differentCities': 'प्रस्थान और गंतव्य शहर अलग-अलग होने चाहिए।',

    // App Section
    'app.badge': 'अगली पीढ़ी की मोबाइल बुकिंग',
    'app.title': 'ऐप डाउनलोड करें और बेफिक्र यात्रा करें',
    'app.subtitle': 'आपकी यात्रा की हर सुविधा एक जगह: लाइव जीपीएस ट्रैकिंग, ऑफलाइन टिकट, आसान सीट अपग्रेड और तत्काल सूचनाएं।',
    'app.digitalTicket': 'डिजिटल टिकट',
    'app.digitalTicketDesc': 'फोन क्यूआर कोड से सीधे बोर्ड करें',
    'app.liveTracking': 'लाइव बस ट्रैकिंग',
    'app.liveTrackingDesc': 'रीयल-टाइम देरी और आगमन समय',
    'app.easyCancel': 'आसान कैंसलेशन',
    'app.easyCancelDesc': 'स्वचालित तत्काल रिफंड क्रेडिट',
    'app.support247': '24/7 समर्पित सहायता',
    'app.support247Desc': 'ऐप में चैट और टोल-फ्री हेल्पलाइन',
    'app.scanQr': 'iOS या Android पर इंस्टॉल करने के लिए स्कैन करें',
    'app.qrAvailable': 'ऐप स्टोर और गूगल प्ले पर उपलब्ध',

    // Core Pillars
    'pillars.badge': 'बस मित्र मानक',
    'pillars.title': 'बस मित्र के साथ यात्रा क्यों करें?',
    'pillars.subtitle': 'आरामदायक यात्रा, सर्वोत्तम किराए की गारंटी और पर्यावरण के अनुकूल परिवहन।',
    'pillars.p1Title': 'पूरे भारत से जुड़ाव',
    'pillars.p1Desc': 'सभी भारतीय राज्यों में 10,000 से अधिक गंतव्यों और लगातार बसों की सुविधा।',
    'pillars.p2Title': 'सफर में पूरा आराम',
    'pillars.p2Desc': 'मुफ़्त हाई-स्पीड वाई-फ़ाई, चार्जिंग पोर्ट, अतिरिक्त लेगरूम और वातानुकूलित केबिन।',
    'pillars.p3Title': 'चुनें, बुक करें, घूमें',
    'pillars.p3Desc': 'अपनी पसंदीदा सीट चुनें, बुकिंग कन्फर्म करें और निश्चिंत होकर यात्रा करें।',
    'pillars.p4Title': 'सामूहिक यात्रा अपनाएं',
    'pillars.p4Desc': 'सड़क पर अतिरिक्त कार क्यों लाएं जब सामूहिक बस यात्रा से 80% तक कम कार्बन उत्सर्जन होता है।',

    // Route Map Banner
    'mapBanner.badge': 'अगला सफर कहाँ?',
    'mapBanner.title': '10,000+ गंतव्यों वाला हमारा रूट मैप देखें',
    'mapBanner.subtitle': 'प्रमुख महानगरों, पर्यटन स्थलों और एक्सप्रेसवे को जोड़ने वाले हमारे विशाल नेटवर्क को एक्सप्लोर करें।',
    'mapBanner.exploreBtn': 'मैप देखें',
    'mapBanner.trackBtn': 'सक्रिय बसें ट्रैक करें',

    // Destinations Section
    'dest.badge': 'नेटवर्क की विशेषताएं',
    'dest.title': 'शीर्ष गंतव्य और बस कनेक्शन',
    'dest.subtitle': 'तुरंत टिकट बुक करने के लिए कोई लोकप्रिय शहर या रूट चुनें।',
    'dest.tabConnections': 'लोकप्रिय कनेक्शन',
    'dest.tabCities': 'प्रमुख शहर',
    'dest.bookNow': 'सीट बुक करें',
    'dest.viewBuses': 'बसें देखें',

    // Travel Guides Accordion
    'guides.title': 'यात्रा गाइड और रूट जानकारी',
    'guides.showLess': 'कम देखें',
    'guides.continueReading': 'आगे पढ़ें',
    'guides.card1Title': 'बस मित्र के साथ सस्ती बस टिकटें पाएं!',
    'guides.card1Desc': 'भारत भर में या प्रमुख एक्सप्रेसवे पर यात्रा करने के लिए बस मित्र के पास 4,00,000 से अधिक दैनिक प्रस्थान हैं। शून्य छिपे शुल्क और आसान 1-क्लिक बुकिंग।',
    'guides.card2Title': 'आपके समय के अनुसार बस रूट और टाइमटेबल',
    'guides.card2Desc': 'आधुनिक एसी स्लीपर और सेमी-स्लीपर बसों, दिन और रात के समय प्रस्थान और सटीक समय-सारिणी के साथ सफर आसान बनाएं।',

    // Bottom App Banner
    'banner.badge': 'डिजिटल टिकट और लाइव ट्रैकिंग',
    'banner.title': 'बस मित्र मोबाइल ऐप डाउनलोड करें',
    'banner.subtitle': 'टिकट ऑफलाइन रखें और लाइव बस लोकेशन देखें।',
    'banner.downloadBtn': 'ऐप डाउनलोड करें',
    'banner.manageBtn': 'बुकिंग प्रबंधित करें',

    // Footer
    'footer.payments': '100% सुरक्षित भुगतान',
    'footer.paymentsDesc': 'एन्क्रिप्टेड त्वरित चेकआउट',
    'footer.paperless': 'डिजिटल पेपरलेस टिकट',
    'footer.paperlessDesc': 'फोन क्यूआर से बोर्ड करें',
    'footer.support': '24/7 समर्पित हेल्पलाइन',
    'footer.supportDesc': 'कॉल करें 1800 200 4455',
    'footer.coaches': 'सत्यापित एसी बसें',
    'footer.coachesDesc': 'स्वच्छ और जीपीएस युक्त',
    'footer.desc': 'भारत का प्रमुख इंटरसिटी बस बुकिंग नेटवर्क। लाइव जीपीएस ट्रैकिंग, प्रीमियम एसी कोच और डिजिटल टिकटिंग।',
    'footer.official': 'आधिकारिक बुकिंग प्लेटफॉर्म',
    'footer.busTravel': 'बस यात्रा',
    'footer.whyUs': 'हमारे साथ क्यों यात्रा करें?',
    'footer.routeNetwork': 'रूट नेटवर्क मैप',
    'footer.liveGps': 'लाइव जीपीएस ट्रैकिंग',
    'footer.destinations': 'गंतव्य',
    'footer.popularCorridors': 'लोकप्रिय कॉरिडोर',
    'footer.allStops': 'सभी बस अड्डे',
    'footer.customerService': 'ग्राहक सेवा',
    'footer.helpFaq': 'मदद और अक्सर पूछे जाने वाले प्रश्न',
    'footer.cancellation': 'रद्दीकरण और रिफंड नीति',
    'footer.luggagePolicy': 'सामान नियम',
    'footer.about': 'बस मित्र के बारे में',
    'footer.sustainability': 'पर्यावरण-अनुकूल बसें',
    'footer.press': 'प्रेस और मीडिया',
    'footer.careers': 'करियर और चालक',
    'footer.operatorPortalLink': 'बस ऑपरेटर लॉगिन',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'नियम और शर्तें',
    'footer.rights': 'सर्वाधिकार सुरक्षित।',
  },

  mr: {
    // Navbar
    'nav.planJourney': 'प्रवासाचे नियोजन करा',
    'nav.liveTracker': 'रिअल-टाइम बस ट्रॅकर',
    'nav.liveTrackerDesc': 'बस क्रमांकाद्वारे थेट स्थान आणि ईटीए तपासा',
    'nav.routeMap': 'मार्ग नेटवर्क नकाशा',
    'nav.routeMapDesc': '10,000+ दैनंदिन कनेक्शन बिंदू पाहा',
    'nav.manageBooking': 'बुकिंग व्यवस्थापित करा',
    'nav.manageBookingDesc': 'तिकीट प्रिंट करा, पीएनआर तपासा किंवा सीट बदला',
    'nav.services': 'सेवा (सामान आणि वाय-फाय)',
    'nav.servicesDesc': 'सामान मर्यादा, वाय-फाय आणि इतर सुविधा',
    'nav.support': 'मदत आणि समर्थन',
    'nav.signIn': 'साइन इन / नोंदणी',
    'nav.myBookings': 'माझे बुकिंग',
    'nav.adminPortal': 'प्रशासक पोर्टल',
    'nav.operatorPortal': 'ऑपरेटर ट्रिप्स',
    'nav.signOut': 'लॉग आउट',
    'nav.language': 'भाषा',

    // Hero Section
    'hero.badge': 'अखिल भारतीय इंटरसिटी कोच नेटवर्क · 10,000+ दैनंदिन मार्ग',
    'hero.exploreMap': 'नकाशा पाहा',
    'hero.liveTracker': 'थेट ट्रॅकर',
    'hero.expressCorridors': 'एक्सप्रेस सुवर्ण कॉरिडॉर',
    'hero.title': 'भारतभर बस प्रवास,',
    'hero.titleAccent': 'आसन दर आसन.',
    'hero.subtitle': 'तुमची पसंतीची सीट निवडा, बसचे थेट ट्रॅकिंग करा आणि फोनवर डिजिटल तिकीट मिळवा. दैनंदिन व्होल्वो एक्सप्रेस आणि लक्झरी स्लीपर बसेस.',
    'hero.zeroFee': 'शून्य बुकिंग शुल्क',
    'hero.gpsTracking': 'थेट जीपीएस ट्रॅकिंग',
    'hero.instantTicket': 'त्वरित एम-तिकीट',

    // Search Form
    'search.oneway': 'एकेरी प्रवास',
    'search.roundtrip': 'फेरी प्रवास',
    'search.instantConfirmation': 'शून्य बुकिंग शुल्क · त्वरित पीएनआर पुष्टी',
    'search.from': 'कुठून',
    'search.fromPlaceholder': 'प्रवासाचे शहर निवडा',
    'search.to': 'कुठे',
    'search.toPlaceholder': 'पोहोचण्याचे शहर निवडा',
    'search.date': 'प्रवासाची तारीख',
    'search.returnDate': 'परतीची तारीख',
    'search.passengers': 'प्रवासी',
    'search.passenger': 'प्रवासी',
    'search.adults': 'प्रौढ',
    'search.adultsAge': 'वय १२ आणि अधिक',
    'search.children': 'मुले',
    'search.childrenAge': 'वय ०-११ वर्षे',
    'search.done': 'पूर्ण झाले',
    'search.submit': 'बसेस शोधा',
    'search.popularCorridors': 'लोकप्रिय मार्ग:',
    'search.selectBoth': 'कृपया प्रवासाचे आणि पोहोचण्याचे दोन्ही शहर निवडा.',
    'search.selectDate': 'कृपया वैध प्रवासाची तारीख निवडा.',
    'search.differentCities': 'सुरुवात आणि शेवटचे शहर वेगवेगळे असावे.',

    // App Section
    'app.badge': 'पुढील पिढीचे मोबाइल बुकिंग',
    'app.title': 'ॲप डाउनलोड करा आणि निश्चिंत प्रवास करा',
    'app.subtitle': 'तुमच्या प्रवासासाठी सर्वकाही एकाच ठिकाणी: थेट जीपीएस ट्रॅकिंग, ऑफलाइन तिकिटे, सोपे सीट अपग्रेड आणि त्वरित सूचना.',
    'app.digitalTicket': 'डिजिटल तिकीट',
    'app.digitalTicketDesc': 'फोनवरील क्यूआर कोडने थेट बसमध्ये चढा',
    'app.liveTracking': 'थेट बस ट्रॅकिंग',
    'app.liveTrackingDesc': 'रिअल-टाइम आगमन वेळ आणि विलंब माहिती',
    'app.easyCancel': 'सोपे रद्दीकरण',
    'app.easyCancelDesc': 'स्वयंचलित त्वरित परतावा',
    'app.support247': '२४/७ समर्पित ग्राहक सेवा',
    'app.support247Desc': 'ॲप चॅट आणि टोल-फ्री हेल्पलाइन',
    'app.scanQr': 'iOS किंवा Android वर इंस्टॉल करण्यासाठी स्कॅन करा',
    'app.qrAvailable': 'ॲप स्टोअर आणि गुगल प्लेवर उपलब्ध',

    // Core Pillars
    'pillars.badge': 'बसमित्र मानके',
    'pillars.title': 'बसमित्र सोबत प्रवास का करावा?',
    'pillars.subtitle': 'आरामदायी प्रवास, उत्तम भाड्याची खात्री आणि पर्यावरणपूरक सामूहिक वाहतूक.',
    'pillars.p1Title': 'संपूर्ण भारताशी जोडणी',
    'pillars.p1Desc': 'सर्व भारतीय राज्यांमध्ये १०,००० हून अधिक गंतव्ये आणि वारंवार उपलब्ध बसेस.',
    'pillars.p2Title': 'प्रवासात पूर्ण आराम',
    'pillars.p2Desc': 'मोफत हाय-स्पीड वाय-फाय, चार्जिंग पॉइंट, अधिक लेगरूम आणि वातानुकूलित केबिन.',
    'pillars.p3Title': 'निवडा, बुक करा, प्रवास करा',
    'pillars.p3Desc': 'आवडती सीट निवडा, बुकिंग निश्चित करा आणि आनंदाने प्रवास करा.',
    'pillars.p4Title': 'एकत्र प्रवास करा',
    'pillars.p4Desc': 'सामूहिक बस प्रवासाने प्रति प्रवासी ८०% पर्यंत कमी कार्बन उत्सर्जन होते.',

    // Route Map Banner
    'mapBanner.badge': 'पुढील प्रवास कुठे?',
    'mapBanner.title': '१०,०००+ गंतव्ये असलेला आमचा नकाशा शोधा',
    'mapBanner.subtitle': 'प्रमुख शहरे, पर्यटन स्थळे आणि महामार्गांना जोडणारे आमचे नेटवर्क पाहा.',
    'mapBanner.exploreBtn': 'नकाशा उघडा',
    'mapBanner.trackBtn': 'सक्रिय बसेस ट्रॅक करा',

    // Destinations Section
    'dest.badge': 'नेटवर्क हायलाइट्स',
    'dest.title': 'प्रमुख गंतव्ये आणि बस मार्ग',
    'dest.subtitle': 'त्वरित तिकीट बुक करण्यासाठी लोकप्रिय शहर किंवा मार्ग निवडा.',
    'dest.tabConnections': 'लोकप्रिय मार्ग',
    'dest.tabCities': 'प्रमुख शहरे',
    'dest.bookNow': 'सीट बुक करा',
    'dest.viewBuses': 'बसेस पाहा',

    // Travel Guides Accordion
    'guides.title': 'प्रवास मार्गदर्शक आणि माहिती',
    'guides.showLess': 'कमी दाखवा',
    'guides.continueReading': 'पुढे वाचा',
    'guides.card1Title': 'बसमित्र सोबत स्वस्त बस तिकिटे मिळवा!',
    'guides.card1Desc': 'भारतात कुठेही प्रवास करण्यासाठी बसमित्रकडे दररोज ४,००,००० पेक्षा जास्त बसेस उपलब्ध आहेत. कोणतेही छुपे शुल्क नाही.',
    'guides.card2Title': 'तुमच्या वेळेनुसार बस मार्ग आणि वेळापत्रक',
    'guides.card2Desc': 'आधुनिक एसी स्लीपर बसेस, दिवसा आणि रात्रीच्या फेऱ्या आणि वेळेचे अचूक नियोजन.',

    // Bottom App Banner
    'banner.badge': 'डिजिटल तिकीट आणि थेट ट्रॅकिंग',
    'banner.title': 'बसमित्र मोबाइल ॲप वापरा',
    'banner.subtitle': 'तिकीट ऑफलाइन ठेवा आणि बसचे थेट लोकेशन पाहा.',
    'banner.downloadBtn': 'ॲप डाउनलोड करा',
    'banner.manageBtn': 'बुकिंग व्यवस्थापित करा',

    // Footer
    'footer.payments': '१००% सुरक्षित पेमेंट',
    'footer.paymentsDesc': 'सुरक्षित त्वरित व्यवहार',
    'footer.paperless': 'डिजिटल कागदविरहित तिकीट',
    'footer.paperlessDesc': 'फोन क्यूआर कोडने प्रवास करा',
    'footer.support': '२४/७ समर्पित ग्राहक सेवा',
    'footer.supportDesc': 'कॉल करा १८०० २०० ४४५५',
    'footer.coaches': 'सत्यापित एसी बसेस',
    'footer.coachesDesc': 'स्वच्छ आणि जीपीएस मॉनिटर केलेले',
    'footer.desc': 'भारताचे प्रीमियर इंटरसिटी बस बुकिंग नेटवर्क. थेट जीपीएस ट्रॅकिंग, लक्झरी एसी कोच आणि पेपरलेस बोर्डिंग.',
    'footer.official': 'अधिकृत बुकिंग प्लॅटफॉर्म',
    'footer.busTravel': 'बस प्रवास',
    'footer.whyUs': 'आमच्यासोबत का प्रवास करावा?',
    'footer.routeNetwork': 'मार्ग नेटवर्क नकाशा',
    'footer.liveGps': 'थेट जीपीएस ट्रॅकिंग',
    'footer.destinations': 'गंतव्ये',
    'footer.popularCorridors': 'लोकप्रिय कॉरिडॉर',
    'footer.allStops': 'सर्व बस स्थानके',
    'footer.customerService': 'ग्राहक सेवा',
    'footer.helpFaq': 'मदत आणि वारंवार विचारले जाणारे प्रश्न',
    'footer.cancellation': 'रद्दीकरण आणि परतावा धोरण',
    'footer.luggagePolicy': 'सामान नियम',
    'footer.about': 'बसमित्र बद्दल',
    'footer.sustainability': 'पर्यावरणपूरक बस सेवा',
    'footer.press': 'प्रेस आणि मीडिया',
    'footer.careers': 'करिअर आणि चालक',
    'footer.operatorPortalLink': 'बस ऑपरेटर लॉगिन',
    'footer.privacy': 'गोपनीयता धोरण',
    'footer.terms': 'नियम आणि अटी',
    'footer.rights': 'सर्व हक्क राखीव.',
  },

  kn: {
    // Navbar
    'nav.planJourney': 'ನಿಮ್ಮ ಪ್ರಯಾಣ ಯೋಜಿಸಿ',
    'nav.liveTracker': 'ಲೈವ್ ಬಸ್ ಟ್ರ್ಯಾಕರ್',
    'nav.liveTrackerDesc': 'ಬಸ್ ಸಂಖ್ಯೆಯಿಂದ ನೇರ ಸ್ಥಳ ಮತ್ತು ಆಗಮನ ಸಮಯ ಪರಿಶೀಲಿಸಿ',
    'nav.routeMap': 'ಮಾರ್ಗ ನಕ್ಷೆ',
    'nav.routeMapDesc': '10,000+ ದೈನಂದಿನ ಸಂಪರ್ಕ ಬಿಂದುಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    'nav.manageBooking': 'ಬುಕಿಂಗ್ ನಿರ್ವಹಣೆ',
    'nav.manageBookingDesc': 'ಟಿಕೆಟ್ ಮುದ್ರಿಸಿ, PNR ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಸೀಟು ಬದಲಾಯಿಸಿ',
    'nav.services': 'ಸೇವೆಗಳು (ಸಾಮಾನು ಮತ್ತು ವೈ-ಫೈ)',
    'nav.servicesDesc': 'ಸಾಮಾನು ನಿಯಮಗಳು, ವೈ-ಫೈ ಮತ್ತು ಸೌಲಭ್ಯಗಳು',
    'nav.support': 'ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ',
    'nav.signIn': 'ಸೈನ್ ಇನ್ / ನೋಂದಣಿ',
    'nav.myBookings': 'ನನ್ನ ಬುಕಿಂಗ್ಸ್',
    'nav.adminPortal': 'ನಿರ್ವಾಹಕ ಪೋರ್ಟಲ್',
    'nav.operatorPortal': 'ಆಪರೇಟರ್ ಟ್ರಿಪ್ಸ್',
    'nav.signOut': 'ಸೈನ್ ಔಟ್',
    'nav.language': 'ಭಾಷೆ',

    // Hero Section
    'hero.badge': 'ಅಖಿಲ ಭಾರತ ಇಂಟರ್‌ಸಿಟಿ ಕೋಚ್ ನೆಟ್‌ವರ್ಕ್ · 10,000+ ದೈನಂದಿನ ಮಾರ್ಗಗಳು',
    'hero.exploreMap': 'ನಕ್ಷೆ ನೋಡಿ',
    'hero.liveTracker': 'ಲೈವ್ ಟ್ರ್ಯಾಕರ್',
    'hero.expressCorridors': 'ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಸುವರ್ಣ ಕಾರಿಡಾರ್‌ಗಳು',
    'hero.title': 'ಭಾರತದಾದ್ಯಂತ ಬಸ್ ಪ್ರಯಾಣ,',
    'hero.titleAccent': 'ಸೀಟುಗಳೊಂದಿಗೆ.',
    'hero.subtitle': 'ನಿಮಗೆ ಬೇಕಾದ ಸೀಟನ್ನು ಆಯ್ಕೆಮಾಡಿ, ನೈಜ ಸಮಯದಲ್ಲಿ ಬಸ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲಿ ಡಿಜಿಟಲ್ ಟಿಕೆಟ್ ಪಡೆಯಿರಿ. ದೈನಂದಿನ ವೋಲ್ವೋ ಮತ್ತು ಐಷಾರಾಮಿ ಸ್ಲೀಪರ್ ಬಸ್‌ಗಳು.',
    'hero.zeroFee': 'ಶೂನ್ಯ ಬುಕಿಂಗ್ ಶುಲ್ಕ',
    'hero.gpsTracking': 'ಲೈವ್ ಜಿಪಿಎಸ್ ಟ್ರ್ಯಾಕಿಂಗ್',
    'hero.instantTicket': 'ತಕ್ಷಣದ ಎಂ-ಟಿಕೆಟ್',

    // Search Form
    'search.oneway': 'ಒಂದು ಮಾರ್ಗ',
    'search.roundtrip': 'ರೌಂಡ್ ಟ್ರಿಪ್',
    'search.instantConfirmation': 'ಶೂನ್ಯ ಬುಕಿಂಗ್ ಶುಲ್ಕ · ತಕ್ಷಣದ PNR ದೃಢೀಕರಣ',
    'search.from': 'ಎಲ್ಲಿಂದ',
    'search.fromPlaceholder': 'ನಿರ್ಗಮನ ನಗರ ಆಯ್ಕೆಮಾಡಿ',
    'search.to': 'ಎಲ್ಲಿಗೆ',
    'search.toPlaceholder': 'ತಲುಪುವ ನಗರ ಆಯ್ಕೆಮಾಡಿ',
    'search.date': 'ಪ್ರಯಾಣ ದಿನಾಂಕ',
    'search.returnDate': 'ಹಿಂತಿರುಗುವ ದಿನಾಂಕ',
    'search.passengers': 'ಪ್ರಯಾಣಿಕರು',
    'search.passenger': 'ಪ್ರಯಾಣಿಕ',
    'search.adults': 'ವಯಸ್ಕರು',
    'search.adultsAge': '12 ವರ್ಷ ಮತ್ತು ಮೇಲ್ಪಟ್ಟವರು',
    'search.children': 'ಮಕ್ಕಳು',
    'search.childrenAge': '0-11 ವರ್ಷಗಳು',
    'search.done': 'ಮುಗಿಯಿತು',
    'search.submit': 'ಬಸ್ ಹುಡುಕಿ',
    'search.popularCorridors': 'ಜನಪ್ರಿಯ ಮಾರ್ಗಗಳು:',
    'search.selectBoth': 'ದಯವಿಟ್ಟು ನಿರ್ಗಮನ ಮತ್ತು ಗಮ್ಯಸ್ಥಾನ ನಗರಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    'search.selectDate': 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ಪ್ರಯಾಣ ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    'search.differentCities': 'ಆರಂಭಿಕ ಮತ್ತು ಗಮ್ಯಸ್ಥಾನ ನಗರಗಳು ವಿಭಿನ್ನವಾಗಿರಬೇಕು.',

    // App Section
    'app.badge': 'ಮುಂದಿನ ಪೀಳಿಗೆಯ ಮೊಬೈಲ್ ಬುಕಿಂಗ್',
    'app.title': 'ಅಪ್ಲಿಕೇಶನ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ನೆಮ್ಮದಿಯಿಂದ ಪ್ರಯಾಣಿಸಿ',
    'app.subtitle': 'ನಿಮ್ಮ ಪ್ರಯಾಣದ ಎಲ್ಲಾ ವಿವರಗಳು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ: ಲೈವ್ ಜಿಪಿಎಸ್ ಟ್ರ್ಯಾಕಿಂಗ್, ಆಫ್‌ಲೈನ್ ಬೋರ್ಡಿಂಗ್ ಟಿಕೆಟ್‌ಗಳು ಮತ್ತು ತಕ್ಷಣದ ಮಾಹಿತಿ.',
    'app.digitalTicket': 'ಡಿಜಿಟಲ್ ಟಿಕೆಟ್',
    'app.digitalTicketDesc': 'ಫೋನ್ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಬಸ್ ಹತ್ತಿ',
    'app.liveTracking': 'ಲೈವ್ ಬಸ್ ಟ್ರ್ಯಾಕಿಂಗ್',
    'app.liveTrackingDesc': 'ನೈಜ ಸಮಯದ ಆಗಮನ ವಿವರಗಳು',
    'app.easyCancel': 'ಸುಲಭ ರದ್ದತಿ',
    'app.easyCancelDesc': 'ಸ್ವಯಂಚಾಲಿತ ತಕ್ಷಣದ ಮರುಪಾವತಿ',
    'app.support247': '24/7 ಮೀಸಲಾದ ಬೆಂಬಲ',
    'app.support247Desc': 'ಅಪ್ಲಿಕೇಶನ್ ಚಾಟ್ ಮತ್ತು ಟೋಲ್-ಫ್ರೀ ಸಹಾಯವಾಣಿ',
    'app.scanQr': 'iOS ಅಥವಾ Android ನಲ್ಲಿ ಸ್ಥಾಪಿಸಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    'app.qrAvailable': 'ಆಪ್ ಸ್ಟೋರ್ ಮತ್ತು ಗೂಗಲ್ ಪ್ಲೇನಲ್ಲಿ ಲಭ್ಯವಿದೆ',

    // Core Pillars
    'pillars.badge': 'ಬಸ್‌ಮಿತ್ರ ಗುಣಮಟ್ಟ',
    'pillars.title': 'ಬಸ್‌ಮಿತ್ರ ಜೊತೆ ಏಕೆ ಪ್ರಯಾಣಿಸಬೇಕು?',
    'pillars.subtitle': 'ಆರಾಮದಾಯಕ ಪ್ರಯಾಣ, ಉತ್ತಮ ದರಗಳ ಖಾತರಿ ಮತ್ತು ಪರಿಸರ ಸ್ನೇಹಿ ಸಮೂಹ ಸಾರಿಗೆ.',
    'pillars.p1Title': 'ಭಾರತದೊಂದಿಗೆ ಸಂಪರ್ಕ',
    'pillars.p1Desc': 'ಎಲ್ಲಾ ಭಾರತೀಯ ರಾಜ್ಯಗಳಲ್ಲಿ 10,000 ಕ್ಕೂ ಹೆಚ್ಚು ತಾಣಗಳು ಮತ್ತು ನಿರಂತರ ಬಸ್ಸುಗಳು.',
    'pillars.p2Title': 'ಪ್ರಯಾಣದಲ್ಲಿ ಆರಾಮ',
    'pillars.p2Desc': 'ಉಚಿತ ಹೈ-ಸ್ಪೀಡ್ ವೈ-ಫೈ, ಚಾರ್ಜಿಂಗ್ ಪಾಯಿಂಟ್‌ಗಳು ಮತ್ತು ಹವಾನಿಯಂತ್ರಿತ ಕ್ಯಾಬಿನ್‌ಗಳು.',
    'pillars.p3Title': 'ಆಯ್ಕೆಮಾಡಿ, ಬುಕ್ ಮಾಡಿ, ಪ್ರಯಾಣಿಸಿ',
    'pillars.p3Desc': 'ನಿಮ್ಮ ನೆಚ್ಚಿನ ಸೀಟು ಆರಿಸಿ, ಬುಕಿಂಗ್ ಖಚಿತಪಡಿಸಿ ಮತ್ತು ಸಂತೋಷದಿಂದ ಪ್ರಯಾಣಿಸಿ.',
    'pillars.p4Title': 'ಒಟ್ಟಾಗಿ ಸಾಗಿ',
    'pillars.p4Desc': 'ಸಾಮೂಹಿಕ ಬಸ್ ಪ್ರಯಾಣದಿಂದ ಪ್ರತಿ ಪ್ರಯಾಣಿಕನಿಗೆ ಶೇ. 80 ರಷ್ಟು ಕಡಿಮೆ ಇಂಗಾಲದ ಹೊರಸೂಸುವಿಕೆ.',

    // Route Map Banner
    'mapBanner.badge': 'ಮುಂದೆ ಎಲ್ಲಿಗೆ?',
    'mapBanner.title': '10,000+ ತಾಣಗಳ ನಮ್ಮ ಮಾರ್ಗ ನಕ್ಷೆಯನ್ನು ಅನ್ವೇಷಿಸಿ',
    'mapBanner.subtitle': 'ಪ್ರಮುಖ ಮೆಟ್ರೋ ನಗರಗಳು, ಪ್ರವಾಸಿ ತಾಣಗಳು ಮತ್ತು ಹೆದ್ದಾರಿಗಳನ್ನು ಸಂಪರ್ಕಿಸುವ ನಮ್ಮ ನೆಟ್‌ವರ್ಕ್ ನೋಡಿ.',
    'mapBanner.exploreBtn': 'ನಕ್ಷೆ ನೋಡಿ',
    'mapBanner.trackBtn': 'ಸಕ್ರಿಯ ಬಸ್‌ಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',

    // Destinations Section
    'dest.badge': 'ನೆಟ್‌ವರ್ಕ್ ಮುಖ್ಯಾಂಶಗಳು',
    'dest.title': 'ಪ್ರಮುಖ ತಾಣಗಳು ಮತ್ತು ಬಸ್ ಮಾರ್ಗಗಳು',
    'dest.subtitle': 'ತಕ್ಷಣ ಟಿಕೆಟ್ ಕಾಯ್ದಿರಿಸಲು ಜನಪ್ರಿಯ ನಗರ ಅಥವಾ ಮಾರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    'dest.tabConnections': 'ಜನಪ್ರಿಯ ಸಂಪರ್ಕಗಳು',
    'dest.tabCities': 'ಪ್ರಮುಖ ನಗರಗಳು',
    'dest.bookNow': 'ಸೀಟು ಬುಕ್ ಮಾಡಿ',
    'dest.viewBuses': 'ಬಸ್‌ಗಳನ್ನು ನೋಡಿ',

    // Travel Guides Accordion
    'guides.title': 'ಪ್ರಯಾಣ ಮಾರ್ಗದರ್ಶಿ ಮತ್ತು ಮಾಹಿತಿ',
    'guides.showLess': 'ಕಡಿಮೆ ತೋರಿಸಿ',
    'guides.continueReading': 'ಮುಂದೆ ಓದಿ',
    'guides.card1Title': 'ಬಸ್‌ಮಿತ್ರ ಜೊತೆ ಕೈಗೆಟುಕುವ ಬಸ್ ಟಿಕೆಟ್‌ಗಳನ್ನು ಪಡೆಯಿರಿ!',
    'guides.card1Desc': 'ಭಾರತದಾದ್ಯಂತ ಪ್ರಯಾಣಿಸಲು ಬಸ್‌ಮಿತ್ರದಲ್ಲಿ ಪ್ರತಿದಿನ 4,00,000 ಕ್ಕೂ ಹೆಚ್ಚು ನಿರ್ಗಮನಗಳು ಲಭ್ಯವಿದೆ. ಯಾವುದೇ ಗುಪ್ತ ಶುಲ್ಕಗಳಿಲ್ಲ.',
    'guides.card2Title': 'ನಿಮ್ಮ ವೇಳಾಪಟ್ಟಿಗೆ ತಕ್ಕಂತೆ ಬಸ್ ಮಾರ್ಗಗಳು',
    'guides.card2Desc': 'ಆಧುನಿಕ ಎಸಿ ಸ್ಲೀಪರ್ ಬಸ್‌ಗಳು, ಹಗಲು ಮತ್ತು ರಾತ್ರಿಯ ನಿರ್ಗಮನಗಳು ಮತ್ತು ನಿಖರ ವೇಳಾಪಟ್ಟಿ.',

    // Bottom App Banner
    'banner.badge': 'ಡಿಜಿಟಲ್ ಟಿಕೆಟ್ ಮತ್ತು ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್',
    'banner.title': 'ಬಸ್‌ಮಿತ್ರ ಮೊಬೈಲ್ ಅಪ್ಲಿಕೇಶನ್ ಬಳಸಿ',
    'banner.subtitle': 'ಟಿಕೆಟ್‌ಗಳನ್ನು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿಡಿ ಮತ್ತು ನೈಜ ಸಮಯದ ಲೈವ್ ಬಸ್ ಸ್ಥಳವನ್ನು ಪರಿಶೀಲಿಸಿ.',
    'banner.downloadBtn': 'ಅಪ್ಲಿಕೇಶನ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    'banner.manageBtn': 'ಬುಕಿಂಗ್ ನಿರ್ವಹಿಸಿ',

    // Footer
    'footer.payments': '100% ಸುರಕ್ಷಿತ ಪಾವತಿಗಳು',
    'footer.paymentsDesc': 'ಸುರಕ್ಷಿತ ತ್ವರಿತ ಚೆಕ್‌ಔಟ್',
    'footer.paperless': 'ಡಿಜಿಟಲ್ ಕಾಗದರಹಿತ ಟಿಕೆಟ್‌ಗಳು',
    'footer.paperlessDesc': 'ಫೋನ್ ಕ್ಯೂಆರ್ ಕೋಡ್‌ನೊಂದಿಗೆ ಬಸ್ ಹತ್ತಿ',
    'footer.support': '24/7 ಮೀಸಲಾದ ಗ್ರಾಹಕ ಸೇವೆ',
    'footer.supportDesc': 'ಕರೆ ಮಾಡಿ 1800 200 4455',
    'footer.coaches': 'ಪರಿಶೀಲಿಸಿದ ಎಸಿ ಬಸ್‌ಗಳು',
    'footer.coachesDesc': 'ಸ್ವಚ್ಛ ಮತ್ತು ಜಿಪಿಎಸ್ ಮೇಲ್ವಿಚಾರಣೆ',
    'footer.desc': 'ಭಾರತದ ಪ್ರಮುಖ ಇಂಟರ್‌ಸಿಟಿ ಬಸ್ ಬುಕಿಂಗ್ ನೆಟ್‌ವರ್ಕ್. ಲೈವ್ ಜಿಪಿಎಸ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ಕಾಗದರಹಿತ ಬೋರ್ಡಿಂಗ್.',
    'footer.official': 'ಅಧಿಕೃತ ಬುಕಿಂಗ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್',
    'footer.busTravel': 'ಬಸ್ ಪ್ರಯಾಣ',
    'footer.whyUs': 'ನಮ್ಮೊಂದಿಗೆ ಏಕೆ ಪ್ರಯಾಣಿಸಬೇಕು?',
    'footer.routeNetwork': 'ಮಾರ್ಗ ನಕ್ಷೆ',
    'footer.liveGps': 'ಲೈವ್ ಜಿಪಿಎಸ್ ಟ್ರ್ಯಾಕಿಂಗ್',
    'footer.destinations': 'ತಾಣಗಳು',
    'footer.popularCorridors': 'ಜನಪ್ರಿಯ ಕಾರಿಡಾರ್‌ಗಳು',
    'footer.allStops': 'ಎಲ್ಲಾ ಟರ್ಮಿನಲ್‌ಗಳು',
    'footer.customerService': 'ಗ್ರಾಹಕ ಸೇವೆ',
    'footer.helpFaq': 'ಸಹಾಯ ಮತ್ತು FAQ',
    'footer.cancellation': 'ರದ್ದತಿ ಮತ್ತು ಮರುಪಾವತಿ ನೀತಿ',
    'footer.luggagePolicy': 'ಸಾಮಾನು ನಿಯಮಗಳು',
    'footer.about': 'ಬಸ್‌ಮಿತ್ರ ಕುರಿತು',
    'footer.sustainability': 'ಪರಿಸರಸ್ನೇಹಿ ಸಾರಿಗೆ',
    'footer.press': 'ಸುದ್ದಿ ಮತ್ತು ಮಾಧ್ಯಮ',
    'footer.careers': 'ಉದ್ಯೋಗಗಳು ಮತ್ತು ಚಾಲಕರು',
    'footer.operatorPortalLink': 'ಬಸ್ ಆಪರೇಟರ್ ಸೈನ್ ಇನ್',
    'footer.privacy': 'ಗೌಪ್ಯತೆ ನೀತಿ',
    'footer.terms': 'ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು',
    'footer.rights': 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('bbms_language') || 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (langCode) => {
    if (TRANSLATIONS[langCode]) {
      setLanguageState(langCode);
      try {
        localStorage.setItem('bbms_language', langCode);
      } catch {
        // Ignore localStorage error
      }
      document.documentElement.lang = langCode;
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key, fallback = '') => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    if (TRANSLATIONS.en && TRANSLATIONS.en[key] !== undefined) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLangMeta,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return graceful fallback if rendered outside provider
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key, fallback = '') => fallback || key,
      currentLangMeta: SUPPORTED_LANGUAGES[0],
      supportedLanguages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
};
