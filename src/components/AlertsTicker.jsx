import React, { useState } from 'react';
import { AlertTriangle, Info, CheckCircle2, ChevronRight, X } from 'lucide-react';

export default function AlertsTicker({ alerts }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !alerts || alerts.length === 0) return null;

  const currentAlert = alerts[currentIndex % alerts.length];

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs backdrop-blur-md">
      <div className="flex items-center space-x-2.5 overflow-hidden">
        {currentAlert.level === 'warning' ? (
          <span className="p-1 rounded bg-rose-500/20 text-rose-400 shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
          </span>
        ) : currentAlert.level === 'success' ? (
          <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
        ) : (
          <span className="p-1 rounded bg-blue-500/20 text-blue-400 shrink-0">
            <Info className="w-3.5 h-3.5" />
          </span>
        )}

        <div className="flex items-center space-x-2 truncate">
          <span className="font-semibold text-slate-200">
            {currentAlert.title}:
          </span>
          <span className="text-slate-400 truncate">
            {currentAlert.message}
          </span>
          <span className="text-[10px] text-slate-500 shrink-0">
            • {currentAlert.timestamp}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0 ml-3">
        {alerts.length > 1 && (
          <button
            onClick={() => setCurrentIndex(prev => (prev + 1) % alerts.length)}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center"
          >
            Next ({currentIndex + 1}/{alerts.length})
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
