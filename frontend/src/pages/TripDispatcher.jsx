import { useState } from 'react';
import Layout from '../components/layout/Layout';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { Plus, MapPin, ChevronRight, Truck, User, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { trips as initialTrips, vehicles, drivers } from '../data/mockData';

const statusColors = {
  Dispatched: 'border-l-cyan-500',
  Completed: 'border-l-emerald-500',
  Cancelled: 'border-l-rose-500',
  Draft: 'border-l-silver-500',
};

export default function TripDispatcher() {
  const [trips, setTrips] = useState(initialTrips);
  const [modalOpen, setModalOpen] = useState(false);
  const [validation, setValidation] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [form, setForm] = useState({
    vehicle: '',
    driver: '',
    cargo: '',
    origin: '',
    destination: '',
    fuelEstimate: '',
  });

  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  const availableDrivers = drivers.filter(d => d.status === 'Off Duty' || d.status === 'Available');

  const selectedVehicle = vehicles.find(v => v.name === form.vehicle);
  const cargoNum = Number(form.cargo);

  const handleDispatch = () => {
    if (selectedVehicle && cargoNum > selectedVehicle.capacity) {
      setValidation({ type: 'error', msg: `Cargo (${cargoNum} kg) exceeds vehicle max capacity (${selectedVehicle.capacity} kg). Please reduce load or choose a larger vehicle.` });
      return;
    }
    if (!form.vehicle || !form.driver || !form.origin || !form.destination || !form.cargo) {
      setValidation({ type: 'error', msg: 'Please fill in all required fields before dispatching.' });
      return;
    }
    const newTrip = {
      id: `TR-24${String(trips.length + 10).padStart(2, '0')}`,
      vehicle: form.vehicle,
      driver: form.driver,
      origin: form.origin,
      destination: form.destination,
      cargo: cargoNum,
      status: 'Dispatched',
      date: new Date().toISOString().split('T')[0],
      fuel: form.fuelEstimate || '—',
      distance: '—',
    };
    setTrips([newTrip, ...trips]);
    setValidation({ type: 'success', msg: `Trip ${newTrip.id} dispatched successfully!` });
    setTimeout(() => { setModalOpen(false); setValidation(null); setForm({ vehicle: '', driver: '', cargo: '', origin: '', destination: '', fuelEstimate: '' }); }, 1500);
  };

  const filtered = trips.filter(t => filterStatus === 'All' || t.status === filterStatus);

  return (
    <Layout title="Trip Dispatcher" subtitle="Cargo assignment & route management">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-2">
          {['All', 'Dispatched', 'Completed', 'Cancelled', 'Draft'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === s ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'text-silver-500 hover:text-silver-300 border border-transparent hover:border-white/10'}`}>{s}</button>
          ))}
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary ml-auto flex items-center gap-2 text-white">
          <Plus size={16} /> New Trip
        </button>
      </div>

      {/* Trips list */}
      <div className="space-y-3">
        {filtered.map((trip, i) => (
          <div
            key={trip.id}
            className={`glass-card-hover p-5 border-l-2 ${statusColors[trip.status] || 'border-l-white/20'} group`}
            style={{ animation: `fadeUp 0.4s ease-out ${i * 50}ms both` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-xs font-mono text-cyan-400">{trip.id}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={11} className="text-silver-600" />
                    <span className="text-xs text-silver-500 font-mono">{trip.date}</span>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-white/3 border border-white/8 rounded-lg px-3 py-1.5">
                    <Truck size={12} className="text-silver-500" />
                    <span className="text-xs text-silver-300">{trip.vehicle}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/3 border border-white/8 rounded-lg px-3 py-1.5">
                    <User size={12} className="text-silver-500" />
                    <span className="text-xs text-silver-300">{trip.driver}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-2 text-xs text-silver-400">
                  <MapPin size={12} className="text-silver-600" />
                  <span>{trip.origin}</span>
                  <ChevronRight size={12} className="text-silver-600" />
                  <span>{trip.destination}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-silver-300">{trip.cargo.toLocaleString()} kg</p>
                  <p className="text-xs text-silver-600">{trip.distance}</p>
                </div>
                <StatusBadge status={trip.status} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-12 text-center">
          <MapPin size={40} className="text-silver-700 mx-auto mb-3" />
          <p className="text-silver-500">No trips found for this filter</p>
        </div>
      )}

      {/* New Trip Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setValidation(null); }} title="Dispatch New Trip" size="lg">
        <div className="space-y-4">
          {validation && (
            <div className={`flex items-start gap-3 p-4 rounded-xl border ${validation.type === 'error' ? 'bg-rose-500/10 border-rose-500/25 text-rose-300' : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'}`}>
              {validation.type === 'error' ? <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" /> : <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />}
              <p className="text-sm">{validation.msg}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Select Vehicle</label>
              <select className="input-field" value={form.vehicle} onChange={e => { setForm({...form, vehicle: e.target.value}); setValidation(null); }}>
                <option value="">— Choose Vehicle —</option>
                {availableVehicles.map(v => (
                  <option key={v.id} value={v.name}>{v.name} ({v.capacity.toLocaleString()} kg max)</option>
                ))}
              </select>
              {selectedVehicle && (
                <p className="text-xs text-silver-500 font-mono mt-1">Max: {selectedVehicle.capacity.toLocaleString()} kg · {selectedVehicle.type}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Select Driver</label>
              <select className="input-field" value={form.driver} onChange={e => setForm({...form, driver: e.target.value})}>
                <option value="">— Choose Driver —</option>
                {availableDrivers.map(d => (
                  <option key={d.id} value={d.name}>{d.name} · Safety {d.safety}%</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Cargo Weight (kg)</label>
            <input className="input-field" type="number" placeholder="e.g. 4500" value={form.cargo} onChange={e => { setForm({...form, cargo: e.target.value}); setValidation(null); }} />
            {selectedVehicle && cargoNum > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className={cargoNum > selectedVehicle.capacity ? 'text-rose-400' : 'text-silver-500'}>
                    Load: {cargoNum.toLocaleString()} kg
                  </span>
                  <span className="text-silver-500">Cap: {selectedVehicle.capacity.toLocaleString()} kg</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${cargoNum > selectedVehicle.capacity ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min((cargoNum / selectedVehicle.capacity) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Origin</label>
              <input className="input-field" placeholder="e.g. Mumbai Warehouse" value={form.origin} onChange={e => setForm({...form, origin: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Destination</label>
              <input className="input-field" placeholder="e.g. Pune Hub" value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Estimated Fuel Cost (optional)</label>
            <input className="input-field" placeholder="e.g. ₹3,500" value={form.fuelEstimate} onChange={e => setForm({...form, fuelEstimate: e.target.value})} />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleDispatch} className="btn-primary flex-1 text-white h-11 flex items-center justify-center gap-2">
              <MapPin size={16} /> Confirm & Dispatch
            </button>
            <button onClick={() => { setModalOpen(false); setValidation(null); }} className="btn-ghost flex-1 h-11">Cancel</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}