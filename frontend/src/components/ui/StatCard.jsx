import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'cyan', trend, trendValue, delay = 0 }) {
  const [displayed, setDisplayed] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!visible) return;
    const num = parseInt(String(value).replace(/[^0-9]/g, '')) || 0;
    if (num === 0) return;
    let start = 0;
    const duration = 1200;
    const step = num / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setDisplayed(num); clearInterval(timer); }
      else setDisplayed(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, value]);

  const colorMap = {
    cyan: { border: 'border-cyan-500/20', glow: 'shadow-cyan-500/10', icon: 'text-cyan-400 bg-cyan-500/10', text: 'text-cyan-400' },
    emerald: { border: 'border-emerald-500/20', glow: 'shadow-emerald-500/10', icon: 'text-emerald-400 bg-emerald-500/10', text: 'text-emerald-400' },
    amber: { border: 'border-amber-500/20', glow: 'shadow-amber-500/10', icon: 'text-amber-400 bg-amber-500/10', text: 'text-amber-400' },
    rose: { border: 'border-rose-500/20', glow: 'shadow-rose-500/10', icon: 'text-rose-400 bg-rose-500/10', text: 'text-rose-400' },
    silver: { border: 'border-white/10', glow: 'shadow-white/5', icon: 'text-silver-300 bg-white/5', text: 'text-silver-300' },
  };

  const c = colorMap[color];
  const isPercentage = String(value).includes('%');
  const displayValue = isPercentage ? `${displayed}%` : displayed.toLocaleString();

  return (
    <div
      className={`glass-card border ${c.border} p-5 relative overflow-hidden group cursor-default transition-all duration-500 hover:shadow-lg ${c.glow} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transition: `all 0.5s ease ${delay}ms` }}
    >
      {/* Background shimmer on hover */}
      <div className="absolute inset-0 bg-shimmer bg-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent ${c.text} opacity-30`} />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-3">{title}</p>
          <p className={`font-display text-4xl tracking-wide ${c.text} count-animate`}>
            {visible ? displayValue : '0'}
          </p>
          {subtitle && <p className="text-xs text-silver-500 mt-2 font-mono">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-mono ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trendValue}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${c.icon} transition-transform duration-300 group-hover:scale-110`}>
            <Icon size={20} />
          </div>
        )}
      </div>

      {/* Corner decoration */}
      <div className={`absolute bottom-0 right-0 w-16 h-16 rounded-full ${c.text} opacity-5 translate-x-8 translate-y-8 group-hover:opacity-10 transition-opacity duration-300`}
        style={{ background: 'currentColor' }} />
    </div>
  );
}