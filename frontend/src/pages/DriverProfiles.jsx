import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import ToastContainer from '../components/ui/ToastContainer';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { Plus, Search, User, Award, Calendar, Edit, Trash2 } from 'lucide-react';
import { driverAPI } from '../services/api';
import { useToast } from '../hooks/useToast';
import { useConfirm } from '../hooks/useConfirm';

export default function DriverProfiles() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({
    name: '',
    license: '',
    expiry: '',
    category: 'LMV',
    safety: 100
  });

  const { toasts, removeToast, toast } = useToast();
  const { confirmState, confirm, closeConfirm } = useConfirm();

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const data = await driverAPI.getAll();
      setDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = drivers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.license.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditTarget(null);
    setForm({ name: '', license: '', expiry: '', category: 'LMV', safety: 100 });
    setModalOpen(true);
  };

  const openEdit = (d) => {
    setEditTarget(d);
    setForm({
      name: d.name,
      license: d.license,
      expiry: d.expiry ? new Date(d.expiry).toISOString().split('T')[0] : '',
      category: d.category,
      safety: d.safety
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const driverData = {
        ...form,
        safety: Number(form.safety)
      };

      if (editTarget) {
        await driverAPI.update(editTarget._id, driverData);
        toast.success('Driver updated successfully!');
      } else {
        await driverAPI.create(driverData);
        toast.success('Driver created successfully!');
      }

      await fetchDrivers();
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving driver:', error);
      toast.error('Failed to save driver: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: 'Delete Driver',
      message: 'Are you sure you want to delete this driver? This action cannot be undone.',
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });

    if (!confirmed) return;

    try {
      await driverAPI.delete(id);
      await fetchDrivers();
      toast.success('Driver deleted successfully!');
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('Failed to delete driver: ' + error.message);
    }
  };

  const isExpired = (expiry) => new Date(expiry) < new Date();

  if (loading) {
    return (
      <Layout title="Driver Profiles" subtitle="Human resource management">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Driver Profiles" subtitle="Human resource management">
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 text-silver-300 border-white/10">
          <span className="font-display text-xl">{drivers.length}</span>
          <span className="text-xs opacity-80">Total Drivers</span>
        </div>
        <div className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 text-cyan-400 border-cyan-500/20 bg-cyan-500/5">
          <span className="font-display text-xl">{drivers.filter(d => d.status === 'On Duty').length}</span>
          <span className="text-xs opacity-80">On Duty</span>
        </div>
        <div className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 text-red-400 border-red-500/20 bg-red-500/5">
          <span className="font-display text-xl">{drivers.filter(d => isExpired(d.expiry)).length}</span>
          <span className="text-xs opacity-80">Expired License</span>
        </div>
        <button onClick={openNew} className="btn-primary ml-auto flex items-center gap-2 text-white">
          <Plus size={16} /> Add Driver
        </button>
      </div>

      <div className="glass-card p-4 mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-500" />
          <input
            className="input-field pl-9 text-xs"
            placeholder="Search by name or license..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d, i) => (
          <div key={d._id} className="glass-card p-5 hover:border-cyan-500/30 transition-all duration-300" style={{ animation: `fadeUp 0.3s ease-out ${i * 50}ms both` }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-700 to-obsidian-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{d.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <h3 className="font-display text-sm silver-text">{d.name}</h3>
                  <p className="text-xs text-silver-500 font-mono">{d.license}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(d)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                  <Edit size={14} className="text-silver-500" />
                </button>
                <button onClick={() => handleDelete(d._id)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-silver-500">Category</span>
                <span className="text-silver-300 font-mono">{d.category}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-silver-500 flex items-center gap-1"><Calendar size={12} /> License Expiry</span>
                <span className={`font-mono ${isExpired(d.expiry) ? 'text-red-400' : 'text-silver-300'}`}>
                  {new Date(d.expiry).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-silver-500 flex items-center gap-1"><Award size={12} /> Safety Score</span>
                <span className="text-emerald-400 font-mono">{d.safety}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-silver-500">Completion Rate</span>
                <span className="text-silver-300 font-mono">{d.trips > 0 ? Math.round((d.completed / d.trips) * 100) : 0}%</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <StatusBadge status={d.status} />
              <span className="text-xs text-silver-500 font-mono">{d.trips} trips</span>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Driver' : 'Add New Driver'}>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Full Name</label>
            <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Mercer" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">License Number</label>
              <input className="input-field" value={form.license} onChange={e => setForm({ ...form, license: e.target.value })} placeholder="MH20230045" />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Category</label>
              <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option>LMV</option>
                <option>HMV</option>
                <option>MCWG</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">License Expiry</label>
              <input className="input-field" type="date" value={form.expiry} onChange={e => setForm({ ...form, expiry: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Safety Score (%)</label>
              <input className="input-field" type="number" min="0" max="100" value={form.safety} onChange={e => setForm({ ...form, safety: e.target.value })} />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button>
            <button onClick={handleSave} className="btn-primary flex-1 text-white">{editTarget ? 'Update' : 'Add'}</button>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ConfirmDialog {...confirmState} onClose={closeConfirm} />
    </Layout>
  );
}
