import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Auto close after duration
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const styles = {
    success: "bg-[var(--color-success)]/15 border-[var(--color-success)]/30 text-[var(--color-success)]",
    error: "bg-[var(--color-error)]/15 border-[var(--color-error)]/30 text-[var(--color-error)]",
    warning: "bg-[var(--color-warning)]/15 border-[var(--color-warning)]/30 text-[var(--color-warning)]",
    info: "bg-[var(--color-info)]/15 border-[var(--color-info)]/30 text-[var(--color-info)]",
  };

  const Icon = icons[type];

  return (
    <div
      className={`
        fixed top-4 right-4 z-[var(--z-index-tooltip)] 
        flex items-center gap-3 px-4 py-3 rounded-xl
        border backdrop-blur-xl shadow-2xl
        transition-all duration-300 ease-out
        safe-top safe-right
        ${styles[type]}
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
      role="alert"
      aria-live="polite"
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium text-[var(--color-text-primary)] pr-2">
        {message}
      </p>
      <button
        onClick={handleClose}
        className="p-1 hover:bg-white/10 rounded-lg transition-colors focus-ring"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 text-[var(--color-text-muted)]" />
      </button>
    </div>
  );
};

// Toast Container Component
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-0 right-0 z-[var(--z-index-tooltip)] pointer-events-none">
      <div className="flex flex-col gap-2 p-4 pointer-events-auto">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success", duration = 3000) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showSuccess = (message, duration) => addToast(message, "success", duration);
  const showError = (message, duration) => addToast(message, "error", duration);
  const showWarning = (message, duration) => addToast(message, "warning", duration);
  const showInfo = (message, duration) => addToast(message, "info", duration);

  return {
    toasts,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default Toast;

