import { createPortal } from 'react-dom';
import Toast from './Toast';

export default function ToastContainer({ toasts, removeToast }) {
  return createPortal(
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
}
