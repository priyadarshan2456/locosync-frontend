/**
 * LocoSync Transit Dataset - MTC Chennai Fleet & GTFS Data
 * Agency: MTC (Metropolitan Transport Corporation, Chennai, India)
 * Web: https://mtcbus.tn.gov.in
 */

export const AGENCY_INFO = {
  id: "69",
  name: "MTC (Metropolitan Transport Corporation)",
  url: "https://mtcbus.tn.gov.in",
  timezone: "Asia/Kolkata",
  helpline: "9445030516",
  city: "Chennai"
};

export const INITIAL_ROUTES = [
  {
    id: "route-21G",
    number: "21G",
    name: "Broadway Terminal ➔ Tambaram Sanatorium",
    type: "Deluxe Express",
    color: "#2563eb", // Royal Blue
    status: "Active",
    stops: [
      { id: "st-21g-1", name: "Broadway Bus Terminus", lat: 13.0890, lng: 80.2865, isTransfer: true },
      { id: "st-21g-2", name: "Marina Beach / Light House", lat: 13.0398, lng: 80.2790, isTransfer: false },
      { id: "st-21g-3", name: "Mylapore Luz Corner", lat: 13.0335, lng: 80.2642, isTransfer: true },
      { id: "st-21g-4", name: "Saidapet Metro Junction", lat: 13.0210, lng: 80.2220, isTransfer: true },
      { id: "st-21g-5", name: "Guindy Industrial Estate", lat: 13.0080, lng: 80.2080, isTransfer: true },
      { id: "st-21g-6", name: "Chromepet GST Road", lat: 12.9515, lng: 80.1410, isTransfer: false },
      { id: "st-21g-7", name: "Tambaram Sanatorium", lat: 12.9340, lng: 80.1220, isTransfer: true }
    ],
    waypoints: [
      [13.0890, 80.2865],
      [13.0650, 80.2830],
      [13.0398, 80.2790],
      [13.0335, 80.2642],
      [13.0280, 80.2430],
      [13.0210, 80.2220],
      [13.0080, 80.2080],
      [12.9850, 80.1800],
      [12.9650, 80.1550],
      [12.9515, 80.1410],
      [12.9340, 80.1220]
    ]
  },
  {
    id: "route-570",
    number: "570",
    name: "CMBT Koyambedu ➔ Siruseri IT Park (OMR)",
    type: "IT Express (AC)",
    color: "#10b981", // Emerald
    status: "Active",
    stops: [
      { id: "st-570-1", name: "CMBT Bus Terminal", lat: 13.0674, lng: 80.1947, isTransfer: true },
      { id: "st-570-2", name: "Ashok Nagar Metro Pillar", lat: 13.0350, lng: 80.2110, isTransfer: true },
      { id: "st-570-3", name: "Guindy Kathipara Flyover", lat: 13.0067, lng: 80.2025, isTransfer: true },
      { id: "st-570-4", name: "Velachery MRTS Station", lat: 12.9800, lng: 80.2180, isTransfer: true },
      { id: "st-570-5", name: "Tidel Park / Thiruvanmiyur", lat: 12.9890, lng: 80.2510, isTransfer: true },
      { id: "st-570-6", name: "Thoraipakkam OMR Junction", lat: 12.9380, lng: 80.2340, isTransfer: false },
      { id: "st-570-7", name: "Siruseri SIPCOT IT Park", lat: 12.8250, lng: 80.2190, isTransfer: false }
    ],
    waypoints: [
      [13.0674, 80.1947],
      [13.0500, 80.2030],
      [13.0350, 80.2110],
      [13.0067, 80.2025],
      [12.9800, 80.2180],
      [12.9890, 80.2510],
      [12.9600, 80.2440],
      [12.9380, 80.2340],
      [12.8800, 80.2280],
      [12.8250, 80.2190]
    ]
  },
  {
    id: "route-19B",
    number: "19B",
    name: "T. Nagar Depot ➔ Kelambakkam Junction",
    type: "OMR Feeder",
    color: "#f59e0b", // Amber
    status: "Delayed",
    stops: [
      { id: "st-19b-1", name: "T. Nagar Bus Terminus", lat: 13.0418, lng: 80.2341, isTransfer: true },
      { id: "st-19b-2", name: "Saidapet Teachers College", lat: 13.0230, lng: 80.2235, isTransfer: true },
      { id: "st-19b-3", name: "Madhya Kailash Temple", lat: 13.0085, lng: 80.2485, isTransfer: true },
      { id: "st-19b-4", name: "Kandanchavadi Tech Hub", lat: 12.9640, lng: 80.2460, isTransfer: false },
      { id: "st-19b-5", name: "Sholinganallur Junction", lat: 12.8980, lng: 80.2290, isTransfer: true },
      { id: "st-19b-6", name: "Kelambakkam Bus Station", lat: 12.7870, lng: 80.2210, isTransfer: false }
    ],
    waypoints: [
      [13.0418, 80.2341],
      [13.0230, 80.2235],
      [13.0085, 80.2485],
      [12.9890, 80.2510],
      [12.9640, 80.2460],
      [12.9380, 80.2340],
      [12.8980, 80.2290],
      [12.8500, 80.2250],
      [12.7870, 80.2210]
    ]
  },
  {
    id: "route-29C",
    number: "29C",
    name: "Perambur Railway Station ➔ Besant Nagar Beach",
    type: "City Regular",
    color: "#8b5cf6", // Violet
    status: "Active",
    stops: [
      { id: "st-29c-1", name: "Perambur Railway Station", lat: 13.1110, lng: 80.2330, isTransfer: true },
      { id: "st-29c-2", name: "Egmore Railway Station", lat: 13.0780, lng: 80.2610, isTransfer: true },
      { id: "st-29c-3", name: "Gemini Flyover (Anna Salai)", lat: 13.0530, lng: 80.2505, isTransfer: true },
      { id: "st-29c-4", name: "Adyar Signal Junction", lat: 13.0060, lng: 80.2560, isTransfer: true },
      { id: "st-29c-5", name: "Besant Nagar Beach Depot", lat: 12.9995, lng: 80.2680, isTransfer: false }
    ],
    waypoints: [
      [13.1110, 80.2330],
      [13.0900, 80.2450],
      [13.0780, 80.2610],
      [13.0650, 80.2550],
      [13.0530, 80.2505],
      [13.0280, 80.2530],
      [13.0060, 80.2560],
      [12.9995, 80.2680]
    ]
  }
];

