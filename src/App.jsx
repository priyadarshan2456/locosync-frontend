import React, { useState } from 'react';
import { useBusSimulator } from './hooks/useBusSimulator';
import Navbar from './components/Navbar';
import AlertsTicker from './components/AlertsTicker';
import BusMap from './components/BusMap';
import BusSidebar from './components/BusSidebar';
import BusDetailPanel from './components/BusDetailPanel';
import { Map, List, Info } from 'lucide-react';

export default function App() {
  const {
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
  } = useBusSimulator();

  // Mobile navigation tabs: 'map' | 'list' | 'details'
  const [mobileTab, setMobileTab] = useState('map');

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Top Navigation */}
      <Navbar
        routes={routes}
        selectedRouteFilter={selectedRouteFilter}
        setSelectedRouteFilter={setSelectedRouteFilter}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        simSpeed={simSpeed}
        setSimSpeed={setSimSpeed}
        triggerTrafficIncident={triggerTrafficIncident}
        totalBuses={buses.length}
        lastUpdated={lastUpdated}
      />

      {/* Transit Alert Notification Ribbon */}
      <AlertsTicker alerts={alerts} />

      {/* Main Responsive Dashboard Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar: Fleet List & Search (Visible on desktop or when 'list' tab active on mobile) */}
        <div className={`h-full ${mobileTab === 'list' ? 'flex w-full absolute inset-0 z-30' : 'hidden lg:flex'}`}>
          <BusSidebar
            buses={filteredBuses}
            selectedBusId={selectedBusId}
            onSelectBus={(id) => {
              setSelectedBusId(id);
              if (window.innerWidth < 1024) {
                setMobileTab('map');
              }
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Center: Live Interactive Leaflet Map */}
        <main className={`flex-1 h-full relative ${mobileTab === 'map' ? 'flex' : 'hidden lg:flex'}`}>
          <BusMap
            routes={routes}
            buses={buses}
            selectedBusId={selectedBusId}
            onSelectBus={(id) => {
              setSelectedBusId(id);
              if (window.innerWidth < 1024) {
                setMobileTab('details');
              }
            }}
            selectedRouteFilter={selectedRouteFilter}
          />
        </main>

        {/* Right Panel: Selected Bus Telemetry & Stop Timeline */}
        <div className={`h-full ${mobileTab === 'details' ? 'flex w-full absolute inset-0 z-30' : 'hidden xl:flex'}`}>
          <BusDetailPanel
            bus={selectedBus}
            route={activeRoute}
            onClose={() => {
              if (window.innerWidth < 1280) {
                setMobileTab('map');
              }
            }}
          />
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="lg:hidden flex items-center justify-around bg-slate-900 border-t border-slate-800 py-2.5 px-4 z-40">
        <button
          onClick={() => setMobileTab('map')}
          className={`flex flex-col items-center space-y-1 text-xs font-medium transition ${
            mobileTab === 'map' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>Live Map</span>
        </button>

        <button
          onClick={() => setMobileTab('list')}
          className={`flex flex-col items-center space-y-1 text-xs font-medium transition ${
            mobileTab === 'list' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <List className="w-4 h-4" />
          <span>Buses ({filteredBuses.length})</span>
        </button>

        <button
          onClick={() => setMobileTab('details')}
          className={`flex flex-col items-center space-y-1 text-xs font-medium transition ${
            mobileTab === 'details' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Telemetry HUD</span>
        </button>
      </div>

    </div>
  );
}
