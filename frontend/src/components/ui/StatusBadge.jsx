const statusMap = {
  'On Trip': 'status-cyan',
  'Available': 'status-online',
  'In Shop': 'status-warning',
  'Retired': 'status-inactive',
  'Dispatched': 'status-cyan',
  'Completed': 'status-online',
  'Cancelled': 'status-danger',
  'Draft': 'status-inactive',
  'On Duty': 'status-online',
  'Off Duty': 'status-inactive',
  'Suspended': 'status-danger',
  'In Progress': 'status-warning',
};

const dotMap = {
  'On Trip': 'bg-cyan-400',
  'Available': 'bg-emerald-400',
  'In Shop': 'bg-amber-400',
  'Retired': 'bg-silver-500',
  'Dispatched': 'bg-cyan-400',
  'Completed': 'bg-emerald-400',
  'Cancelled': 'bg-rose-400',
  'Draft': 'bg-silver-500',
  'On Duty': 'bg-emerald-400',
  'Off Duty': 'bg-silver-500',
  'Suspended': 'bg-rose-400',
  'In Progress': 'bg-amber-400',
};

export default function StatusBadge({ status }) {
  const cls = statusMap[status] || 'status-inactive';
  const dot = dotMap[status] || 'bg-silver-500';
  const isActive = ['On Trip', 'Available', 'Dispatched', 'On Duty', 'In Progress'].includes(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium font-mono ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} ${isActive ? 'animate-pulse' : ''}`} />
      {status}
    </span>
  );
}