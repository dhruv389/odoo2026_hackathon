export const vehicles = [
  { id: 'VH-001', name: 'Titan Hauler Pro', plate: 'MH-01-2024', type: 'Truck', capacity: 8000, odometer: 84320, status: 'On Trip', driver: 'John Mercer', fuel: 'Diesel' },
  { id: 'VH-002', name: 'Swift Van Elite', plate: 'MH-02-2031', type: 'Van', capacity: 1500, odometer: 42100, status: 'Available', driver: null, fuel: 'Petrol' },
  { id: 'VH-003', name: 'Atlas Freight X', plate: 'MH-03-1998', type: 'Truck', capacity: 12000, odometer: 120450, status: 'In Shop', driver: null, fuel: 'Diesel' },
  { id: 'VH-004', name: 'Echo Cargo Van', plate: 'GJ-01-5544', type: 'Van', capacity: 2000, odometer: 31200, status: 'Available', driver: null, fuel: 'CNG' },
  { id: 'VH-005', name: 'Nova Express', plate: 'GJ-02-7721', type: 'Truck', capacity: 6000, odometer: 55800, status: 'On Trip', driver: 'Sarah Chen', fuel: 'Diesel' },
  { id: 'VH-006', name: 'Blaze Bike Courier', plate: 'MH-05-3310', type: 'Bike', capacity: 50, odometer: 18900, status: 'Available', driver: null, fuel: 'Petrol' },
];

export const drivers = [
  { id: 'DR-001', name: 'John Mercer', license: 'MH20230045', expiry: '2026-04-10', category: 'HMV', trips: 142, completed: 138, safety: 94, status: 'On Duty', vehicle: 'VH-001' },
  { id: 'DR-002', name: 'Sarah Chen', license: 'GJ20210078', expiry: '2025-11-22', category: 'HMV', trips: 98, completed: 96, safety: 98, status: 'On Duty', vehicle: 'VH-005' },
  { id: 'DR-003', name: 'Marcus Webb', license: 'MH20190031', expiry: '2024-08-15', category: 'LMV', trips: 67, completed: 60, safety: 78, status: 'Suspended', vehicle: null },
  { id: 'DR-004', name: 'Priya Nair', license: 'KA20220099', expiry: '2027-01-30', category: 'LMV', trips: 201, completed: 199, safety: 99, status: 'Off Duty', vehicle: null },
  { id: 'DR-005', name: 'Dev Kapoor', license: 'MH20230112', expiry: '2026-07-19', category: 'HMV', trips: 55, completed: 53, safety: 91, status: 'Off Duty', vehicle: null },
];

export const trips = [
  { id: 'TR-2401', vehicle: 'Titan Hauler Pro', driver: 'John Mercer', origin: 'Mumbai Warehouse', destination: 'Pune Hub', cargo: 7200, status: 'Dispatched', date: '2024-02-21', fuel: '₹4,200', distance: '148 km' },
  { id: 'TR-2402', vehicle: 'Nova Express', driver: 'Sarah Chen', origin: 'Ahmedabad Depot', destination: 'Surat Factory', cargo: 5500, status: 'Dispatched', date: '2024-02-21', fuel: '₹3,800', distance: '265 km' },
  { id: 'TR-2400', vehicle: 'Echo Cargo Van', driver: 'Priya Nair', origin: 'Delhi Hub', destination: 'Gurgaon Zone B', cargo: 1800, status: 'Completed', date: '2024-02-20', fuel: '₹980', distance: '42 km' },
  { id: 'TR-2399', vehicle: 'Swift Van Elite', driver: 'Dev Kapoor', origin: 'Pune Hub', destination: 'Nashik Center', cargo: 1200, status: 'Completed', date: '2024-02-19', fuel: '₹1,600', distance: '210 km' },
  { id: 'TR-2398', vehicle: 'Atlas Freight X', driver: 'Marcus Webb', origin: 'Chennai Port', destination: 'Bangalore', cargo: 10000, status: 'Cancelled', date: '2024-02-18', fuel: '—', distance: '—' },
];

export const maintenance = [
  { id: 'SV-001', vehicle: 'Atlas Freight X', type: 'Engine Overhaul', date: '2024-02-18', cost: 48000, status: 'In Progress', tech: 'Rajan Auto Works' },
  { id: 'SV-002', vehicle: 'Titan Hauler Pro', type: 'Tyre Replacement', date: '2024-02-10', cost: 12000, status: 'Completed', tech: 'QuickFix Motors' },
  { id: 'SV-003', vehicle: 'Nova Express', type: 'Oil Change + Filter', date: '2024-02-05', cost: 3500, status: 'Completed', tech: 'FastLane Service' },
  { id: 'SV-004', vehicle: 'Echo Cargo Van', type: 'Brake Pad Replacement', date: '2024-01-28', cost: 8200, status: 'Completed', tech: 'PitStop Garage' },
];

export const expenses = [
  { id: 'EX-001', tripId: 'TR-2401', driver: 'John Mercer', distance: 148, liters: 32, cost: 4200, date: '2024-02-21', vehicle: 'Titan Hauler Pro' },
  { id: 'EX-002', tripId: 'TR-2402', driver: 'Sarah Chen', distance: 265, liters: 28, cost: 3800, date: '2024-02-21', vehicle: 'Nova Express' },
  { id: 'EX-003', tripId: 'TR-2400', driver: 'Priya Nair', distance: 42, liters: 8, cost: 980, date: '2024-02-20', vehicle: 'Echo Cargo Van' },
  { id: 'EX-004', tripId: 'TR-2399', driver: 'Dev Kapoor', distance: 210, liters: 18, cost: 1600, date: '2024-02-19', vehicle: 'Swift Van Elite' },
];

export const analyticsData = {
  monthly: [
    { month: 'Sep', revenue: 820000, fuel: 142000, maintenance: 38000 },
    { month: 'Oct', revenue: 940000, fuel: 156000, maintenance: 52000 },
    { month: 'Nov', revenue: 880000, fuel: 148000, maintenance: 29000 },
    { month: 'Dec', revenue: 1120000, fuel: 198000, maintenance: 63000 },
    { month: 'Jan', revenue: 1050000, fuel: 172000, maintenance: 41000 },
    { month: 'Feb', revenue: 1340000, fuel: 210000, maintenance: 48000 },
  ],
  fuelEfficiency: [
    { vehicle: 'Titan Hauler Pro', efficiency: 4.6 },
    { vehicle: 'Swift Van Elite', efficiency: 11.7 },
    { vehicle: 'Atlas Freight X', efficiency: 3.9 },
    { vehicle: 'Echo Cargo Van', efficiency: 14.2 },
    { vehicle: 'Nova Express', efficiency: 5.3 },
  ],
};