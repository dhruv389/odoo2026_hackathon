import { useState } from 'react';
import Layout from '../components/layout/Layout';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { Plus, Search, Filter, Truck, Edit, Trash2, Gauge, Weight, MoreVertical } from 'lucide-react';
import { vehicles as initialVehicles } from '../data/mockData';

const typeColors = {
  Truck: 'text-cyan-400 bg-cyan-500/10',
  Van: 'text-emerald-400 bg-emerald-500/10',
  Bike: 'text-amber-400 bg-amber-500/10',
};

export default function VehicleRegistry() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({ name: '', plate: '', type: 'Truck', capacity: '', odometer: '', fuel: 'Diesel' });

  const filtered = vehicles.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.plate.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'All' || v.type === filterType;
    const matchStatus = filterStatus === 'All' || v.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const openNew = () => { setEditTarget(null); setForm({ name: '', plate: '', type: 'Truck', capacity: '', odometer: '', fuel: 'Diesel' }); setModalOpen(true); };
  const openEdit = (v) => { setEditTarget(v); setForm({ name: v.name, plate: v.plate, type: v.type, capacity: v.capacity, odometer: v.odometer, fuel: v.fuel }); setModalOpen(true); };

  const handleSave = () => {
    if (editTarget) {
      setVehicles(vs => vs.map(v => v.id === editTarget.id ? { ...v, ...form, capacity: Number(form.capacity), odometer: Number(form.odometer) } : v));
    } else {
      const newV = { id: `VH-00${vehicles.length + 1}`, status: 'Available', driver: null, ...form, capacity: Number(form.capacity), odometer: Number(form.odometer) };
      setVehicles(vs => [...vs, newV]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => setVehicles(vs => vs.filter(v => v.id !== id));

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

      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((v, i) => (
          <div
            key={v.id}
            className="glass-card-hover p-5 group"
            style={{ animation: `fadeUp 0.4s ease-out ${i * 60}ms both` }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-obsidian-700 border border-white/8 flex items-center justify-center">
                  <Truck size={18} className="text-silver-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-silver-100">{v.name}</h3>
                  <p className="text-xs text-silver-500 font-mono">{v.plate}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(v)} className="p-1.5 rounded-lg text-silver-600 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all opacity-0 group-hover:opacity-100">
                  <Edit size={13} />
                </button>
                <button onClick={() => handleDelete(v.id)} className="p-1.5 rounded-lg text-silver-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Type + Status */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[v.type] || 'text-silver-400 bg-white/5'}`}>{v.type}</span>
              <StatusBadge status={v.status} />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/3 rounded-lg p-2.5 text-center">
                <Weight size={12} className="text-silver-500 mx-auto mb-1" />
                <p className="text-xs font-mono text-silver-200">{(v.capacity / 1000).toFixed(1)}t</p>
                <p className="text-xs text-silver-600">Capacity</p>
              </div>
              <div className="bg-white/3 rounded-lg p-2.5 text-center">
                <Gauge size={12} className="text-silver-500 mx-auto mb-1" />
                <p className="text-xs font-mono text-silver-200">{v.odometer.toLocaleString()}</p>
                <p className="text-xs text-silver-600">Odometer</p>
              </div>
              <div className="bg-white/3 rounded-lg p-2.5 text-center">
                <div className="text-silver-500 text-xs mx-auto mb-1 font-mono">⛽</div>
                <p className="text-xs font-mono text-silver-200">{v.fuel}</p>
                <p className="text-xs text-silver-600">Fuel</p>
              </div>
            </div>

            {/* Driver */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-xs text-silver-600">Driver</span>
              {v.driver
                ? <span className="text-xs text-silver-300 font-medium">{v.driver}</span>
                : <span className="text-xs text-silver-600 italic">Unassigned</span>
              }
            </div>

            {/* ID tag */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-mono text-silver-700">{v.id}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Truck size={40} className="text-silver-700 mx-auto mb-3" />
          <p className="text-silver-500">No vehicles match your filters</p>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Vehicle' : 'Register New Vehicle'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Vehicle Name / Model</label>
              <input className="input-field" placeholder="e.g. Titan Hauler Pro" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">License Plate</label>
              <input className="input-field" placeholder="e.g. MH-01-2024" value={form.plate} onChange={e => setForm({...form, plate: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Type</label>
              <select className="input-field" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                {['Truck', 'Van', 'Bike'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Max Capacity (kg)</label>
              <input className="input-field" type="number" placeholder="8000" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Fuel Type</label>
              <select className="input-field" value={form.fuel} onChange={e => setForm({...form, fuel: e.target.value})}>
                {['Diesel', 'Petrol', 'CNG', 'Electric'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Current Odometer (km)</label>
            <input className="input-field" type="number" placeholder="0" value={form.odometer} onChange={e => setForm({...form, odometer: e.target.value})} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="btn-primary flex-1 text-white h-10">
              {editTarget ? 'Save Changes' : 'Register Vehicle'}
            </button>
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1 h-10">Cancel</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}