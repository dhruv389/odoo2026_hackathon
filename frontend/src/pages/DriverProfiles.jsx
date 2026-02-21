import { useState } from 'react';
import Layout from '../components/layout/Layout';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { Plus, Shield, AlertTriangle, User, Award, Calendar } from 'lucide-react';
import { drivers as initialDrivers } from '../data/mockData';

function SafetyRing({ score }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score >= 90 ? '#34d399' : score >= 75 ? '#fbbf24' : '#fb7185';

  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="rotate-[-90deg]">
      <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
      <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease' }} />
    </svg>
  );
}

export default function DriverProfiles() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', license: '', expiry: '', category: 'LMV', status: 'Off Duty' });

  const today = new Date();
  const isExpired = (expiry) => new Date(expiry) < today;
  const daysUntilExpiry = (expiry) => Math.ceil((new Date(expiry) - today) / (1000 * 60 * 60 * 24));

  const toggleStatus = (id) => {
    setDrivers(ds => ds.map(d => {
      if (d.id !== id) return d;
      const cycle = { 'On Duty': 'Off Duty', 'Off Duty': 'On Duty', 'Suspended': 'Suspended' };
      return { ...d, status: cycle[d.status] || d.status };
    }));
  };

  const handleAdd = () => {
    const newDriver = { id: `DR-00${drivers.length + 1}`, ...form, trips: 0, completed: 0, safety: 95, vehicle: null };
    setDrivers([...drivers, newDriver]);
    setModalOpen(false);
    setForm({ name: '', license: '', expiry: '', category: 'LMV', status: 'Off Duty' });
  };

  return (
    <Layout title="Driver Profiles" subtitle="Compliance, performance & safety management">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total Drivers', count: drivers.length, color: 'text-silver-300' },
          { label: 'On Duty', count: drivers.filter(d => d.status === 'On Duty').length, color: 'text-cyan-400' },
          { label: 'Suspended', count: drivers.filter(d => d.status === 'Suspended').length, color: 'text-rose-400' },
          { label: 'License Alerts', count: drivers.filter(d => daysUntilExpiry(d.expiry) <= 30).length, color: 'text-amber-400' },
        ].map(({ label, count, color }) => (
          <div key={label} className="glass-card p-4">
            <p className="text-xs text-silver-500 font-mono uppercase tracking-widest mb-1">{label}</p>
            <p className={`font-display text-4xl ${color}`}>{count}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2 text-white">
          <Plus size={16} /> Add Driver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {drivers.map((driver, i) => {
          const expired = isExpired(driver.expiry);
          const days = daysUntilExpiry(driver.expiry);
          const expiryWarn = days <= 30;

          return (
            <div
              key={driver.id}
              className="glass-card-hover p-5 group relative"
              style={{ animation: `fadeUp 0.4s ease-out ${i * 60}ms both` }}
            >
              {/* Suspended overlay */}
              {driver.status === 'Suspended' && (
                <div className="absolute inset-0 rounded-xl bg-rose-500/5 border border-rose-500/20 pointer-events-none" />
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                    <SafetyRing score={driver.safety} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-obsidian-700 border border-white/8 flex items-center justify-center">
                        <span className="text-xs font-bold text-silver-300">
                          {driver.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-silver-100">{driver.name}</h3>
                    <p className="text-xs text-silver-500 font-mono">{driver.id} · {driver.category}</p>
                  </div>
                </div>
                <StatusBadge status={driver.status} />
              </div>

              {/* License */}
              <div className={`flex items-center gap-2 p-2.5 rounded-lg mb-3 ${expired ? 'bg-rose-500/10 border border-rose-500/25' : expiryWarn ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-white/3 border border-white/6'}`}>
                {expired || expiryWarn ? <AlertTriangle size={13} className={expired ? 'text-rose-400' : 'text-amber-400'} /> : <Shield size={13} className="text-emerald-400" />}
                <div className="flex-1">
                  <p className="text-xs font-mono text-silver-300">{driver.license}</p>
                  <p className={`text-xs ${expired ? 'text-rose-400' : expiryWarn ? 'text-amber-400' : 'text-silver-500'}`}>
                    {expired ? `Expired ${Math.abs(days)} days ago` : `Expires in ${days} days`}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <p className="font-display text-xl text-silver-200">{driver.trips}</p>
                  <p className="text-xs text-silver-600">Trips</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-xl text-emerald-400">{Math.round((driver.completed / driver.trips) * 100) || 0}%</p>
                  <p className="text-xs text-silver-600">Completion</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-xl text-cyan-400">{driver.safety}</p>
                  <p className="text-xs text-silver-600">Safety</p>
                </div>
              </div>

              {/* Toggle status */}
              {driver.status !== 'Suspended' && (
                <button
                  onClick={() => toggleStatus(driver.id)}
                  className="w-full py-1.5 rounded-lg text-xs font-medium border border-white/8 text-silver-500 hover:text-silver-200 hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
                >
                  Toggle {driver.status === 'On Duty' ? 'Off Duty' : 'On Duty'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Driver Profile">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Full Name</label>
            <input className="input-field" placeholder="Driver full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">License Number</label>
              <input className="input-field" placeholder="e.g. MH20230099" value={form.license} onChange={e => setForm({...form, license: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Expiry Date</label>
              <input className="input-field" type="date" value={form.expiry} onChange={e => setForm({...form, expiry: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">License Category</label>
              <select className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {['LMV', 'HMV', 'HPMV', 'TRANS'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Initial Status</label>
              <select className="input-field" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                {['Off Duty', 'On Duty'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleAdd} className="btn-primary flex-1 text-white h-10">Create Profile</button>
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1 h-10">Cancel</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}