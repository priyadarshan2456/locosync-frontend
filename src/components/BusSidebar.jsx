import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Clock, 
  MapPin, 
  Users, 
  Gauge, 
  Zap, 
  Wind, 
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function BusSidebar({
  buses,
  selectedBusId,
  onSelectBus,
  searchQuery,
  setSearchQuery
}) {
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL | ON_TIME | DELAYED

  const filtered = buses.filter(bus => {
    if (statusFilter === 'ON_TIME' && bus.status === 'DELAYED') return false;
    if (statusFilter === 'DELAYED' && bus.status !== 'DELAYED') return false;
    return true;
  });

  return (
    <aside className="w-full lg:w-96 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
      
      {/* Search & Filter Header */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search bus #, stop, plate or driver..."
            className="w-full pl-10 pr-9 py-2 bg-slate-800/90 text-sm text-slate-100 placeholder-slate-400 rounded-xl border border-slate-700/80 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              statusFilter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Buses ({buses.length})
          </button>
          <button
            onClick={() => setStatusFilter('ON_TIME')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              statusFilter === 'ON_TIME'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            On Schedule
          </button>
          <button
            onClick={() => setStatusFilter('DELAYED')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              statusFilter === 'DELAYED'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Delayed
          </button>
        </div>

        {/* Quick Destination Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
          <span className="text-slate-500 font-medium shrink-0">Quick:</span>
          {['Tambaram', 'CMBT', 'Tidel Park', 'Saidapet', 'Mylapore'].map(chip => (
            <button
              key={chip}
              onClick={() => setSearchQuery(searchQuery === chip ? '' : chip)}
              className={`px-2 py-0.5 rounded-md border shrink-0 transition ${
                searchQuery === chip
                  ? 'bg-blue-500/20 text-blue-300 border-blue-400/50'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Bus Card List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-12 px-4 text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-500 mb-2" />
            <p className="text-sm font-medium">No buses found matching your criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try searching for a different bus number or clear filters</p>
          </div>
        ) : (
          filtered.map(bus => {
            const isSelected = bus.id === selectedBusId;
            const occupancyRatio = bus.occupancy / bus.capacity;
            const crowdColor = 
              occupancyRatio > 0.8 ? 'text-rose-400' :
              occupancyRatio > 0.5 ? 'text-amber-400' :
              'text-emerald-400';

            return (
              <div
                key={bus.id}
                onClick={() => onSelectBus(bus.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800/90 border-blue-500/80 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30'
                    : 'bg-slate-900/60 border-slate-800/90 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                {/* Header: Bus Number & Status */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className="px-2.5 py-0.5 rounded-md text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: bus.routeColor }}
                    >
                      Route {bus.busNumber}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {bus.plateNumber}
                    </span>
                  </div>

                  {/* Status Badge */}
                  {bus.status === 'DELAYED' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      +{bus.delayMinutes}m Delay
                    </span>
                  ) : bus.status === 'BOARDING' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30 animate-pulse">
                      At Platform
                    </span>
                  ) : bus.status === 'APPROACHING' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      Approaching
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      On Time
                    </span>
                  )}
                </div>

                {/* Next Stop & Dynamic ETA */}
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3 mr-1 text-slate-500 shrink-0" />
                      <span>Next Stop</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {bus.nextStop}
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-2">
                    <div className="flex items-center text-[11px] text-slate-400 justify-end">
                      <Clock className="w-3 h-3 mr-1 text-blue-400" />
                      <span>ETA</span>
                    </div>
                    <div className="text-sm font-bold text-blue-400 font-mono">
                      {bus.etaMinutes} min
                    </div>
                  </div>
                </div>

                {/* Progress bar to next stop */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.round(bus.progress * 100))}%`,
                      backgroundColor: bus.routeColor
                    }}
                  />
                </div>

                {/* Quick Telemetry Footnotes: Speed, Capacity, EV badge */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center space-x-1.5">
                    <Gauge className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-mono">{bus.speed} km/h</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <Users className={`w-3.5 h-3.5 ${crowdColor}`} />
                    <span className="font-mono">
                      {bus.occupancy}/{bus.capacity}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    {bus.isElectric && (
                      <span className="p-1 rounded bg-emerald-500/10 text-emerald-400" title="100% Electric Vehicle">
                        <Zap className="w-3 h-3" />
                      </span>
                    )}
                    {bus.isAC && (
                      <span className="p-1 rounded bg-cyan-500/10 text-cyan-400" title="Air Conditioned">
                        <Wind className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between bg-slate-950/50">
        <span>Showing {filtered.length} of {buses.length} buses</span>
        <span className="flex items-center text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          GTFS-RT Synced
        </span>
      </div>
    </aside>
  );
}
