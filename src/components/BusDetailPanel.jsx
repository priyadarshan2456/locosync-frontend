import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Gauge, 
  Users, 
  Zap, 
  Wind, 
  Wifi, 
  Accessibility, 
  Phone, 
  Star, 
  Shield, 
  BatteryCharging,
  Fuel,
  Share2,
  Bell,
  ThumbsUp,
  Sparkles,
  Check
} from 'lucide-react';

export default function BusDetailPanel({
  bus,
  route,
  onClose
}) {
  const [copied, setCopied] = useState(false);
  const [alertSet, setAlertSet] = useState(false);
  const [userReportedCrowd, setUserReportedCrowd] = useState(null);

  if (!bus) return null;

  const occupancyRatio = bus.occupancy / bus.capacity;
  const stops = route ? route.stops : [];
  const currentStopIndex = bus.currentStopIndex || 0;

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `Tracking LocoSync MTC Bus #${bus.busNumber} on route ${route?.name || ''} - Next stop: ${bus.nextStop} (${bus.etaMinutes} mins)`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleToggleAlert = () => {
    setAlertSet(prev => !prev);
    if (!alertSet) {
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    }
  };

  return (
    <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-y-auto shrink-0 z-20">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span
              className="px-2.5 py-1 rounded-md text-xs font-black text-white"
              style={{ backgroundColor: bus.routeColor }}
            >
              MTC {bus.busNumber}
            </span>
            <span className="text-xs font-semibold text-slate-300">
              {route ? route.type : 'Deluxe'}
            </span>
          </div>
          <h2 className="text-sm font-bold text-white mt-1">
            {route ? route.name : `Bus ${bus.busNumber}`}
          </h2>
        </div>

        <div className="flex items-center space-x-1">
          {/* Share Button */}
          <button
            onClick={handleShare}
            title="Share Live Bus Tracking Link"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        
        {/* Real-time Telemetry Dashboard Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Live Speed */}
          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60">
            <div className="flex items-center text-slate-400 text-xs mb-1">
              <Gauge className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
              <span>Speed (GPS)</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black font-mono text-white">
                {bus.speed}
              </span>
              <span className="text-xs text-slate-400 font-medium">km/h</span>
            </div>
          </div>

          {/* Energy / Fuel Level */}
          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60">
            <div className="flex items-center text-slate-400 text-xs mb-1">
              {bus.isElectric ? (
                <BatteryCharging className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              ) : (
                <Fuel className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              )}
              <span>{bus.isElectric ? 'EV Battery' : 'Fuel'}</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black font-mono text-emerald-400">
                {bus.batteryLevel || bus.fuelLevel || 78}%
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">ECO</span>
            </div>
          </div>
        </div>

        {/* Live Passenger Occupancy Bar & Crowdsourced Reporting */}
        <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center text-slate-300 font-medium">
              <Users className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
              Passenger Capacity
            </span>
            <span className="font-mono text-slate-200 font-bold">
              {bus.occupancy} / {bus.capacity} seats ({Math.round(occupancyRatio * 100)}%)
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                occupancyRatio > 0.8
                  ? 'bg-rose-500'
                  : occupancyRatio > 0.5
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, Math.round(occupancyRatio * 100))}%` }}
            />
          </div>

          {/* Interactive Crowd Voting (Passenger Engagement) */}
          <div className="pt-1 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Onboard? Report Crowd:</span>
              {userReportedCrowd && (
                <span className="text-emerald-400 font-semibold text-[10px]">
                  ✓ Reported {userReportedCrowd}
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                onClick={() => setUserReportedCrowd('Light')}
                className={`py-1 rounded-lg border transition font-medium ${
                  userReportedCrowd === 'Light'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                🟢 Light
              </button>
              <button
                onClick={() => setUserReportedCrowd('Moderate')}
                className={`py-1 rounded-lg border transition font-medium ${
                  userReportedCrowd === 'Moderate'
                    ? 'bg-amber-600 text-white border-amber-500'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                🟡 Medium
              </button>
              <button
                onClick={() => setUserReportedCrowd('Crowded')}
                className={`py-1 rounded-lg border transition font-medium ${
                  userReportedCrowd === 'Crowded'
                    ? 'bg-rose-600 text-white border-rose-500'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                🔴 Full
              </button>
            </div>
          </div>
        </div>

        {/* Proximity Arrival Notification Toggle */}
        <button
          onClick={handleToggleAlert}
          className={`w-full p-2.5 rounded-xl border flex items-center justify-center space-x-2 text-xs font-semibold transition ${
            alertSet
              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-750'
          }`}
        >
          <Bell className={`w-4 h-4 ${alertSet ? 'animate-bounce' : ''}`} />
          <span>{alertSet ? 'Arrival Notification Set!' : 'Notify Me When 2 Stops Away'}</span>
        </button>

        {/* Driver Profile */}
        <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {bus.driver.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                <span>{bus.driver.name}</span>
                <span className="flex items-center text-amber-400 text-[10px]">
                  <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                  {bus.driver.rating}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                MTC Driver • {bus.driver.tripsToday} trips completed today
              </div>
            </div>
          </div>

          <a
            href={`tel:${bus.driver.phone || '9445030516'}`}
            className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition border border-blue-500/30"
            title="Call MTC Helpline"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Live Route Progression Timeline */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Route Stop Progression
            </h3>
            <span className="text-[11px] text-blue-400 font-semibold font-mono">
              Next ETA: {bus.etaMinutes} min
            </span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {stops.map((stop, idx) => {
              const isPassed = idx < currentStopIndex;
              const isCurrent = idx === currentStopIndex;
              const isNext = idx === currentStopIndex + 1;

              return (
                <div key={stop.id} className="relative flex items-start justify-between">
                  {/* Timeline Node Icon */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isPassed
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-500/30'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <span className="text-[10px] font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Stop Name & Transfer badge */}
                  <div className="pr-2">
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`text-xs font-semibold transition ${
                          isCurrent
                            ? 'text-blue-400 font-bold'
                            : isPassed
                            ? 'text-slate-500 line-through'
                            : 'text-slate-200'
                        }`}
                      >
                        {stop.name}
                      </span>
                      {stop.isTransfer && (
                        <span className="px-1.5 py-0.2 text-[9px] bg-slate-800 text-slate-400 rounded">
                          Metro / Transfer
                        </span>
                      )}
                    </div>

                    {isCurrent && (
                      <div className="text-[10px] text-blue-400 font-medium flex items-center mt-0.5 animate-pulse">
                        <MapPin className="w-3 h-3 mr-1" />
                        Current Bus Position
                      </div>
                    )}
                  </div>

                  {/* Arrival Status / ETA */}
                  <div className="text-right shrink-0">
                    {isPassed ? (
                      <span className="text-[10px] text-slate-600 font-mono">Passed</span>
                    ) : isNext ? (
                      <span className="text-[11px] font-extrabold text-blue-400 font-mono">
                        {bus.etaMinutes} min
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">
                        +{(idx - currentStopIndex) * 3 + bus.etaMinutes}m
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vehicle Amenities & Specs */}
        <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex justify-between">
            <span>MTC Fleet Vehicle:</span>
            <span className="text-slate-200 font-semibold">{bus.model}</span>
          </div>
          <div className="flex justify-between">
            <span>Registration Plate:</span>
            <span className="text-slate-200 font-mono font-bold">{bus.plateNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>MTC Helpline:</span>
            <span className="text-blue-400 font-mono">9445030516</span>
          </div>
        </div>

      </div>
    </div>
  );
}
