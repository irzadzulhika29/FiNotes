import React, { useState, useEffect, useRef } from "react";
import { X, Banknote } from "lucide-react";
import Button from "./ui/Button";
import Input from "./ui/Input";

const categories = {
  income: [
    { value: "salary", label: "Gaji" },
    { value: "freelance", label: "Freelance" },
    { value: "investment", label: "Investasi" },
    { value: "gift", label: "Hadiah" },
    { value: "other_income", label: "Lainnya" },
  ],
  expense: [
    { value: "food", label: "Makanan" },
    { value: "transport", label: "Transportasi" },
    { value: "shopping", label: "Belanja" },
    { value: "bills", label: "Tagihan" },
    { value: "other_expense", label: "Lainnya" },
  ],
};

const TransactionModal = ({
  isOpen,
  onClose,
  onSave,
  editingTransaction,
  defaultMonth,
}) => {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    description: "",
    category: "food",
    date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const amountInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Reset errors when modal opens
      setErrors({});
      setIsSubmitting(false);

      if (editingTransaction) {
        setFormData({
          type: editingTransaction.type,
          amount: editingTransaction.amount.toString(),
          description: editingTransaction.description,
          category: editingTransaction.category,
          date: editingTransaction.date,
        });
      } else {
        // Set default date based on selected month
        if (defaultMonth) {
          const [year, month] = defaultMonth.split("-");
          setFormData((prev) => ({
            ...prev,
            type: "expense",
            amount: "",
            description: "",
            category: "food",
            date: `${year}-${month}-01`,
          }));
        } else {
          setFormData({
            type: "expense",
            amount: "",
            description: "",
            category: "food",
            date: new Date().toISOString().split("T")[0],
          });
        }
      }

      // Auto-focus on amount input after modal animation
      setTimeout(() => {
        amountInputRef.current?.focus();
      }, 100);
    }
  }, [editingTransaction, defaultMonth, isOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      type,
      category: type === "income" ? "salary" : "food",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Jumlah harus lebih dari 0";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi tidak boleh kosong";
    }

    if (!formData.date) {
      newErrors.date = "Tanggal harus diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 300));

      onSave({
        ...formData,
        amount: parseFloat(formData.amount),
        id: editingTransaction?.id || crypto.randomUUID(),
        createdAt: editingTransaction?.createdAt || new Date().toISOString(),
      });

      onClose();
    } catch (error) {
      setErrors({ submit: "Terjadi kesalahan. Silakan coba lagi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickAmounts = [
    { label: "100rb", value: 100000 },
    { label: "500rb", value: 500000 },
    { label: "1jt", value: 1000000 },
    { label: "5jt", value: 5000000 },
  ];

  const handleQuickAmount = (amount) => {
    setFormData((prev) => ({ ...prev, amount: amount.toString() }));
    setErrors((prev) => ({ ...prev, amount: null }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative w-full sm:max-w-xl bg-[var(--color-bg-secondary)] rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 animate-slide-up shadow-2xl shadow-black/40 border border-[var(--glass-border)]/80 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 id="modal-title" className="text-xl font-bold text-[var(--color-text-primary)]">
            {editingTransaction ? "Edit Transaksi" : "Tambah Transaksi"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-bg-elevated)] rounded-lg transition-colors focus-ring"
            aria-label="Tutup modal"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-[var(--color-text-muted)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Type Toggle */}
          <div className="flex gap-2 p-1 bg-[var(--color-bg-elevated)]/50 border border-[var(--glass-border)] rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              disabled={isSubmitting}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all focus-ring ${
                formData.type === "income"
                  ? "gradient-income text-white shadow-lg shadow-green-500/20"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]"
              }`}
              aria-pressed={formData.type === "income"}
              role="radio"
              aria-checked={formData.type === "income"}
            >
              Pemasukan
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              disabled={isSubmitting}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all focus-ring ${
                formData.type === "expense"
                  ? "gradient-expense text-white shadow-lg shadow-red-500/20"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]"
              }`}
              aria-pressed={formData.type === "expense"}
              role="radio"
              aria-checked={formData.type === "expense"}
            >
              Pengeluaran
            </button>
          </div>

          {/* Amount */}
          <div>
            <Input
              ref={amountInputRef}
              id="transaction-amount"
              label="Jumlah"
              type="number"
              prefix="Rp"
              value={formData.amount}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, amount: e.target.value }));
                setErrors((prev) => ({ ...prev, amount: null }));
              }}
              placeholder="0"
              className="text-2xl font-semibold tracking-tight"
              error={errors.amount}
              required
              disabled={isSubmitting}
              formatNumber
            />
            
            {/* Quick Amount Buttons */}
            {!editingTransaction && (
              <div className="mt-3 flex flex-wrap gap-2">
                {quickAmounts.map((quick) => (
                  <button
                    key={quick.value}
                    type="button"
                    onClick={() => handleQuickAmount(quick.value)}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium 
                             bg-[var(--color-bg-elevated)]/50 border border-[var(--glass-border)]
                             text-[var(--color-text-secondary)] 
                             hover:text-[var(--color-text-primary)] hover:border-[var(--color-primary)]/50
                             transition-all focus-ring disabled:opacity-50"
                  >
                    <Banknote className="w-3 h-3 inline mr-1" />
                    {quick.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <Input
            id="transaction-description"
            label="Deskripsi"
            type="text"
            value={formData.description}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, description: e.target.value }));
              setErrors((prev) => ({ ...prev, description: null }));
            }}
            placeholder="Contoh: Gaji bulan Desember"
            error={errors.description}
            required
            disabled={isSubmitting}
          />

          {/* Category */}
          <div role="group" aria-labelledby="category-label">
            <label 
              id="category-label"
              className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
            >
              Kategori
            </label>
            <div className="flex flex-wrap gap-2">
              {categories[formData.type].map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, category: cat.value }))
                  }
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border focus-ring ${
                    formData.category === cat.value
                      ? formData.type === "income"
                        ? "gradient-income text-white border-transparent shadow-lg shadow-green-500/20"
                        : "gradient-expense text-white border-transparent shadow-lg shadow-red-500/20"
                      : "bg-[var(--color-bg-elevated)]/50 border-[var(--glass-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-primary)]/50"
                  }`}
                  aria-pressed={formData.category === cat.value}
                  role="radio"
                  aria-checked={formData.category === cat.value}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <Input
            id="transaction-date"
            label="Tanggal"
            type="date"
            value={formData.date}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, date: e.target.value }));
              setErrors((prev) => ({ ...prev, date: null }));
            }}
            error={errors.date}
            required
            disabled={isSubmitting}
          />

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 rounded-xl bg-[var(--color-expense)]/15 border border-[var(--color-expense)]/30">
              <p className="text-sm text-[var(--color-expense)]">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant={formData.type === "income" ? "income" : "expense"}
            size="lg"
            className="w-full"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {editingTransaction ? "Simpan Perubahan" : "Tambah Transaksi"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
