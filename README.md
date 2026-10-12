# LocoSync - Real-Time Smart Bus Tracking Frontend 🚌⚡

**LocoSync** is a modern, high-performance web dashboard for real-time bus tracking and passenger transit information. Built with **React 18**, **Tailwind CSS**, and **Leaflet**, it delivers live animated GPS telemetry, dynamic route ETA calculation, stop sequence progression, passenger occupancy tracking, and interactive fleet dispatching.

---

## 🚀 Quick Start in VS Code Terminal (Bash / PowerShell)

### Step 1: Open Terminal in VS Code
Open VS Code, then press:
- ``Ctrl + ` `` (Backtick) to open the integrated terminal.
- Switch the terminal dropdown to **Git Bash** or **PowerShell**.

### Step 2: Navigate to the Project Directory
Run this bash command:
```bash
cd "C:/Users/lalit/.gemini/antigravity/scratch/locosync-frontend"
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Start the Development Server
```bash
npm run dev
```

Your browser will automatically open or visit:
👉 **`http://localhost:3000`**

---

## ⚡ Instant Zero-Install Preview (No npm required!)
If you want to view the working dashboard immediately in your browser without waiting for `npm install`:

1. Open your file explorer or VS Code.
2. Locate `standalone-preview.html` in this folder:
   ```
   C:\Users\lalit\.gemini\antigravity\scratch\locosync-frontend\standalone-preview.html
   ```
3. **Double-click it** or right-click and choose **Open with Chrome / Edge** (or "Open with Live Server" in VS Code).
4. The full interactive map with moving buses will render immediately!

---

## 🗂️ Project Structure & File Guide

```
locosync-frontend/
├── index.html                 # Vite HTML template with Leaflet styles & fonts
├── standalone-preview.html    # Zero-dependency self-contained instant preview
├── package.json               # NPM scripts and dependencies (React 18, Leaflet, Lucide)
├── vite.config.js             # Vite configuration with auto-port and hot reload
├── tailwind.config.js         # Custom transit theme, radar animations & colors
├── postcss.config.js          # PostCSS configuration for Tailwind
├── README.md                  # This manual and integration guide
└── src/
    ├── main.jsx               # React DOM entry point
    ├── App.jsx                # Main layout (Navbar, Map, Sidebar, Telemetry HUD)
    ├── index.css              # Custom styling, dark map theme & pulse keyframes
    ├── data/
    │   └── transitData.js     # Transit corridors, routes, stops, coordinates & buses
    ├── hooks/
    │   └── useBusSimulator.js # Real-time GPS movement, dynamic ETAs & simulation loop
    └── components/
        ├── Navbar.jsx         # Live stream status, route filters & sim speed controls
        ├── BusMap.jsx         # Interactive Leaflet map with animated heading markers
        ├── BusSidebar.jsx     # Search bar, status filters & bus cards with ETA
        ├── BusDetailPanel.jsx # Speedometer, occupancy bar, driver card & stop timeline
        └── AlertsTicker.jsx   # Real-time incident banner (delays, congestion updates)
```

---

## 🔌 Connecting to Your Real Backend API / WebSockets

Currently, the frontend uses an intelligent simulation engine (`src/hooks/useBusSimulator.js`) that realistically moves buses along actual route waypoints, handles boarding stops, and dynamically computes arrival ETAs.

To connect your real backend (Node.js, Python FastAPI, Django, Go, or Firebase):

### Option A: Polling REST API
In `src/hooks/useBusSimulator.js`, replace the `setInterval` simulation tick with an API fetch:
```javascript
useEffect(() => {
  const fetchLiveBuses = async () => {
    try {
      const res = await fetch("https://your-api.com/api/v1/buses/live");
      const data = await res.json();
      setBuses(data);
    } catch (err) {
      console.error("Failed to fetch bus telemetry", err);
    }
  };

  fetchLiveBuses();
  const timer = setInterval(fetchLiveBuses, 3000); // Poll every 3 seconds
  return () => clearInterval(timer);
}, []);
```

### Option B: WebSocket / MQTT Live Stream
```javascript
useEffect(() => {
  const socket = new WebSocket("wss://your-api.com/ws/locosync");

  socket.onmessage = (event) => {
    const telemetryUpdate = JSON.parse(event.data);
    setBuses(prev => prev.map(bus => 
      bus.id === telemetryUpdate.id ? { ...bus, ...telemetryUpdate } : bus
    ));
  };

  return () => socket.close();
}, []);
```

---

## 🌟 Key Interactive Features
- **Live Animated Leaflet Map**: Buses move along geographical transit paths with directional heading arrows.
- **Dynamic ETA Recalculation**: Arrival estimates adjust on the fly based on vehicle speed and remaining distance.
- **Stop-by-Stop Route Timeline**: View past stops, current location beacon, and upcoming stops with arrival countdowns.
- **Passenger Occupancy Gauge**: Visual crowdedness indicator (Low, Moderate, Full).
- **Incident & Delay Simulator**: Test how the UI reacts to sudden traffic jams with one click.
- **Fully Responsive**: Adapts seamlessly to mobile phones, tablets, and wide monitors.
