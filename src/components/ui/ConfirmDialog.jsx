import React, { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "./Button";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah Anda yakin?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  variant = "danger",
  icon: CustomIcon = null,
}) => {
  const confirmButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus on cancel button by default (safer choice)
      cancelButtonRef.current?.focus();

      // Handle Escape key
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  const Icon = CustomIcon || AlertTriangle;

  return (
    <div
      className="fixed inset-0 z-[var(--z-index-modal)] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-[var(--color-bg-secondary)] rounded-2xl p-6 shadow-2xl shadow-black/40 border border-[var(--glass-border)] animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-[var(--color-bg-elevated)] rounded-lg transition-colors focus-ring"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5 text-[var(--color-text-muted)]" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`
              w-16 h-16 rounded-full flex items-center justify-center
              ${variant === "danger" 
                ? "bg-[var(--color-expense)]/15 text-[var(--color-expense)]" 
                : "bg-[var(--color-primary)]/15 text-[var(--color-primary)]"
              }
            `}
          >
            <Icon className="w-8 h-8" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3
            id="dialog-title"
            className="text-xl font-bold text-[var(--color-text-primary)] mb-2"
          >
            {title}
          </h3>
          <p
            id="dialog-description"
            className="text-[var(--color-text-secondary)] leading-relaxed"
          >
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Button
            ref={cancelButtonRef}
            variant="secondary"
            size="lg"
            onClick={onClose}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            ref={confirmButtonRef}
            variant={variant}
            size="lg"
            onClick={handleConfirm}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

