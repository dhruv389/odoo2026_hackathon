import { useState } from 'react';
import Layout from '../components/layout/Layout';
import Modal from '../components/ui/Modal';
import { Plus, Fuel, IndianRupee, Gauge, BarChart2 } from 'lucide-react';
import { expenses as initialExpenses, vehicles } from '../data/mockData';

export default function ExpenseFuel() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ tripId: '', driver: '', vehicle: '', distance: '', liters: '', cost: '', date: '' });

  const totalFuel = expenses.reduce((a, e) => a + e.cost, 0);
  const totalLiters = expenses.reduce((a, e) => a + e.liters, 0);
  const avgEfficiency = expenses.reduce((a, e) => a + e.distance / e.liters, 0) / expenses.length;

  const vehicleSummary = vehicles.map(v => {
    const vExpenses = expenses.filter(e => e.vehicle === v.name);
    return {
      name: v.name,
      totalCost: vExpenses.reduce((a, e) => a + e.cost, 0),
      totalLiters: vExpenses.reduce((a, e) => a + e.liters, 0),
      totalKm: vExpenses.reduce((a, e) => a + e.distance, 0),
    };
  }).filter(v => v.totalCost > 0);

  const handleAdd = () => {
    const newExp = { id: `EX-00${expenses.length + 1}`, ...form, distance: Number(form.distance), liters: Number(form.liters), cost: Number(form.cost) };
    setExpenses([newExp, ...expenses]);
    setModalOpen(false);
    setForm({ tripId: '', driver: '', vehicle: '', distance: '', liters: '', cost: '', date: '' });
  };

  return (
    <Layout title="Expense & Fuel" subtitle="Financial tracking per asset">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total Fuel Spend', value: `₹${totalFuel.toLocaleString()}`, icon: IndianRupee, color: 'text-cyan-400 border-cyan-500/20' },
          { label: 'Total Liters', value: `${totalLiters}L`, icon: Fuel, color: 'text-emerald-400 border-emerald-500/20' },
          { label: 'Avg Efficiency', value: `${avgEfficiency.toFixed(1)} km/L`, icon: Gauge, color: 'text-amber-400 border-amber-500/20' },
          { label: 'Expense Entries', value: expenses.length, icon: BarChart2, color: 'text-silver-300 border-white/10' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`glass-card p-4 border ${color.split(' ')[1]}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-silver-500 font-mono uppercase tracking-widest">{label}</p>
              <Icon size={16} className={color.split(' ')[0]} />
            </div>
            <p className={`font-display text-3xl ${color.split(' ')[0]}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Vehicle Cost Summary */}
        <div className="glass-card p-5">
          <h3 className="font-display text-lg silver-text mb-4">Cost Per Vehicle</h3>
          <div className="space-y-4">
            {vehicleSummary.map(v => (
              <div key={v.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-silver-400 truncate flex-1 mr-2">{v.name}</span>
                  <span className="text-xs font-mono text-silver-200">₹{v.totalCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full"
                      style={{ width: `${(v.totalCost / totalFuel) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-silver-600">{v.totalKm} km</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logs table */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg silver-text">Fuel Logs</h3>
            <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-1.5 text-xs text-white px-3 py-2">
              <Plus size={14} /> Add Entry
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  {['Trip', 'Vehicle', 'Driver', 'Distance', 'Liters', 'Cost', 'Date'].map(h => (
                    <th key={h} className="text-left text-xs text-silver-500 uppercase tracking-widest font-mono pb-3 pr-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.map((e, i) => (
                  <tr key={e.id} className="table-row" style={{ animationDelay: `${i * 50}ms` }}>
                    <td className="py-3 pr-3"><span className="text-xs font-mono text-cyan-400">{e.tripId}</span></td>
                    <td className="py-3 pr-3 text-xs text-silver-400">{e.vehicle}</td>
                    <td className="py-3 pr-3 text-xs text-silver-400">{e.driver}</td>
                    <td className="py-3 pr-3 text-xs font-mono text-silver-300">{e.distance} km</td>
                    <td className="py-3 pr-3 text-xs font-mono text-emerald-400">{e.liters}L</td>
                    <td className="py-3 pr-3 text-xs font-mono text-silver-200">₹{e.cost.toLocaleString()}</td>
                    <td className="py-3 pr-3 text-xs font-mono text-silver-500">{e.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Fuel / Expense Entry">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Trip ID</label>
              <input className="input-field" placeholder="TR-2401" value={form.tripId} onChange={e => setForm({...form, tripId: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Vehicle</label>
              <select className="input-field" value={form.vehicle} onChange={e => setForm({...form, vehicle: e.target.value})}>
                <option value="">— Select —</option>
                {vehicles.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Driver Name</label>
            <input className="input-field" placeholder="Driver name" value={form.driver} onChange={e => setForm({...form, driver: e.target.value})} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Distance (km)</label>
              <input className="input-field" type="number" placeholder="0" value={form.distance} onChange={e => setForm({...form, distance: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Liters</label>
              <input className="input-field" type="number" placeholder="0" value={form.liters} onChange={e => setForm({...form, liters: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Cost (₹)</label>
              <input className="input-field" type="number" placeholder="0" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Date</label>
            <input className="input-field" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleAdd} className="btn-primary flex-1 text-white h-10">Save Entry</button>
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1 h-10">Cancel</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}