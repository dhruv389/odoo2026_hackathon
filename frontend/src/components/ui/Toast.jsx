import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
  error: 'from-rose-500/20 to-rose-500/5 border-rose-500/30 text-rose-400',
  warning: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400',
  info: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
};

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  const Icon = icons[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`toast-slide-in flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl bg-gradient-to-br ${colors[type]} shadow-2xl min-w-[320px] max-w-md`}>
      <Icon size={20} className="flex-shrink-0 mt-0.5" />
      <p className="text-sm text-silver-200 flex-1">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors text-silver-400 hover:text-silver-200"
      >
        <X size={16} />
      </button>
    </div>
  );
}
