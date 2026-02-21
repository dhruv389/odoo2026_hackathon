import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

const icons = {
  danger: AlertTriangle,
  success: CheckCircle,
  info: Info,
  warning: XCircle,
};

const colors = {
  danger: 'text-rose-400',
  success: 'text-emerald-400',
  info: 'text-cyan-400',
  warning: 'text-amber-400',
};

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
}) {
  if (!isOpen) return null;

  const Icon = icons[type];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative glass-card p-6 max-w-md w-full animate-scale-in">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type === 'danger' ? 'from-rose-500/20 to-rose-500/5' : type === 'success' ? 'from-emerald-500/20 to-emerald-500/5' : type === 'warning' ? 'from-amber-500/20 to-amber-500/5' : 'from-cyan-500/20 to-cyan-500/5'} flex items-center justify-center flex-shrink-0`}>
            <Icon size={24} className={colors[type]} />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg text-silver-200 mb-2">{title}</h3>
            <p className="text-sm text-silver-400 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="btn-ghost flex-1"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              type === 'danger'
                ? 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white'
                : type === 'success'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white'
                : 'btn-primary text-white'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
