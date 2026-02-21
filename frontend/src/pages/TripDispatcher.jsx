import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { Plus, MapPin, User, Truck, Package, Calendar, ChevronRight } from 'lucide-react';
import { tripAPI, vehicleAPI, driverAPI } from '../services/api';

export default function TripDispatcher() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    vehicle: '',
    driver: '',
    cargo: '',
    origin: '',
    destination: '',
    distance: '',
    fuel: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tripsData, vehiclesData, driversData] = await Promise.all([
        tripAPI.getAll(),
        vehicleAPI.getAll(),
        driverAPI.getAll()
      ]);
      setTrips(tripsData);
      setVehicles(vehiclesData);
      setDrivers(driversData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  const availableDrivers = drivers.filter(d => d.status === 'Off Duty');

  const handleCreate = async () => {
    try {
      const selectedVehicle = vehicles.find(v => v._id === form.vehicle);
      
      if (Number(form.cargo) > selectedVehicle.capacity) {
        alert(`Cargo weight (${form.cargo} kg) exceeds vehicle capacity (${selectedVehicle.capacity} kg)`);
        return;
      }

      await tripAPI.create({
        ...form,
        cargo: Number(form.cargo)
      });
      
      await fetchData();
      setModalOpen(false);
      setForm({ vehicle: '', driver: '', cargo: '', origin: '', destination: '', distance: '', fuel: '' });
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Failed to create trip: ' + error.message);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await tripAPI.updateStatus(id, status);
      await fetchData();
    } catch (error) {
      console.error('Error updating trip status:', error);
    }
  };

  if (loading) {
    return (
      <Layout title="Trip Dispatcher" subtitle="Cargo assignment & routing">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Trip Dispatcher" subtitle="Cargo assignment & routing">
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 text-silver-300 border-white/10">
          <span className="font-display text-xl">{trips.length}</span>
          <span className="text-xs opacity-80">Total Trips</span>
        </div>
        <div className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 text-cyan-400 border-cyan-500/20 bg-cyan-500/5">
          <span className="font-display text-xl">{trips.filter(t => t.status === 'Dispatched').length}</span>
          <span className="text-xs opacity-80">Active</span>
        </div>
        <div className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 text-emerald-400 border-emerald-500/20 bg-emerald-500/5">
          <span className="font-display text-xl">{trips.filter(t => t.status === 'Completed').length}</span>
          <span className="text-xs opacity-80">Completed</span>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary ml-auto flex items-center gap-2 text-white">
          <Plus size={16} /> Create Trip
        </button>
      </div>

      <div className="glass-card p-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                {['Trip ID', 'Vehicle', 'Driver', 'Route', 'Cargo', 'Distance', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs text-silver-500 uppercase tracking-widest font-mono pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trips.map((trip, i) => (
                <tr key={trip._id} className="table-row" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="py-3 pr-4">
                    <span className="text-xs font-mono text-cyan-400">{trip.tripId || trip._id.slice(-6)}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Truck size={12} className="text-silver-500" />
                      <span className="text-xs text-silver-300">{trip.vehicle?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <User size={12} className="text-silver-500" />
                      <span className="text-xs text-silver-300">{trip.driver?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1 text-xs text-silver-400">
                      <MapPin size={10} className="text-silver-600" />
                      <span>{trip.origin}</span>
                      <ChevronRight size={10} className="text-silver-600" />
                      <span>{trip.destination}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-xs font-mono text-silver-300">{trip.cargo} kg</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-xs text-silver-400">{trip.distance}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={trip.status} />
                  </td>
                  <td className="py-3 pr-4">
                    {trip.status === 'Draft' && (
                      <button 
                        onClick={() => handleStatusUpdate(trip._id, 'Dispatched')}
                        className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                      >
                        Dispatch
                      </button>
                    )}
                    {trip.status === 'Dispatched' && (
                      <button 
                        onClick={() => handleStatusUpdate(trip._id, 'Completed')}
                        className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Trip">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Select Vehicle</label>
            <select className="input-field" value={form.vehicle} onChange={e => setForm({ ...form, vehicle: e.target.value })}>
              <option value="">Choose vehicle...</option>
              {availableVehicles.map(v => (
                <option key={v._id} value={v._id}>{v.name} - {v.plate} (Capacity: {v.capacity} kg)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Select Driver</label>
            <select className="input-field" value={form.driver} onChange={e => setForm({ ...form, driver: e.target.value })}>
              <option value="">Choose driver...</option>
              {availableDrivers.map(d => (
                <option key={d._id} value={d._id}>{d.name} - {d.license} (Safety: {d.safety}%)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Origin</label>
              <input className="input-field" value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} placeholder="Delhi Hub" />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Destination</label>
              <input className="input-field" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} placeholder="Mumbai Center" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Cargo (kg)</label>
              <input className="input-field" type="number" value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} placeholder="1500" />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Distance</label>
              <input className="input-field" value={form.distance} onChange={e => setForm({ ...form, distance: e.target.value })} placeholder="420 km" />
            </div>
            <div>
              <label className="text-xs text-silver-500 uppercase tracking-widest font-mono mb-1.5 block">Est. Fuel</label>
              <input className="input-field" value={form.fuel} onChange={e => setForm({ ...form, fuel: e.target.value })} placeholder="₹3,200" />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button>
            <button onClick={handleCreate} className="btn-primary flex-1 text-white">Create Trip</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
