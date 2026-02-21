import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import { Truck, Wrench, Activity, Package, ChevronRight, MapPin, Clock } from 'lucide-react';
import { analyticsAPI, vehicleAPI, tripAPI, driverAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const activityData = [
  { time: '06:00', active: 2 }, { time: '08:00', active: 5 }, { time: '10:00', active: 8 },
  { time: '12:00', active: 10 }, { time: '14:00', active: 9 }, { time: '16:00', active: 7 },
  { time: '18:00', active: 4 }, { time: '20:00', active: 2 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card border border-white/10 px-3 py-2">
        <p className="text-xs text-silver-500 font-mono">{label}</p>
        <p className="text-sm font-medium text-cyan-400">{payload[0].value} vehicles</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashData, vehiclesData, tripsData, driversData] = await Promise.all([
          analyticsAPI.getDashboard().catch(err => {
            console.log('Analytics API error:', err);
            return null;
          }),
          vehicleAPI.getAll().catch(err => {
            console.log('Vehicles API error:', err);
            return [];
          }),
          tripAPI.getAll().catch(err => {
            console.log('Trips API error:', err);
            return [];
          }),
          driverAPI.getAll().catch(err => {
            console.log('Drivers API error:', err);
            return [];
          }),
        ]);

        console.log('Dashboard data:', { dashData, vehiclesData, tripsData, driversData });

        setDashboardData(dashData);
        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
        setTrips(Array.isArray(tripsData) ? tripsData : []);
        setDrivers(Array.isArray(driversData) ? driversData : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setVehicles([]);
        setTrips([]);
        setDrivers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout title="Command Center" subtitle="Fleet Intelligence Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const activeFleet = vehicles.filter(v => v.status === 'On Trip').length;
  const inShop = vehicles.filter(v => v.status === 'In Shop').length;
  const available = vehicles.filter(v => v.status === 'Available').length;
  const utilization = vehicles.length > 0 ? Math.round((activeFleet / vehicles.length) * 100) : 0;
  const recentTrips = trips.slice(0, 5);

  return (
    <Layout title="Command Center" subtitle="Fleet Intelligence Dashboard">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Active Fleet" value={activeFleet} subtitle={`of ${vehicles.length} total vehicles`} icon={Truck} color="cyan" trend="up" trendValue="+2 from yesterday" delay={0} />
        <StatCard title="Maintenance Alerts" value={inShop} subtitle="vehicles in service bay" icon={Wrench} color="amber" trend="down" trendValue="1 less than last week" delay={100} />
        <StatCard title="Utilization Rate" value={`${utilization}%`} subtitle="fleet efficiency score" icon={Activity} color="emerald" trend="up" trendValue="+4.2% this week" delay={200} />
        <StatCard title="Pending Cargo" value={3} subtitle="awaiting assignment" icon={Package} color="rose" delay={300} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Fleet Activity Chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg silver-text">Fleet Activity Today</h3>
              <p className="text-xs text-silver-500 font-mono mt-0.5">Active vehicles by hour</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs text-silver-500 font-mono">Live</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fill: '#636d82', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#636d82', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="active" stroke="#06b6d4" strokeWidth={2} fill="url(#areaGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle Status Breakdown */}
        <div className="glass-card p-5">
          <h3 className="font-display text-lg silver-text mb-4">Fleet Status</h3>
          <div className="space-y-3">
            {[
              { label: 'On Trip', count: activeFleet, total: vehicles.length, color: 'bg-cyan-500' },
              { label: 'Available', count: available, total: vehicles.length, color: 'bg-emerald-500' },
              { label: 'In Shop', count: inShop, total: vehicles.length, color: 'bg-amber-500' },
            ].map(({ label, count, total, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-silver-400">{label}</span>
                  <span className="text-xs text-silver-300 font-mono">{count}/{total}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all duration-1000`}
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2">
            <p className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-3">Active Drivers</p>
            {drivers.filter(d => d.status === 'On Duty').slice(0, 3).map(driver => (
              <div key={driver._id} className="flex items-center gap-2.5 py-2 border-b border-white/5 last:border-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-700 to-obsidian-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">{driver.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-silver-300 truncate">{driver.name}</p>
                  <p className="text-xs text-silver-500 font-mono">Safety: {driver.safety}%</p>
                </div>
                <StatusBadge status={driver.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg silver-text">Recent Trips</h3>
            <p className="text-xs text-silver-500 font-mono mt-0.5">Latest dispatch activity</p>
          </div>
          <button className="btn-ghost text-xs flex items-center gap-1">View All <ChevronRight size={12} /></button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                {['Trip ID', 'Vehicle', 'Driver', 'Route', 'Cargo', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left text-xs text-silver-500 uppercase tracking-widest font-mono pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTrips.map((trip, i) => (
                <tr key={trip._id} className="table-row" style={{ animationDelay: `${i * 60}ms` }}>
                  <td className="py-3 pr-4">
                    <span className="text-xs font-mono text-cyan-400">{trip.tripId || trip._id.slice(-6)}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Truck size={12} className="text-silver-500" />
                      <span className="text-xs text-silver-300">{trip.vehicle?.name || trip.vehicle}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-silver-400">{trip.driver?.name || trip.driver}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1 text-xs text-silver-400">
                      <MapPin size={10} className="text-silver-600" />
                      <span>{trip.origin}</span>
                      <ChevronRight size={10} className="text-silver-600" />
                      <span>{trip.destination}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-xs font-mono text-silver-300">{trip.cargo?.toLocaleString()} kg</span>
                  </td>
                  <td className="py-3 pr-4"><StatusBadge status={trip.status} /></td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1 text-xs text-silver-500 font-mono">
                      <Clock size={10} />
                      {new Date(trip.date || trip.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}