import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { TrendingUp, DollarSign, Fuel, Wrench, Download } from 'lucide-react';
import { analyticsAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [dashData, analyticsData] = await Promise.all([
        analyticsAPI.getDashboard().catch(() => null),
        analyticsAPI.getAnalytics().catch(() => null)
      ]);
      
      console.log('Analytics data:', { dashData, analyticsData });
      
      // Combine both responses
      const combined = {
        ...dashData,
        ...analyticsData,
        utilization: dashData?.fleet?.utilization || 0,
        totalRevenue: analyticsData?.summary?.totalOperationalCost * 1.5 || 0,
        fuelCost: analyticsData?.summary?.totalFuelCost || 0,
        maintenanceCost: analyticsData?.summary?.totalMaintenanceCost || 0,
        totalCost: analyticsData?.summary?.totalOperationalCost || 0,
        avgCostPerTrip: dashData?.trips?.completed > 0 
          ? (analyticsData?.summary?.totalOperationalCost || 0) / dashData.trips.completed 
          : 0,
        avgEfficiency: analyticsData?.fuelEfficiency?.length > 0
          ? analyticsData.fuelEfficiency.reduce((sum, f) => sum + f.efficiency, 0) / analyticsData.fuelEfficiency.length
          : 0,
        vehiclesByStatus: dashData?.fleet ? [
          { name: 'On Trip', value: dashData.fleet.active },
          { name: 'Available', value: dashData.fleet.available },
          { name: 'In Shop', value: dashData.fleet.inShop }
        ].filter(v => v.value > 0) : [],
        vehiclesByType: [],
        topDrivers: []
      };
      
      setAnalytics(combined);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Analytics & Reports" subtitle="Data-driven insights">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const vehicleStatusData = analytics?.vehiclesByStatus || [];
  const vehicleTypeData = analytics?.vehiclesByType || [];

  return (
    <Layout title="Analytics & Reports" subtitle="Data-driven insights">
      <div className="flex justify-end mb-5">
        <button className="btn-primary flex items-center gap-2 text-white">
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <TrendingUp size={18} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-silver-500 uppercase tracking-widest font-mono">Fleet Utilization</p>
              <p className="font-display text-2xl text-cyan-400">{analytics?.utilization || 0}%</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <DollarSign size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-silver-500 uppercase tracking-widest font-mono">Total Revenue</p>
              <p className="font-display text-2xl text-emerald-400">₹{((analytics?.totalRevenue || 0) / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Fuel size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-silver-500 uppercase tracking-widest font-mono">Fuel Costs</p>
              <p className="font-display text-2xl text-amber-400">₹{((analytics?.fuelCost || 0) / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <Wrench size={18} className="text-rose-400" />
            </div>
            <div>
              <p className="text-xs text-silver-500 uppercase tracking-widest font-mono">Maintenance</p>
              <p className="font-display text-2xl text-rose-400">₹{((analytics?.maintenanceCost || 0) / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Vehicle Status Distribution */}
        <div className="glass-card p-5">
          <h3 className="font-display text-lg silver-text mb-4">Fleet Status Distribution</h3>
          {vehicleStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={vehicleStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vehicleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-silver-500">
              No data available
            </div>
          )}
        </div>

        {/* Vehicle Type Distribution */}
        <div className="glass-card p-5">
          <h3 className="font-display text-lg silver-text mb-4">Fleet by Vehicle Type</h3>
          {vehicleTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={vehicleTypeData}>
                <XAxis dataKey="name" tick={{ fill: '#636d82', fontSize: 11 }} />
                <YAxis tick={{ fill: '#636d82', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-silver-500">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="glass-card p-5">
        <h3 className="font-display text-lg silver-text mb-4">Financial Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-2">Total Operational Cost</p>
            <p className="font-display text-3xl text-silver-300">₹{((analytics?.totalCost || 0) / 1000).toFixed(1)}K</p>
            <p className="text-xs text-silver-500 mt-2">Fuel + Maintenance</p>
          </div>

          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-2">Average Cost per Trip</p>
            <p className="font-display text-3xl text-silver-300">₹{analytics?.avgCostPerTrip?.toFixed(0) || 0}</p>
            <p className="text-xs text-silver-500 mt-2">Based on completed trips</p>
          </div>

          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-2">Fleet Efficiency</p>
            <p className="font-display text-3xl text-silver-300">{analytics?.avgEfficiency?.toFixed(2) || 0} km/L</p>
            <p className="text-xs text-silver-500 mt-2">Average fuel efficiency</p>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      {analytics?.topDrivers && analytics.topDrivers.length > 0 && (
        <div className="glass-card p-5 mt-4">
          <h3 className="font-display text-lg silver-text mb-4">Top Performing Drivers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.topDrivers.slice(0, 3).map((driver, i) => (
              <div key={i} className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-700 to-obsidian-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{driver.name?.split(' ').map(n => n[0]).join('') || 'N/A'}</span>
                  </div>
                  <div>
                    <p className="text-sm text-silver-300 font-medium">{driver.name}</p>
                    <p className="text-xs text-silver-500 font-mono">Safety: {driver.safety}%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-silver-500">Trips Completed</span>
                  <span className="text-cyan-400 font-mono">{driver.completed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