export const INITIAL_BUSES = [
  {
    id: "BUS-21G-A",
    routeId: "route-21G",
    busNumber: "21G",
    model: "Ashok Leyland 12M Viking Deluxe",
    plateNumber: "TN 01 AN 3291",
    driver: {
      name: "Murugan Selvam",
      rating: 4.9,
      phone: "+91 94450 30516",
      tripsToday: 6
    },
    capacity: 54,
    occupancy: 42,
    speed: 38,
    heading: 200,
    status: "ON_TIME",
    delayMinutes: 0,
    isElectric: false,
    isAC: true,
    hasWifi: true,
    isWheelchairAccessible: true,
    progress: 0.35,
    currentStopIndex: 2,
    nextStop: "Saidapet Metro Junction",
    etaMinutes: 3,
    fuelLevel: 76
  },
  {
    id: "BUS-570-AC",
    routeId: "route-570",
    busNumber: "570-AC",
    model: "Tata Starbus Ultra AC Low-Floor",
    plateNumber: "TN 01 AP 8920",
    driver: {
      name: "Karthik Subramanian",
      rating: 4.8,
      phone: "+91 94450 30516",
      tripsToday: 5
    },
    capacity: 50,
    occupancy: 36,
    speed: 46,
    heading: 175,
    status: "APPROACHING",
    delayMinutes: 1,
    isElectric: true,
    isAC: true,
    hasWifi: true,
    isWheelchairAccessible: true,
    progress: 0.58,
    currentStopIndex: 4,
    nextStop: "Thoraipakkam OMR Junction",
    etaMinutes: 2,
    batteryLevel: 84
  },
  {
    id: "BUS-19B-A",
    routeId: "route-19B",
    busNumber: "19B",
    model: "Switch Mobility EiV12 Electric",
    plateNumber: "TN 09 BG 5504",
    driver: {
      name: "Dhanush Kumar",
      rating: 4.7,
      phone: "+91 94450 30516",
      tripsToday: 4
    },
    capacity: 52,
    occupancy: 50, // Crowded
    speed: 21,
    heading: 180,
    status: "DELAYED",
    delayMinutes: 7,
    isElectric: true,
    isAC: false,
    hasWifi: false,
    isWheelchairAccessible: true,
    progress: 0.45,
    currentStopIndex: 2,
    nextStop: "Madhya Kailash Temple",
    etaMinutes: 6,
    batteryLevel: 69
  },
  {
    id: "BUS-29C-A",
    routeId: "route-29C",
    busNumber: "29C",
    model: "Ashok Leyland BS-VI Smart City",
    plateNumber: "TN 01 AX 7712",
    driver: {
      name: "Senthil Nathan",
      rating: 5.0,
      phone: "+91 94450 30516",
      tripsToday: 7
    },
    capacity: 55,
    occupancy: 28,
    speed: 34,
    heading: 160,
    status: "ON_TIME",
    delayMinutes: 0,
    isElectric: false,
    isAC: false,
    hasWifi: true,
    isWheelchairAccessible: true,
    progress: 0.62,
    currentStopIndex: 3,
    nextStop: "Adyar Signal Junction",
    etaMinutes: 4,
    fuelLevel: 82
  }
];

export const INITIAL_ALERTS = [
  {
    id: "alt-1",
    level: "warning",
    title: "OMR Madhya Kailash Congestion (Route 19B)",
    message: "Heavy peak hour traffic near Madhya Kailash junction. 19B delayed by 7 mins.",
    timestamp: "3 mins ago"
  },
  {
    id: "alt-2",
    level: "success",
    title: "MTC Chennai GTFS-RT Feed Active",
    message: "Live telemetry synchronized with ChennaiGTFS open transit protocol.",
    timestamp: "Just now"
  },
  {
    id: "alt-3",
    level: "info",
    title: "AC Deluxe Route 570 On Schedule",
    message: "Express corridor from CMBT to Siruseri IT Park operating at 98% on-time rate.",
    timestamp: "6 mins ago"
  }
];
