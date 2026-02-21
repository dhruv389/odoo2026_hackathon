import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { Plus, Wrench, Calendar, DollarSign, Truck } from 'lucide-react';
import { maintenanceAPI, vehicleAPI } from '../services/api';

export default function Maintenance() {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    vehicle: '',
    type: '',
    cost: '',
    tech: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [logsData, vehiclesData] = await Promise.all([
        maintenanceAPI.getAll(),
        vehicleAPI.getAll()
      ]);
      setLogs(logsData);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await maintenanceAPI.create({
        ...form,
        cost: Number(form.cost)
      });

      await fetchData();
      setModalOpen(false);
      setForm({ vehicle: '', type: '', cost: '', tech: '', date: new Date().toISOString().split('T')[0] });
    } catch (error) {
      console.error('Error creating maintenance log:', error);
      alert('Failed to create maintenance log: ' + error.message);
    }
  };

  const totalCost = logs.reduce((sum, log) => sum + (log.cost || 0), 0);

  if (loading) {
    return (
      <Layout title="Maintenance & Service" subtitle="Vehicle health tracking">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Maintenance & Service" subtitle="Vehicle health tracking">
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 text-silver-300 border-white/10">
          <span className="font-display text-xl">{logs.length}</span>
          <span className="text-xs opacity-80">Total Logs</span>
        </div>
        <div className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 text-amber-400 border-amber-500/20 bg-amber-500/5">
          <span className="font-display text-xl">{logs.filter(l => l.status === 'In Progress').length}</span>
          <span className="text-xs opacity-80">In Progress</span>
        </div>
        <div className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 text-emerald-400 border-emerald-500/20 bg-emerald-500/5">
          <span className="font-display text-xl">₹{(totalCost / 1000).toFixed(1)}K</span>
          <span className="text-xs opacity-80">Total Cost</span>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary ml-auto flex items-center gap-2 text-white">
          <Plus size={16} /> Log Service
        </button>
      </div>

      <div className="glass-card p-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                {['Vehicle', 'Service Type', 'Date', 'Cost', 'Technician', 'Status'].map(h => (
                  <th key={h} className="text-left text-xs text-silver-500 uppercase tracking-widest font-mono pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={log._id} className="table-row" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Truck size={12} className="text-silver-500" />
                      <span className="text-xs text-silver-300">{log.vehicle?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Wrench size={12} className="text-amber-400" />
                      <span className="text-xs text-silver-300">{log.type}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1 text-xs text-silver-400 font-mono">
                      <Calendar size={10} />
                      {new Date(log.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
                      <DollarSign size={10} />
                      ₹{log.cost?.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-silver-400">{log.tech}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={log.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Maintenance Service">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Select Vehicle</label>
            <select className="input-field" value={form.vehicle} onChange={e => setForm({ ...form, vehicle: e.target.value })}>
              <option value="">Choose vehicle...</option>
              {vehicles.map(v => (
                <option key={v._id} value={v._id}>{v.name} - {v.plate}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Service Type</label>
            <input className="input-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} placeholder="Oil Change + Filter" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Service Date</label>
              <input className="input-field" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Cost (₹)</label>
              <input className="input-field" type="number" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} placeholder="3500" />
            </div>
          </div>

          <div>
            <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Technician/Shop</label>
            <input className="input-field" value={form.tech} onChange={e => setForm({ ...form, tech: e.target.value })} placeholder="FastLane Service" />
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button>
            <button onClick={handleCreate} className="btn-primary flex-1 text-white">Log Service</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
