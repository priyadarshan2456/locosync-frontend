import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Crosshair, 
  Layers, 
  Navigation, 
  ZoomIn, 
  ZoomOut, 
  Volume2, 
  VolumeX, 
  Compass, 
  Sparkles,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';

// Tile Layer configurations (100% Free, NO API KEY REQUIRED, Zero Watermarks)
const MAP_STYLES = {
  streets: {
    name: 'OpenStreetMap Streets',
    icon: '🗺️',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  },
  satellite: {
    name: 'Satellite Aerial',
    icon: '🛰️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 18
  },
  topo: {
    name: 'Clean Transit Topo',
    icon: '🛣️',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; OpenStreetMap, SRTM',
    maxZoom: 17
  }
};

export default function BusMap({
  routes,
  buses,
  selectedBusId,
  onSelectBus,
  selectedRouteFilter
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const busMarkersRef = useRef({});
  const routeLayersRef = useRef([]);
  const stopMarkersRef = useRef([]);

  // Interactive UI States
  const [mapStyle, setMapStyle] = useState('streets');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [autoFollow, setAutoFollow] = useState(true);
  const [showStops, setShowStops] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedStop, setSelectedStop] = useState(null);

  // Play audio chime when bus approaches
  const playArrivalChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5 note
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // AudioContext handled safely
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center on Chennai Metropolitan Transit (Anna Salai / Guindy corridor)
    const map = L.map(mapContainerRef.current, {
      center: [13.0180, 80.2220],
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    // Clean OpenStreetMap default tiles (NO API KEY, NO WATERMARKS)
    const tile = L.tileLayer(MAP_STYLES.streets.url, {
      maxZoom: MAP_STYLES.streets.maxZoom,
      attribution: MAP_STYLES.streets.attribution
    }).addTo(map);

    tileLayerRef.current = tile;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer dynamically when user switches map style
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const cfg = MAP_STYLES[mapStyle];
    tileLayerRef.current = L.tileLayer(cfg.url, {
      maxZoom: cfg.maxZoom,
      attribution: cfg.attribution
    }).addTo(map);
  }, [mapStyle]);

  // Render Routes and Stops
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean previous layers
    routeLayersRef.current.forEach(layer => map.removeLayer(layer));
    routeLayersRef.current = [];
    stopMarkersRef.current.forEach(layer => map.removeLayer(layer));
    stopMarkersRef.current = [];

    const visibleRoutes = routes.filter(
      r => selectedRouteFilter === 'ALL' || r.id === selectedRouteFilter
    );

    visibleRoutes.forEach(route => {
      // Outer route glow polyline
      const glowLine = L.polyline(route.waypoints, {
        color: route.color,
        weight: 9,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Core route stroke
      const coreLine = L.polyline(route.waypoints, {
        color: route.color,
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      routeLayersRef.current.push(glowLine, coreLine);

      // Render Stop Markers if enabled
      if (showStops) {
        route.stops.forEach((stop, index) => {
          const stopIcon = L.divIcon({
            className: 'interactive-stop-pin',
            html: `
              <div style="
                width: 14px;
                height: 14px;
                background-color: #ffffff;
                border: 3px solid ${route.color};
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.5);
                cursor: pointer;
                transition: transform 0.2s ease;
              " class="hover:scale-125"></div>
            `,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          });

          const stopMarker = L.marker([stop.lat, stop.lng], { icon: stopIcon })
            .addTo(map)
            .on('click', () => {
              setSelectedStop({
                ...stop,
                routeNumber: route.number,
                routeColor: route.color,
                routeName: route.name,
                stopSequence: index + 1
              });
              map.flyTo([stop.lat, stop.lng], 14, { duration: 0.8 });
            });

          stopMarkersRef.current.push(stopMarker);
        });
      }
    });
  }, [routes, selectedRouteFilter, showStops]);

  // Update Live Bus Markers with dynamic bearing and radar halos
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const visibleBuses = buses.filter(
      b => selectedRouteFilter === 'ALL' || b.routeId === selectedRouteFilter
    );

    const activeBusIds = new Set(visibleBuses.map(b => b.id));

    // Remove obsolete markers
    Object.keys(busMarkersRef.current).forEach(id => {
      if (!activeBusIds.has(id)) {
        map.removeLayer(busMarkersRef.current[id]);
        delete busMarkersRef.current[id];
      }
    });

    visibleBuses.forEach(bus => {
      const isSelected = bus.id === selectedBusId;
      const statusColor = 
        bus.status === 'DELAYED' ? '#ef4444' :
        bus.status === 'APPROACHING' ? '#3b82f6' :
        '#10b981';

      if (isSelected && bus.status === 'APPROACHING') {
        playArrivalChime();
      }

      const iconHtml = `
        <div style="position: relative; transform: translate(-50%, -50%); cursor: pointer;">
          <!-- Moving Radar Halo -->
          <div style="
            position: absolute;
            width: ${isSelected ? '48px' : '36px'};
            height: ${isSelected ? '48px' : '36px'};
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            background: ${bus.routeColor}40;
            animation: radar-ping 1.8s cubic-bezier(0,0,0.2,1) infinite;
          "></div>

          <!-- Bus Navigation Capsule -->
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            background: #0f172a;
            border: 2px solid ${isSelected ? '#ffffff' : bus.routeColor};
            border-radius: 20px;
            padding: 3px 8px 3px 4px;
            box-shadow: 0 4px 18px rgba(0,0,0,0.7);
            transform: scale(${isSelected ? 1.2 : 1});
            transition: transform 0.2s ease, border-color 0.2s ease;
          ">
            <!-- Heading Compass Indicator -->
            <div style="
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: ${bus.routeColor};
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 6px;
              transform: rotate(${bus.heading}deg);
              transition: transform 0.5s ease;
            ">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 19 21 12 17 5 21 12 2"/>
              </svg>
            </div>

            <!-- Bus Route Number & Live Speed -->
            <div style="display: flex; flex-direction: column; text-align: left;">
              <div style="font-size: 11px; font-weight: 800; color: #ffffff; line-height: 1.1; white-space: nowrap;">
                MTC ${bus.busNumber}
              </div>
              <div style="font-size: 9px; font-weight: 700; color: ${statusColor}; font-family: monospace;">
                ${bus.speed} km/h
              </div>
            </div>
          </div>
        </div>
      `;

      const busIcon = L.divIcon({
        className: 'custom-bus-marker',
        html: iconHtml,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      if (busMarkersRef.current[bus.id]) {
        const marker = busMarkersRef.current[bus.id];
        marker.setLatLng(bus.position);
        marker.setIcon(busIcon);
      } else {
        const marker = L.marker(bus.position, { icon: busIcon }).addTo(map);
        marker.on('click', () => {
          onSelectBus(bus.id);
          setSelectedStop(null);
          map.flyTo(bus.position, 14, { duration: 0.8 });
        });
        busMarkersRef.current[bus.id] = marker;
      }
    });

    // Auto-follow selected bus smoothly
    if (autoFollow && selectedBusId) {
      const selectedBus = buses.find(b => b.id === selectedBusId);
      if (selectedBus && selectedBus.position) {
        map.panTo(selectedBus.position, {
          animate: true,
          duration: 0.5
        });
      }
    }
  }, [buses, selectedBusId, selectedRouteFilter, autoFollow, onSelectBus]);

  const handleCenterOnSelected = () => {
    const selectedBus = buses.find(b => b.id === selectedBusId);
    if (selectedBus && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(selectedBus.position, 15, { duration: 1 });
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          mapInstanceRef.current.flyTo(coords, 15, { duration: 1.2 });
          L.circleMarker(coords, {
            radius: 8,
            fillColor: '#3b82f6',
            color: '#ffffff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.9
          })
          .addTo(mapInstanceRef.current)
          .bindPopup('<b>You are here</b><br>Nearest stop scanning...')
          .openPopup();
        },
        () => {
          alert('Location access unavailable. Centering on Central Terminus.');
          mapInstanceRef.current.flyTo([13.0827, 80.2707], 13);
        }
      );
    }
  };

  return (
    <div className="relative w-full h-full min-h-[450px] bg-slate-950 overflow-hidden select-none">
      
      {/* Map DOM Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Interactive Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
        {/* Layer Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(prev => !prev)}
            title="Change Map Style (Streets / Satellite / Topo)"
            className="p-2.5 bg-slate-900/95 hover:bg-slate-800 text-slate-100 rounded-xl border border-slate-700/80 shadow-xl backdrop-blur-md transition hover:scale-105 flex items-center justify-center"
          >
            <Layers className="w-4 h-4 text-blue-400" />
          </button>

          {/* Map Layer Modal Dropdown */}
          {showLayerMenu && (
            <div className="absolute right-12 top-0 w-52 bg-slate-900/95 border border-slate-700/90 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl z-30 space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Map Basemap Style
              </div>
              {Object.entries(MAP_STYLES).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => {
                    setMapStyle(key);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-xl text-xs font-semibold transition ${
                    mapStyle === key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}

              <div className="border-t border-slate-800 pt-1.5 mt-1">
                <button
                  onClick={() => setShowStops(p => !p)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-slate-300 hover:bg-slate-800"
                >
                  <span>Show Bus Stops</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${showStops ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {showStops ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Zoom Controls */}
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          title="Zoom In"
          className="p-2.5 bg-slate-900/95 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700/80 shadow-lg backdrop-blur-md transition hover:scale-105"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          title="Zoom Out"
          className="p-2.5 bg-slate-900/95 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700/80 shadow-lg backdrop-blur-md transition hover:scale-105"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Center on Selected Bus */}
        <button
          onClick={handleCenterOnSelected}
          title="Center on Selected Bus"
          className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl border border-blue-400/40 shadow-lg shadow-blue-600/30 backdrop-blur-md transition hover:scale-105"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Auto-Follow Camera Lock */}
        <button
          onClick={() => setAutoFollow(prev => !prev)}
          title={autoFollow ? "Disable Auto-Follow Camera Lock" : "Enable Auto-Follow Camera Lock"}
          className={`p-2.5 rounded-xl border shadow-lg backdrop-blur-md transition hover:scale-105 ${
            autoFollow
              ? 'bg-emerald-600 text-white border-emerald-400/50 shadow-emerald-600/25'
              : 'bg-slate-900/95 text-slate-400 border-slate-700/80 hover:text-slate-200'
          }`}
        >
          <Navigation className={`w-4 h-4 ${autoFollow ? 'animate-pulse' : ''}`} />
        </button>

        {/* Locate User GPS */}
        <button
          onClick={handleLocateMe}
          title="Find My Location & Nearest Bus Stop"
          className="p-2.5 bg-slate-900/95 hover:bg-slate-800 text-cyan-400 rounded-xl border border-slate-700/80 shadow-lg backdrop-blur-md transition hover:scale-105"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Arrival Chime Sound Toggle */}
        <button
          onClick={() => setSoundEnabled(prev => !prev)}
          title={soundEnabled ? "Mute Arrival Chimes" : "Unmute Arrival Chimes"}
          className={`p-2.5 rounded-xl border shadow-lg backdrop-blur-md transition hover:scale-105 ${
            soundEnabled
              ? 'bg-slate-900/95 text-blue-400 border-slate-700/80'
              : 'bg-slate-900/95 text-slate-500 border-slate-800'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Interactive Stop Detail Popover (When user clicks any stop pin on map) */}
      {selectedStop && (
        <div className="absolute top-4 left-4 z-20 w-80 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-1.5">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-extrabold text-white"
                  style={{ backgroundColor: selectedStop.routeColor }}
                >
                  MTC {selectedStop.routeNumber}
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Stop #{selectedStop.stopSequence}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">
                {selectedStop.name}
              </h3>
            </div>
            <button
              onClick={() => setSelectedStop(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Next Expected Bus:</span>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-400">
              ~2 - 4 mins
            </span>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Coordinates:</span>
            <span className="font-mono text-slate-300">
              {selectedStop.lat.toFixed(4)}, {selectedStop.lng.toFixed(4)}
            </span>
          </div>
        </div>
      )}

      {/* Live Map Legend Overlay (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-800/90 rounded-2xl px-4 py-2.5 shadow-2xl hidden sm:flex items-center space-x-4 text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium">On Schedule</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span className="font-medium">Approaching / Boarding</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span className="font-medium">Traffic Bottleneck</span>
        </div>
      </div>

    </div>
  );
}
