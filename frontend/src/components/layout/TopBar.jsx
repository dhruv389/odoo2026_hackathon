import { Bell, Search, Settings } from 'lucide-react';
import { useState } from 'react';

export default function TopBar({ title, subtitle }) {
  const [notifOpen, setNotifOpen] = useState(false);

  const alerts = [
    { msg: 'License expiry: Marcus Webb — 3 days left', type: 'danger', time: '2m ago' },
    { msg: 'Atlas Freight X maintenance overdue', type: 'warning', time: '1h ago' },
    { msg: 'TR-2401 dispatched successfully', type: 'success', time: '2h ago' },
  ];

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 sticky top-0 z-30"
      style={{ background: 'rgba(7,9,15,0.8)', backdropFilter: 'blur(12px)' }}>

      <div>
        <h1 className="font-display text-2xl tracking-wide silver-text">{title}</h1>
        {subtitle && <p className="text-xs text-silver-500 font-mono -mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-500" />
          <input
            className="input-field pl-9 w-52 h-9 text-xs"
            placeholder="Search fleet..."
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-white/8 text-silver-400 hover:text-white hover:bg-white/5 hover:border-cyan-500/30 transition-all"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-72 glass-card border border-white/10 shadow-2xl z-50"
              style={{ animation: 'slideUp 0.2s ease-out' }}>
              <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
                <span className="text-sm font-medium text-silver-200">Notifications</span>
                <span className="text-xs bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full font-mono">{alerts.length}</span>
              </div>
              <div className="py-1">
                {alerts.map((a, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-white/3 transition-colors border-b border-white/5 last:border-0">
                    <div className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${a.type === 'danger' ? 'bg-rose-400' : a.type === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                      <div>
                        <p className="text-xs text-silver-300">{a.msg}</p>
                        <p className="text-xs text-silver-600 font-mono mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/8 text-silver-400 hover:text-white hover:bg-white/5 transition-all">
          <Settings size={16} />
        </button>

        {/* Date */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/3 border border-white/5">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs text-silver-400 font-mono">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
    </header>
  );
}