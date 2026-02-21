import { useState } from 'react';
import Layout from '../components/layout/Layout';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { Plus, Wrench, AlertCircle, CheckCircle, Clock, IndianRupee } from 'lucide-react';
import { maintenance as initialMaintenance, vehicles } from '../data/mockData';

export default function Maintenance() {
  const [logs, setLogs] = useState(initialMaintenance);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ vehicle: '', type: '', date: '', cost: '', tech: '', notes: '' });

  const totalCost = logs.reduce((a, l) => a + l.cost, 0);
  const inProgress = logs.filter(l => l.status === 'In Progress').length;

  const handleCreate = () => {
    const newLog = {
      id: `SV-00${logs.length + 1}`,
      ...form,
      cost: Number(form.cost),
      status: 'In Progress',
    };
    setLogs([newLog, ...logs]);
    setForm({ vehicle: '', type: '', date: '', cost: '', tech: '', notes: '' });
    setModalOpen(false);
  };

  const markComplete = (id) => setLogs(ls => ls.map(l => l.id === id ? { ...l, status: 'Completed' } : l));

  return (
    <Layout title="Maintenance & Service" subtitle="Fleet health & preventive care">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="glass-card p-4 border border-amber-500/20">
          <p className="text-xs text-silver-500 font-mono uppercase tracking-widest mb-2">Active Jobs</p>
          <p className="font-display text-4xl text-amber-400">{inProgress}</p>
          <p className="text-xs text-silver-500 mt-1">vehicles in service bay</p>
        </div>
        <div className="glass-card p-4 border border-emerald-500/20">
          <p className="text-xs text-silver-500 font-mono uppercase tracking-widest mb-2">Completed Jobs</p>
          <p className="font-display text-4xl text-emerald-400">{logs.filter(l => l.status === 'Completed').length}</p>
          <p className="text-xs text-silver-500 mt-1">this period</p>
        </div>
        <div className="glass-card p-4 border border-cyan-500/20">
          <p className="text-xs text-silver-500 font-mono uppercase tracking-widest mb-2">Total Cost</p>
          <p className="font-display text-4xl text-cyan-400">₹{(totalCost / 1000).toFixed(0)}K</p>
          <p className="text-xs text-silver-500 mt-1">maintenance spend</p>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2 text-white">
          <Plus size={16} /> Log Service
        </button>
      </div>

      {/* Service Timeline */}
      <div className="space-y-3">
        {logs.map((log, i) => (
          <div
            key={log.id}
            className="glass-card-hover p-5 group"
            style={{ animation: `fadeUp 0.4s ease-out ${i * 60}ms both` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${log.status === 'In Progress' ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  <Wrench size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-silver-200">{log.type}</h3>
                    <span className="text-xs font-mono text-silver-600">{log.id}</span>
                  </div>
                  <p className="text-xs text-silver-500 mt-0.5">{log.vehicle} · {log.tech}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium text-silver-200">
                    <IndianRupee size={13} />
                    {log.cost.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-silver-500 font-mono mt-0.5">
                    <Clock size={11} />
                    {log.date}
                  </div>
                </div>
                <StatusBadge status={log.status} />
                {log.status === 'In Progress' && (
                  <button
                    onClick={() => markComplete(log.id)}
                    className="p-2 rounded-lg text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all opacity-0 group-hover:opacity-100"
                    title="Mark Complete"
                  >
                    <CheckCircle size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info banner */}
      <div className="mt-4 glass-card p-4 flex items-start gap-3 border border-amber-500/15">
        <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-silver-400">When a service log is created, the vehicle is automatically moved to <span className="text-amber-400 font-medium">In Shop</span> status and removed from the dispatcher's available pool. It returns to <span className="text-emerald-400 font-medium">Available</span> only when the job is marked complete.</p>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log New Service Entry">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Vehicle</label>
              <select className="input-field" value={form.vehicle} onChange={e => setForm({...form, vehicle: e.target.value})}>
                <option value="">— Select Vehicle —</option>
                {vehicles.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Service Type</label>
              <input className="input-field" placeholder="e.g. Oil Change, Tyre Check" value={form.type} onChange={e => setForm({...form, type: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Date</label>
              <input className="input-field" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Cost (₹)</label>
              <input className="input-field" type="number" placeholder="0" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Technician / Workshop</label>
            <input className="input-field" placeholder="e.g. QuickFix Motors" value={form.tech} onChange={e => setForm({...form, tech: e.target.value})} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleCreate} className="btn-primary flex-1 text-white h-10">Create Service Log</button>
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1 h-10">Cancel</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}