import Layout from '../components/layout/Layout';
import { analyticsData, vehicles, expenses, maintenance } from '../data/mockData';
import { Download, TrendingUp, Zap, IndianRupee, BarChart3 } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card border border-white/10 px-3 py-2 text-xs font-mono">
        <p className="text-silver-400 mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' && p.value > 1000 ? `₹${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const radarData = [
  { metric: 'Fuel Eff.', A: 78 }, { metric: 'Safety', A: 92 }, { metric: 'Utilization', A: 67 },
  { metric: 'Maintenance', A: 85 }, { metric: 'Delivery', A: 96 }, { metric: 'Cost Ctrl', A: 71 },
];

export default function Analytics() {
  const totalRevenue = analyticsData.monthly.reduce((a, m) => a + m.revenue, 0);
  const totalFuelCost = analyticsData.monthly.reduce((a, m) => a + m.fuel, 0);
  const totalMaintCost = analyticsData.monthly.reduce((a, m) => a + m.maintenance, 0);
  const roi = ((totalRevenue - totalFuelCost - totalMaintCost) / totalRevenue * 100).toFixed(1);

  return (
    <Layout title="Operational Analytics" subtitle="Data-driven fleet intelligence">
      {/* Top metrics */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: '6M Revenue', val: `₹${(totalRevenue / 1000000).toFixed(1)}M`, icon: IndianRupee, cls: 'text-cyan-400 border-cyan-500/20', trend: '+18.2%' },
          { label: 'Fuel Spend', val: `₹${(totalFuelCost / 1000).toFixed(0)}K`, icon: Zap, cls: 'text-amber-400 border-amber-500/20', trend: '+5.3%' },
          { label: 'Maintenance', val: `₹${(totalMaintCost / 1000).toFixed(0)}K`, icon: BarChart3, cls: 'text-rose-400 border-rose-500/20', trend: '-2.1%' },
          { label: 'Net ROI', val: `${roi}%`, icon: TrendingUp, cls: 'text-emerald-400 border-emerald-500/20', trend: '+3.7%' },
        ].map(({ label, val, icon: Icon, cls, trend }) => (
          <div key={label} className={`glass-card p-4 border ${cls.split(' ')[1]}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-silver-500 font-mono uppercase tracking-widest">{label}</p>
              <Icon size={14} className={cls.split(' ')[0]} />
            </div>
            <p className={`font-display text-3xl ${cls.split(' ')[0]}`}>{val}</p>
            <p className={`text-xs font-mono mt-1 ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{trend} vs last period</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Revenue vs Cost */}
        <div className="glass-card p-5">
          <h3 className="font-display text-lg silver-text mb-1">Revenue vs Operational Cost</h3>
          <p className="text-xs text-silver-500 font-mono mb-4">6-month financial performance</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={analyticsData.monthly}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#636d82', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#636d82', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={55} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#06b6d4" strokeWidth={2} fill="url(#revGrad)" />
              <Area type="monotone" dataKey="fuel" name="Fuel" stroke="#f59e0b" strokeWidth={2} fill="url(#fuelGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Fuel Efficiency */}
        <div className="glass-card p-5">
          <h3 className="font-display text-lg silver-text mb-1">Fuel Efficiency by Vehicle</h3>
          <p className="text-xs text-silver-500 font-mono mb-4">km per liter</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analyticsData.fuelEfficiency} layout="vertical">
              <XAxis type="number" tick={{ fill: '#636d82', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="vehicle" tick={{ fill: '#8c95a8', fontSize: 10, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} width={110} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="efficiency" name="km/L" fill="#06b6d4" radius={[0, 4, 4, 0]}
                background={{ fill: 'rgba(255,255,255,0.03)', radius: 4 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Fleet Performance Radar */}
        <div className="glass-card p-5">
          <h3 className="font-display text-lg silver-text mb-1">Fleet Performance</h3>
          <p className="text-xs text-silver-500 font-mono mb-3">Multi-axis health score</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#636d82', fontSize: 10 }} />
              <Radar dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance cost breakdown */}
        <div className="glass-card p-5">
          <h3 className="font-display text-lg silver-text mb-1">Cost Breakdown</h3>
          <p className="text-xs text-silver-500 font-mono mb-4">Fuel vs Maintenance split</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.monthly}>
              <XAxis dataKey="month" tick={{ fill: '#636d82', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#636d82', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={40} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="fuel" name="Fuel" fill="#f59e0b" radius={[2,2,0,0]} stackId="a" />
              <Bar dataKey="maintenance" name="Maintenance" fill="#fb7185" radius={[2,2,0,0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Export & Actions */}
        <div className="glass-card p-5">
          <h3 className="font-display text-lg silver-text mb-4">Reports & Exports</h3>
          <div className="space-y-3">
            {[
              { label: 'Monthly Financial Summary', desc: 'Revenue, fuel, maintenance P&L', color: 'border-cyan-500/25 hover:border-cyan-500/50' },
              { label: 'Driver Performance Report', desc: 'Safety scores & trip completion', color: 'border-emerald-500/25 hover:border-emerald-500/50' },
              { label: 'Fleet Health Audit', desc: 'Maintenance & service logs', color: 'border-amber-500/25 hover:border-amber-500/50' },
              { label: 'Fuel Efficiency Analysis', desc: 'km/L per vehicle breakdown', color: 'border-rose-500/25 hover:border-rose-500/50' },
            ].map(({ label, desc, color }) => (
              <button key={label} className={`w-full flex items-center justify-between p-3 rounded-xl border bg-white/2 hover:bg-white/5 transition-all ${color} group`}>
                <div className="text-left">
                  <p className="text-xs font-medium text-silver-300">{label}</p>
                  <p className="text-xs text-silver-600 mt-0.5">{desc}</p>
                </div>
                <Download size={14} className="text-silver-600 group-hover:text-silver-300 transition-colors flex-shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}