import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Modal from '../components/ui/Modal';
import ToastContainer from '../components/ui/ToastContainer';
import { Plus, Fuel, DollarSign, Calendar, Truck, TrendingUp } from 'lucide-react';
import { expenseAPI, tripAPI } from '../services/api';
import { useToast } from '../hooks/useToast';

export default function ExpenseFuel() {
  const [expenses, setExpenses] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    trip: '',
    liters: '',
    cost: '',
    distance: '',
    date: new Date().toISOString().split('T')[0]
  });

  const { toasts, removeToast, toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expensesData, tripsData] = await Promise.all([
        expenseAPI.getAll(),
        tripAPI.getAll()
      ]);
      setExpenses(expensesData);
      setTrips(tripsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const selectedTrip = trips.find(t => t._id === form.trip);
      
      await expenseAPI.create({
        trip: form.trip,
        tripId: selectedTrip?.tripId || selectedTrip?._id.slice(-6),
        driver: selectedTrip?.driver?.name || selectedTrip?.driver,
        vehicle: selectedTrip?.vehicle?.name || selectedTrip?.vehicle,
        liters: Number(form.liters),
        cost: Number(form.cost),
        distance: Number(form.distance),
        date: form.date
      });

      await fetchData();
      setModalOpen(false);
      setForm({ trip: '', liters: '', cost: '', distance: '', date: new Date().toISOString().split('T')[0] });
      toast.success('Fuel expense recorded successfully!');
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Failed to create expense: ' + error.message);
    }
  };

  const totalCost = expenses.reduce((sum, exp) => sum + (exp.cost || 0), 0);
  const totalLiters = expenses.reduce((sum, exp) => sum + (exp.liters || 0), 0);
  const totalDistance = expenses.reduce((sum, exp) => sum + (exp.distance || 0), 0);
  const avgEfficiency = totalDistance && totalLiters ? (totalDistance / totalLiters).toFixed(2) : 0;

  if (loading) {
    return (
      <Layout title="Expense & Fuel" subtitle="Financial tracking">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Expense & Fuel" subtitle="Financial tracking">
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 text-silver-300 border-white/10">
          <span className="font-display text-xl">₹{(totalCost / 1000).toFixed(1)}K</span>
          <span className="text-xs opacity-80">Total Fuel Cost</span>
        </div>
        <div className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 text-cyan-400 border-cyan-500/20 bg-cyan-500/5">
          <span className="font-display text-xl">{totalLiters.toFixed(0)}L</span>
          <span className="text-xs opacity-80">Total Liters</span>
        </div>
        <div className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 text-emerald-400 border-emerald-500/20 bg-emerald-500/5">
          <span className="font-display text-xl">{avgEfficiency}</span>
          <span className="text-xs opacity-80">km/L Avg</span>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary ml-auto flex items-center gap-2 text-white">
          <Plus size={16} /> Log Expense
        </button>
      </div>

      <div className="glass-card p-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                {['Trip ID', 'Vehicle', 'Driver', 'Distance', 'Liters', 'Cost', 'Efficiency', 'Date'].map(h => (
                  <th key={h} className="text-left text-xs text-silver-500 uppercase tracking-widest font-mono pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp, i) => (
                <tr key={exp._id} className="table-row" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="py-3 pr-4">
                    <span className="text-xs font-mono text-cyan-400">{exp.tripId}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Truck size={12} className="text-silver-500" />
                      <span className="text-xs text-silver-300">{exp.vehicle}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-silver-400">{exp.driver}</td>
                  <td className="py-3 pr-4">
                    <span className="text-xs font-mono text-silver-300">{exp.distance} km</span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1 text-xs text-silver-300 font-mono">
                      <Fuel size={10} className="text-amber-400" />
                      {exp.liters}L
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
                      <DollarSign size={10} />
                      ₹{exp.cost?.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1 text-xs text-cyan-400 font-mono">
                      <TrendingUp size={10} />
                      {(exp.distance / exp.liters).toFixed(2)} km/L
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1 text-xs text-silver-500 font-mono">
                      <Calendar size={10} />
                      {new Date(exp.date).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Fuel Expense">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Select Trip</label>
            <select className="input-field" value={form.trip} onChange={e => setForm({ ...form, trip: e.target.value })}>
              <option value="">Choose trip...</option>
              {trips.filter(t => t.status === 'Completed').map(t => (
                <option key={t._id} value={t._id}>
                  {t.tripId || t._id.slice(-6)} - {t.vehicle?.name || t.vehicle} ({t.origin} → {t.destination})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Distance (km)</label>
              <input className="input-field" type="number" value={form.distance} onChange={e => setForm({ ...form, distance: e.target.value })} placeholder="210" />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Liters</label>
              <input className="input-field" type="number" value={form.liters} onChange={e => setForm({ ...form, liters: e.target.value })} placeholder="18" />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Cost (₹)</label>
              <input className="input-field" type="number" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} placeholder="1600" />
            </div>
          </div>

          <div>
            <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Date</label>
            <input className="input-field" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button>
            <button onClick={handleCreate} className="btn-primary flex-1 text-white">Log Expense</button>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </Layout>
  );
}
