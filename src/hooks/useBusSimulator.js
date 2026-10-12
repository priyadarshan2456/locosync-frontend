import { useState, useEffect, useRef, useCallback } from 'react';
import { INITIAL_ROUTES, INITIAL_BUSES, INITIAL_ALERTS } from '../data/transitData';

/**
 * Calculates geographical distance between two lat/lng points in km (Haversine formula)
 */
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates bearing angle in degrees between two coordinates
 */
function getBearing(lat1, lon1, lat2, lon2) {
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const y = Math.sin(dLon) * Math.cos(lat2 * (Math.PI / 180));
  const x = Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
            Math.sin(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.cos(dLon);
  let brng = Math.atan2(y, x) * (180 / Math.PI);
  return (brng + 360) % 360;
}

/**
 * Interpolates coordinate position along a polyline of waypoints given progress ratio [0..1]
 */
function interpolateWaypoints(waypoints, progress) {
  if (!waypoints || waypoints.length === 0) return { position: [13.0418, 80.2341], bearing: 0 };
  if (waypoints.length === 1) return { position: waypoints[0], bearing: 0 };

  const totalSegments = waypoints.length - 1;
  const scaledProgress = Math.max(0, Math.min(1, progress)) * totalSegments;
  const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
  const segmentFraction = scaledProgress - segmentIndex;

  const p1 = waypoints[segmentIndex];
  const p2 = waypoints[segmentIndex + 1];

  const lat = p1[0] + (p2[0] - p1[0]) * segmentFraction;
  const lng = p1[1] + (p2[1] - p1[1]) * segmentFraction;

  const bearing = getBearing(p1[0], p1[1], p2[0], p2[1]);

  return { position: [lat, lng], bearing };
}

export function useBusSimulator() {
  const [routes] = useState(INITIAL_ROUTES);
  const [buses, setBuses] = useState(() => {
    // Initialize initial lat/lng and bearings
    return INITIAL_BUSES.map(bus => {
      const route = INITIAL_ROUTES.find(r => r.id === bus.routeId);
      const waypoints = route ? route.waypoints : [];
      const { position, bearing } = interpolateWaypoints(waypoints, bus.progress);
      return {
        ...bus,
        position,
        heading: bearing,
        routeColor: route ? route.color : '#2563eb',
        routeName: route ? route.name : 'Local Transit'
      };
    });
  });

  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [selectedBusId, setSelectedBusId] = useState(INITIAL_BUSES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('ALL');
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1); // 1x, 2x, 4x
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const routesMap = useRef(new Map(INITIAL_ROUTES.map(r => [r.id, r])));

  // Simulation tick loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 1200; // Update frequency (1.2s for smooth realistic telemetry)
    const timer = setInterval(() => {
      setLastUpdated(new Date());

      setBuses(prevBuses => {
        return prevBuses.map(bus => {
          const route = routesMap.current.get(bus.routeId);
          if (!route) return bus;

          // Increment progress based on speed
          const progressStep = (0.007 * simSpeed);
          let newProgress = bus.progress + progressStep;
          if (newProgress > 1) {
            newProgress = 0.02; // Loop back to terminal
          }

          const { position, bearing } = interpolateWaypoints(route.waypoints, newProgress);

          // Find closest and next stop along the route
          const stops = route.stops;
          const stopDistances = stops.map((stop, idx) => ({
            idx,
            stop,
            dist: getDistanceKm(position[0], position[1], stop.lat, stop.lng)
          }));

          // Determine current and next stop based on progress
          const stopProgressStep = 1 / stops.length;
          const estimatedStopIndex = Math.min(
            Math.floor(newProgress / stopProgressStep),
            stops.length - 1
          );
          const nextStopIndex = Math.min(estimatedStopIndex + 1, stops.length - 1);
          const nextStop = stops[nextStopIndex];

          // Compute remaining distance to next stop
          const distToNext = getDistanceKm(position[0], position[1], nextStop.lat, nextStop.lng);
          
          // Realistic speed variation
          const baseSpeed = bus.routeId === 'route-408' ? 54 : 38;
          const speedVariance = (Math.sin(Date.now() / 4000 + bus.id.charCodeAt(4)) * 8);
          const currentSpeed = Math.max(15, Math.round(baseSpeed + speedVariance));

          // Estimated ETA in minutes
          const etaMinutes = Math.max(1, Math.round((distToNext / Math.max(20, currentSpeed)) * 60));

          // Status calculation
          let status = bus.status;
          if (distToNext < 0.15) {
            status = 'BOARDING';
          } else if (distToNext < 0.45) {
            status = 'APPROACHING';
          } else if (bus.delayMinutes > 3) {
            status = 'DELAYED';
          } else {
            status = 'ON_TIME';
          }

          // Subtle passenger occupancy changes at stops
          let occupancy = bus.occupancy;
          if (status === 'BOARDING' && Math.random() > 0.6) {
            const delta = Math.floor(Math.random() * 5) - 2;
            occupancy = Math.max(5, Math.min(bus.capacity, occupancy + delta));
          }

          return {
            ...bus,
            progress: newProgress,
            position,
            heading: bearing,
            speed: currentSpeed,
            currentStopIndex: estimatedStopIndex,
            nextStop: nextStop.name,
            nextStopId: nextStop.id,
            etaMinutes,
            status,
            occupancy
          };
        });
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, simSpeed]);

  // Inject a simulated delay or rush hour event
  const triggerTrafficIncident = useCallback(() => {
    setBuses(prev => {
      const targetBus = prev[Math.floor(Math.random() * prev.length)];
      return prev.map(b => {
        if (b.id === targetBus.id) {
          return {
            ...b,
            status: 'DELAYED',
            delayMinutes: b.delayMinutes + 6,
            speed: Math.max(10, b.speed - 15)
          };
        }
        return b;
      });
    });

    const newAlert = {
      id: `alt-${Date.now()}`,
      level: 'warning',
      title: 'Sudden Traffic Bottleneck Reported',
      message: `LocoSync sensors detected congestion on corridor. Recalculating dynamic ETAs.`,
      timestamp: 'Just now'
    };
    setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
  }, []);

  // Filter buses based on search and route filter
  const filteredBuses = buses.filter(bus => {
    const matchesSearch =
      bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.nextStop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.driver.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRoute =
      selectedRouteFilter === 'ALL' || bus.routeId === selectedRouteFilter;

    return matchesSearch && matchesRoute;
  });

  const selectedBus = buses.find(b => b.id === selectedBusId) || buses[0];
  const activeRoute = routes.find(r => r.id === (selectedBus?.routeId));

  return {
    routes,
    buses,
    filteredBuses,
    selectedBus,
    selectedBusId,
    setSelectedBusId,
    activeRoute,
    alerts,
    searchQuery,
    setSearchQuery,
    selectedRouteFilter,
    setSelectedRouteFilter,
    isPlaying,
    setIsPlaying,
    simSpeed,
    setSimSpeed,
    lastUpdated,
    triggerTrafficIncident
  };
}
