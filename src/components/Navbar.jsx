import React from 'react';
import { 
  Bus, 
  Radio, 
  Play, 
  Pause, 
  FastForward, 
  AlertTriangle, 
  RefreshCw,
  Zap,
  Activity
} from 'lucide-react';

export default function Navbar({
  routes,
  selectedRouteFilter,
  setSelectedRouteFilter,
  isPlaying,
  setIsPlaying,
  simSpeed,
  setSimSpeed,
  triggerTrafficIncident,
  totalBuses,
  lastUpdated
}) {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 px-4 lg:px-6 py-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Brand & Live Connection Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/25">
              <Bus className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                  Loco<span className="text-blue-500">Sync</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded-full tracking-wider uppercase">
                  MTC Chennai
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span className="flex items-center text-emerald-400 font-medium">
                  <Radio className="w-3 h-3 mr-1 animate-pulse" />
                  GTFS-RT Live
                </span>
                <span>•</span>
                <span>{totalBuses} Active Buses</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline text-slate-500">Helpline: 9445030516</span>
              </div>
            </div>
          </div>
        </div>

        {/* Route Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setSelectedRouteFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              selectedRouteFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            All Corridors
          </button>
          {routes.map(route => {
            const isSelected = selectedRouteFilter === route.id;
            return (
              <button
                key={route.id}
                onClick={() => setSelectedRouteFilter(route.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
                style={{
                  backgroundColor: isSelected ? route.color : undefined,
                  boxShadow: isSelected ? `0 4px 14px ${route.color}40` : undefined
                }}
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: isSelected ? '#ffffff' : route.color }} 
                />
                <span>Route {route.number}</span>
              </button>
            );
          })}
        </div>

        {/* Telemetry & Simulation Controls */}
        <div className="flex items-center space-x-2 self-end md:self-auto">
          {/* Speed Toggle */}
          <button
            onClick={() => setSimSpeed(prev => (prev === 1 ? 2 : prev === 2 ? 4 : 1))}
            title="Adjust Simulation Telemetry Speed"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700/60 transition"
          >
            <FastForward className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-blue-400">{simSpeed}x</span>
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={() => setIsPlaying(prev => !prev)}
            title={isPlaying ? "Pause Real-Time Simulation" : "Resume Real-Time Simulation"}
            className={`p-2 rounded-lg border transition ${
              isPlaying
                ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Trigger Incident Simulator */}
          <button
            onClick={triggerTrafficIncident}
            title="Simulate Real-time Traffic Jam"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium border border-rose-500/30 transition shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Simulate Delay</span>
          </button>
        </div>

      </div>
    </header>
  );
}
