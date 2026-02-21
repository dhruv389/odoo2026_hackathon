import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { Plus, Search, Filter, Truck, Edit, Trash2, Gauge, Weight, MoreVertical } from 'lucide-react';
import { vehicleAPI } from '../services/api';

const typeColors = {
  Truck: 'text-cyan-400 bg-cyan-500/10',
  Van: 'text-emerald-400 bg-emerald-500/10',
  Bike: 'text-amber-400 bg-amber-500/10',
};

export default function VehicleRegistry() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({ name: '', plate: '', type: 'Truck', capacity: '', odometer: '', fuel: 'Diesel', acquisitionCost: '' });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await vehicleAPI.getAll();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = vehicles.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.plate.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'All' || v.type === filterType;
    const matchStatus = filterStatus === 'All' || v.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const openNew = () => { 
    setEditTarget(null); 
    setForm({ name: '', plate: '', type: 'Truck', capacity: '', odometer: '', fuel: 'Diesel', acquisitionCost: '' }); 
    setModalOpen(true); 
  };
  
  const openEdit = (v) => { 
    setEditTarget(v); 
    setForm({ 
      name: v.name, 
      plate: v.plate, 
      type: v.type, 
      capacity: v.capacity, 
      odometer: v.odometer, 
      fuel: v.fuel,
      acquisitionCost: v.acquisitionCost || ''
    }); 
    setModalOpen(true); 
  };

  const handleSave = async () => {
    try {
      const vehicleData = {
        ...form,
        capacity: Number(form.capacity),
        odometer: Number(form.odometer),
        acquisitionCost: Number(form.acquisitionCost) || 0
      };

      if (editTarget) {
        await vehicleAPI.update(editTarget._id, vehicleData);
      } else {
        await vehicleAPI.create(vehicleData);
      }
      
      await fetchVehicles();
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert('Failed to save vehicle: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
      await vehicleAPI.delete(id);
      await fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Failed to delete vehicle: ' + error.message);
    }
  };

  if (loading) {
    return (
      <Layout title="Vehicle Registry" subtitle="Asset lifecycle management">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Vehicle Registry" subtitle="Asset lifecycle management">
      {/* Summary pills */}
      <div className="flex flex-wrap gap-3 mb-5">
        {[
          { label: 'Total Assets', count: vehicles.length, cls: 'text-silver-300 border-white/10' },
          { label: 'On Trip', count: vehicles.filter(v => v.status === 'On Trip').length, cls: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' },
          { label: 'Available', count: vehicles.filter(v => v.status === 'Available').length, cls: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
          { label: 'In Shop', count: vehicles.filter(v => v.status === 'In Shop').length, cls: 'text-amber-400 border-amber-500/20 bg-amber-500/5' },
        ].map(({ label, count, cls }) => (
          <div key={label} className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 ${cls}`}>
            <span className="font-display text-xl">{count}</span>
            <span className="text-xs opacity-80">{label}</span>
          </div>
        ))}
        <button onClick={openNew} className="btn-primary ml-auto flex items-center gap-2 text-white">
          <Plus size={16} /> Register Vehicle
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-500" />
          <input className="input-field pl-9 text-xs" placeholder="Search by name or plate..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-silver-500" />
          {['All', 'Truck', 'Van', 'Bike'].map(t => (
            <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterType === t ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'text-silver-500 hover:text-silver-300 border border-transparent'}`}>{t}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {['All', 'Available', 'On Trip', 'In Shop'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === s ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'text-silver-500 hover:text-silver-300 border border-transparent'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((v, i) => (
          <div key={v._id} className="glass-card p-5 hover:border-cyan-500/30 transition-all duration-300 group" style={{ animation: `fadeUp 0.3s ease-out ${i * 50}ms both` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${typeColors[v.type]} flex items-center justify-center`}>
                  <Truck size={18} />
                </div>
                <div>
                  <h3 className="font-display text-sm silver-text">{v.name}</h3>
                  <p className="text-xs text-silver-500 font-mono">{v.plate}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(v)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                  <Edit size={14} className="text-silver-500" />
                </button>
                <button onClick={() => handleDelete(v._id)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-silver-500 flex items-center gap-1"><Weight size={12} /> Capacity</span>
                <span className="text-silver-300 font-mono">{v.capacity.toLocaleString()} kg</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-silver-500 flex items-center gap-1"><Gauge size={12} /> Odometer</span>
                <span className="text-silver-300 font-mono">{v.odometer.toLocaleString()} km</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-silver-500">Fuel Type</span>
                <span className="text-silver-300">{v.fuel}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <StatusBadge status={v.status} />
              <span className={`text-xs px-2 py-1 rounded ${typeColors[v.type]}`}>{v.type}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Truck size={48} className="mx-auto text-silver-600 mb-3" />
          <p className="text-silver-400">No vehicles found matching your filters</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Vehicle' : 'Register New Vehicle'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Vehicle Name</label>
              <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Titan Hauler Pro" />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">License Plate</label>
              <input className="input-field" value={form.plate} onChange={e => setForm({ ...form, plate: e.target.value })} placeholder="MH-01-2024" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Type</label>
              <select className="input-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option>Truck</option>
                <option>Van</option>
                <option>Bike</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Fuel Type</label>
              <select className="input-field" value={form.fuel} onChange={e => setForm({ ...form, fuel: e.target.value })}>
                <option>Diesel</option>
                <option>Petrol</option>
                <option>CNG</option>
                <option>Electric</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Max Capacity (kg)</label>
              <input className="input-field" type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} placeholder="8000" />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Odometer (km)</label>
              <input className="input-field" type="number" value={form.odometer} onChange={e => setForm({ ...form, odometer: e.target.value })} placeholder="84320" />
            </div>
          </div>

          <div>
            <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Acquisition Cost (₹)</label>
            <input className="input-field" type="number" value={form.acquisitionCost} onChange={e => setForm({ ...form, acquisitionCost: e.target.value })} placeholder="2500000" />
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button>
            <button onClick={handleSave} className="btn-primary flex-1 text-white">{editTarget ? 'Update' : 'Register'}</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
