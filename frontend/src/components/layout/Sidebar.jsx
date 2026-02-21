import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Truck, MapPin, Wrench, Fuel, Users, BarChart3, LogOut, Zap, ChevronRight
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Command Center' },
  { to: '/vehicles', icon: Truck, label: 'Vehicle Registry' },
  { to: '/trips', icon: MapPin, label: 'Trip Dispatcher' },
  { to: '/maintenance', icon: Wrench, label: 'Maintenance' },
  { to: '/expenses', icon: Fuel, label: 'Expense & Fuel' },
  { to: '/drivers', icon: Users, label: 'Driver Profiles' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 z-40 flex flex-col"
      style={{ background: 'linear-gradient(180deg, #07090f 0%, #0d1017 100%)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shadow-cyan-glow animate-glow">
              <Zap size={18} className="text-white" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-md -z-10" />
          </div>
          <div>
            <span className="font-display text-2xl tracking-widest text-white">FLEET</span>
            <span className="font-display text-2xl tracking-widest text-cyan-400">FLOW</span>
          </div>
        </div>
        <p className="text-xs text-silver-500 font-mono mt-2 ml-0.5">Fleet Intelligence Platform</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-xs text-silver-600 uppercase tracking-widest font-mono px-3 mb-3">Navigation</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item group ${isActive ? 'active' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-cyan-400' : 'text-silver-500 group-hover:text-silver-300'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={12} className="text-cyan-400/60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: user + logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="glass-card p-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-900 flex items-center justify-center">
              <span className="text-xs font-bold text-white">FM</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-silver-200 truncate">Fleet Manager</p>
              <p className="text-xs text-silver-500 font-mono truncate">admin@fleetflow.io</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-silver-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}